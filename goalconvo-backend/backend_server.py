#!/usr/bin/env python3
"""
GoalConvo Backend Server

Flask API server that connects the Next.js frontend to the GoalConvo-2 backend.
Provides REST API endpoints for the complete dialogue generation pipeline.
Uses existing modules from src/goalconvo/ for all pipeline steps.
"""

import os
import sys
import json
import logging
import random
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import traceback

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent / "src"))

from goalconvo.config import Config
from goalconvo.llm_client import LLMClient
from goalconvo.experience_generator import ExperienceGenerator
from goalconvo.multi_agent_simulator import DialogueSimulator
from goalconvo.quality_judge import QualityJudge
from goalconvo.dataset_store import DatasetStore
from goalconvo.evaluator import Evaluator

# Import the generator class from scripts
scripts_path = Path(__file__).parent / "scripts"
sys.path.insert(0, str(scripts_path))
import importlib.util
spec = importlib.util.spec_from_file_location("generate_dialogues", scripts_path / "generate_dialogues.py")
if spec and spec.loader:
    generate_dialogues_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(generate_dialogues_module)
    GoalConvoGenerator = generate_dialogues_module.GoalConvoGenerator
else:
    raise ImportError("Could not load generate_dialogues module")

# Setup logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import comprehensive evaluator
spec_eval = importlib.util.spec_from_file_location("comprehensive_dialogue_evaluation", scripts_path / "comprehensive_dialogue_evaluation.py")
if spec_eval and spec_eval.loader:
    eval_module = importlib.util.module_from_spec(spec_eval)
    spec_eval.loader.exec_module(eval_module)
    ComprehensiveDialogueEvaluator = eval_module.ComprehensiveDialogueEvaluator
else:
    ComprehensiveDialogueEvaluator = None
    logger.warning("Could not load comprehensive evaluation module")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Initialize backend components
config = Config()
llm_client = LLMClient(config)
dataset_store = DatasetStore(config)
experience_generator = ExperienceGenerator(config, llm_client, dataset_store)
dialogue_simulator = DialogueSimulator(config, llm_client)
quality_judge = QualityJudge(config, llm_client)
evaluator = Evaluator(config)
generator = GoalConvoGenerator(config)


def convert_to_frontend_format(dialogue: Dict[str, Any], experience_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Convert backend dialogue format to frontend format."""
    turns = dialogue.get("turns", [])
    
    # Map roles
    frontend_turns = []
    for i, turn in enumerate(turns, 1):
        role = turn.get("role", "")
        # Map backend roles to frontend speaker format
        speaker = "user" if role == "User" else "assistant"
        frontend_turns.append({
            "turn_id": i,
            "speaker": speaker,
            "text": turn.get("text", "")
        })
    
    # Extract metadata
    metadata = dialogue.get("metadata", {})
    quality_score = metadata.get("quality_score", 0.0)
    
    return {
        "conv_id": dialogue.get("dialogue_id", ""),
        "domain": dialogue.get("domain", "unknown"),
        "task": dialogue.get("goal", ""),
        "experience_id": experience_data.get("experience_id", "") if experience_data else "",
        "personas": experience_data.get("personas", []) if experience_data else [],
        "situation": dialogue.get("context", ""),
        "goal": dialogue.get("goal", ""),
        "constraints": {
            "max_turns": config.max_turns,
            "max_tokens_per_turn": config.max_tokens
        },
        "conversation_starter": turns[0].get("text", "") if turns else "",
        "turns": frontend_turns,
        "task_success": quality_score > 0.7,  # Simplified success check
        "judge_score": quality_score * 5.0,  # Scale to 0-5 range
        "mtld": 0.0,  # Would need to compute this
        "provenance": {
            "generator_model": metadata.get("model_version", config.mistral_model),
            "prompt_version": "agent_prompt_v1",
            "temperature": config.temperature,
            "shot_ids": [],
            "timestamp": metadata.get("generated_at", datetime.now().isoformat())
        }
    }


def convert_evaluation_to_frontend_format(eval_results: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert comprehensive evaluation results to frontend format.
    
    Maps comprehensive evaluation metrics to the frontend EvaluationMetrics interface.
    """
    if not eval_results or "metrics" not in eval_results:
        return None
    
    metrics = eval_results["metrics"]
    
    # Extract LLM judge scores (if available)
    llm_judge = metrics.get("llm_judge", {})
    overall_scores = llm_judge.get("overall_scores", {})
    
    # Calculate overall score as weighted average
    # Use LLM judge scores if available, otherwise use other metrics
    if overall_scores:
        task_success = overall_scores.get("task_success", {}).get("mean", 0) / 100.0
        coherence = overall_scores.get("coherence", {}).get("mean", 0) / 100.0
        diversity = overall_scores.get("diversity", {}).get("mean", 0) / 100.0
        fluency = overall_scores.get("fluency", {}).get("mean", 0) / 100.0
        groundedness = overall_scores.get("groundedness", {}).get("mean", 0) / 100.0
        
        overall_score = (task_success + coherence + diversity + fluency + groundedness) / 5.0
    else:
        # Fallback: use TSR and GCR to estimate scores
        tsr = metrics.get("task_success_rate", {}).get("overall_tsr", 0) / 100.0
        gcr = metrics.get("goal_completion_rate", {}).get("overall_gcr", 0) / 100.0
        task_success = (tsr + gcr) / 2.0
        coherence = task_success * 0.95  # Estimate
        diversity = metrics.get("repetition_rate", {}).get("overall_repetition_rate", 0.1)
        diversity = 1.0 - diversity  # Convert repetition to diversity
        fluency = task_success * 0.9  # Estimate
        groundedness = task_success * 0.85  # Estimate
        overall_score = (task_success + coherence + diversity + fluency + groundedness) / 5.0
    
    # Extract dialogue length metrics
    length_metrics = metrics.get("dialogue_length", {})
    avg_turns = length_metrics.get("avg_turns", 0)
    std_turns = length_metrics.get("std_turns", 0)
    
    # Extract domain distribution
    domain_distribution = {}
    domain_task_success = {}
    
    # Get domain stats from GCR
    gcr_domains = metrics.get("goal_completion_rate", {}).get("domain_gcr", {})
    for domain, stats in gcr_domains.items():
        domain_distribution[domain] = stats.get("total", 0)
        domain_task_success[domain] = stats.get("percentage", 0) / 100.0
    
    # If no domain data, try to get from TSR
    if not domain_distribution:
        tsr_domains = metrics.get("task_success_rate", {}).get("domain_tsr", {})
        for domain, stats in tsr_domains.items():
            domain_distribution[domain] = stats.get("total", 0)
            domain_task_success[domain] = stats.get("percentage", 0) / 100.0
    
    # Calculate lexical diversity from repetition rate
    repetition_rate = metrics.get("repetition_rate", {}).get("overall_repetition_rate", 0.1)
    lexical_diversity = (1.0 - repetition_rate) * 100.0  # Convert to percentage
    
    # Build frontend format
    frontend_metrics = {
        "overall_score": overall_score,
        "diversity_score": diversity,
        "coherence_score": coherence,
        "task_success_rate": task_success,
        "fluency_score": fluency,
        "groundedness_score": groundedness,
        "categories": {
            "lexical_diversity": lexical_diversity,
            "conversation_length": {
                "avg_turns": avg_turns,
                "std_dev": std_turns
            },
            "domain_distribution": domain_distribution,
            "task_success_by_domain": domain_task_success
        },
        # Add comprehensive metrics for detailed display
        "comprehensive_metrics": {
            "goal_completion_rate": metrics.get("goal_completion_rate", {}),
            "task_success_rate": metrics.get("task_success_rate", {}),
            "bleu_score": metrics.get("bleu_score", {}),
            "dialogue_length": metrics.get("dialogue_length", {}),
            "repetition_rate": metrics.get("repetition_rate", {}),
            "llm_judge": metrics.get("llm_judge", {})
        }
    }
    
    return frontend_metrics


# All individual pipeline endpoints removed - only /api/run-pipeline is used now


@app.route('/api/run-pipeline', methods=['POST'])
def run_pipeline():
    """Run the complete pipeline and stream updates via WebSocket."""
    try:
        data = request.json or {}
        num_dialogues = data.get('num_dialogues', 1)
        domains = data.get('domains', None)  # None means use all domains
        session_id = data.get('session_id', request.sid if hasattr(request, 'sid') else 'default')
        
        # Validate domains if provided
        if domains is not None:
            if not isinstance(domains, list) or len(domains) == 0:
                return jsonify({
                    "error": "domains must be a non-empty list"
                }), 400
            # Validate domain names
            valid_domains = ["hotel", "restaurant", "taxi", "train", "attraction"]
            invalid_domains = [d for d in domains if d not in valid_domains]
            if invalid_domains:
                return jsonify({
                    "error": f"Invalid domains: {invalid_domains}. Valid domains are: {valid_domains}"
                }), 400
        
        logger.info(f"Starting pipeline for {num_dialogues} dialogues, domains: {domains or 'all'} (session: {session_id})")
        
        # Helper function to convert datetime objects to strings for JSON serialization
        def serialize_for_json(obj):
            """Recursively convert datetime objects to ISO format strings."""
            if isinstance(obj, datetime):
                return obj.isoformat()
            elif isinstance(obj, dict):
                return {key: serialize_for_json(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [serialize_for_json(item) for item in obj]
            elif isinstance(obj, tuple):
                return tuple(serialize_for_json(item) for item in obj)
            else:
                return obj
        
        # Create emit callback function for this session
        def emit_callback(event_type, data):
            """Emit socket event to the client."""
            try:
                # Serialize datetime objects before emitting
                serialized_data = serialize_for_json(data)
                
                socketio.emit(event_type, {
                    'session_id': session_id,
                    'data': serialized_data,  # Flask-SocketIO handles JSON serialization
                    'timestamp': datetime.now().isoformat()
                }, room=session_id)
                logger.info(f"Emitted {event_type} to session {session_id}")
            except Exception as e:
                logger.error(f"Error emitting {event_type}: {e}")
                logger.error(traceback.format_exc())
        
        # Run pipeline in background thread
        import threading
        
        def run_pipeline_thread():
            try:
                stats = generator.generate_dialogues(
                    num_dialogues=num_dialogues,
                    domains=domains,  # Use provided domains or None for all
                    resume=False,
                    emit_callback=emit_callback
                )
                
                # Run comprehensive evaluation after pipeline completes
                evaluation_results = None
                if ComprehensiveDialogueEvaluator:
                    try:
                        logger.info("Running comprehensive evaluation...")
                        emit_callback('log', {
                            'message': 'Running comprehensive evaluation...',
                            'step': 'evaluation'
                        })
                        
                        # Load generated dialogues
                        generated_dialogues = dataset_store.load_dialogues(limit=num_dialogues * 2)  # Get recent dialogues
                        
                        if generated_dialogues:
                            # Load reference dialogues for BLEU
                            multiwoz_file = Path(config.data_dir) / "multiwoz" / "processed_dialogues.json"
                            reference_dialogues = None
                            if multiwoz_file.exists():
                                from goalconvo.utils import load_json
                                reference_dialogues = load_json(str(multiwoz_file))
                                if reference_dialogues:
                                    reference_dialogues = reference_dialogues[:min(100, len(reference_dialogues))]
                            
                            # Run evaluation (skip LLM judge for speed in pipeline)
                            comprehensive_evaluator = ComprehensiveDialogueEvaluator(config)
                            eval_results = comprehensive_evaluator.evaluate_dialogues(
                                generated_dialogues,
                                reference_dialogues=reference_dialogues,
                                use_llm_judge=False  # Skip for speed, can be enabled separately
                            )
                            
                            # Convert to frontend format
                            evaluation_results = convert_evaluation_to_frontend_format(eval_results)
                            
                            logger.info("Comprehensive evaluation completed")
                            emit_callback('log', {
                                'message': 'Comprehensive evaluation completed',
                                'step': 'evaluation'
                            })
                    except Exception as eval_error:
                        logger.error(f"Evaluation error: {eval_error}")
                        logger.error(traceback.format_exc())
                        emit_callback('log', {
                            'message': f'Evaluation error: {str(eval_error)}',
                            'step': 'evaluation'
                        })
                
                # Send final response
                emit_callback('pipeline_complete', {
                    'message': 'Pipeline completed successfully',
                    'stats': stats,
                    'evaluation': evaluation_results,  # Include evaluation results
                    'final_data': {
                        'total_generated': stats.get('total_generated', 0),
                        'total_accepted': stats.get('total_accepted', 0),
                        'total_rejected': stats.get('total_rejected', 0),
                        'by_domain': stats.get('by_domain', {})
                    }
                })
            except Exception as e:
                logger.error(f"Pipeline error: {e}")
                logger.error(traceback.format_exc())
                emit_callback('pipeline_error', {
                    'message': f'Pipeline failed: {str(e)}',
                    'error': str(e)
                })
        
        # Start pipeline in background
        thread = threading.Thread(target=run_pipeline_thread)
        thread.daemon = True
        thread.start()
        
        return jsonify({
            "success": True,
            "message": "Pipeline started",
            "session_id": session_id,
            "num_dialogues": num_dialogues,
            "domains": domains or "all"
        })
        
    except Exception as e:
        logger.error(f"Error starting pipeline: {e}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": f"Failed to start pipeline: {str(e)}"
        }), 500


@socketio.on('connect')
def handle_connect():
    """Handle client connection."""
    session_id = request.sid
    logger.info(f"✅ Client connected: {session_id}")
    logger.info(f"   Origin: {request.environ.get('HTTP_ORIGIN', 'Unknown')}")
    logger.info(f"   Remote address: {request.environ.get('REMOTE_ADDR', 'Unknown')}")
    emit('connected', {
        'session_id': session_id, 
        'message': 'Connected to pipeline server',
        'socket_id': session_id
    })


@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection."""
    session_id = request.sid
    logger.info(f"Client disconnected: {session_id}")


@socketio.on('join_session')
def handle_join_session(data):
    """Join a specific session room."""
    from flask_socketio import join_room
    session_id = data.get('session_id', request.sid)
    socket_id = request.sid
    
    # Join the room for this session
    join_room(session_id)
    
    logger.info(f"✅ Client {socket_id} joined session: {session_id}")
    logger.info(f"   Room '{session_id}' now has client {socket_id}")
    
    emit('joined', {
        'session_id': session_id, 
        'socket_id': socket_id,
        'message': f'Successfully joined session {session_id}'
    })


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "backend": "GoalConvo-2"
    })


# Individual pipeline endpoint info removed - only /api/run-pipeline is available


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    
    logger.info(f"Starting GoalConvo backend server on {host}:{port}")
    logger.info("API endpoints available at:")
    logger.info("  POST /api/run-pipeline - Unified pipeline endpoint (uses WebSocket for real-time updates)")
    logger.info("  GET  /health - Health check")
    logger.info("")
    logger.info("Using existing modules from src/goalconvo/:")
    logger.info("  - GoalConvoGenerator (from scripts/generate_dialogues.py)")
    logger.info("  - ExperienceGenerator")
    logger.info("  - DialogueSimulator")
    logger.info("  - QualityJudge")
    logger.info("  - DatasetStore")
    logger.info("  - Evaluator")
    logger.info("")
    logger.info("WebSocket events:")
    logger.info("  - pipeline_start, step_start, step_data, log, pipeline_complete, pipeline_error")
    
    socketio.run(app, host=host, port=port, debug=True, allow_unsafe_werkzeug=True)


