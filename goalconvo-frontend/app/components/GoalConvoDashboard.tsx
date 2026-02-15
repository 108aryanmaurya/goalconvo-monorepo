'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Users, Filter, Database, TrendingUp, Play, RotateCcw, Download } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { API_CONFIG } from '@/lib/api-config';
import ExperienceGenerator from './ExperienceGenerator';
import MultiAgentSimulator from './MultiAgentSimulator';
import PostProcessor from './PostProcessor';
import DatasetConstructor from './DatasetConstructor';
import Evaluator from './Evaluator';

interface Experience {
  experience_id: string;
  domain: string;
  task: string;
  personas: Array<{
    role: string;
    name: string;
    traits: string[];
    memory?: string[];
  }>;
  situation: string;
  goal: string;
  constraints: {
    max_turns: number;
    max_tokens_per_turn: number;
  };
  conversation_starter: string;
}

interface Conversation {
  conv_id: string;
  domain: string;
  task: string;
  experience_id: string;
  personas: Array<{
    role: string;
    name: string;
    traits: string[];
    memory?: string[];
  }>;
  situation: string;
  goal: string;
  constraints: {
    max_turns: number;
    max_tokens_per_turn: number;
  };
  conversation_starter: string;
  turns: Array<{
    turn_id: number;
    speaker: string;
    text: string;
  }>;
  task_success: boolean;
  judge_score: number;
  mtld: number;
  provenance: {
    generator_model: string;
    prompt_version: string;
    temperature: number;
    shot_ids: string[];
    timestamp: string;
  };
}

interface FilteredConversation {
  id: string;
  original_id: string;
  status: 'kept' | 'removed' | 'modified';
  reason: string;
  score: number;
  metadata: {
    similarity_score?: number;
    fluency_score?: number;
    coherence_score?: number;
    task_success_score?: number;
  };
}

interface DatasetItem {
  id: string;
  conv_id: string;
  domain: string;
  task: string;
  personas: Array<{
    name: string;
    role: string;
    traits: string[];
  }>;
  turns: Array<{
    speaker: string;
    text: string;
    turn_id: number;
  }>;
  task_success: boolean;
  metadata: {
    total_turns: number;
    domain_category: string;
    creation_timestamp: string;
    quality_score: number;
  };
}

interface EvaluationMetrics {
  overall_score: number;
  diversity_score: number;
  coherence_score: number;
  task_success_rate: number;
  fluency_score: number;
  groundedness_score: number;
  categories: {
    lexical_diversity: number;
    conversation_length: {
      avg_turns: number;
      std_dev: number;
    };
    domain_distribution: Record<string, number>;
    task_success_by_domain: Record<string, number>;
  };
}

interface PipelineStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed' | 'error';
  progress: number;
  component: React.ReactNode;
}

interface RequestLogEntry {
  id: string;
  stepId: string;
  stepName: string;
  endpoint: string;
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

export default function GoalConvoDashboard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pipelineRunId, setPipelineRunId] = useState(0);
  const [pipelineData, setPipelineData] = useState<{
    experiences: Experience[];
    conversations: Conversation[];
    filteredConversations: FilteredConversation[];
    dataset: DatasetItem[];
    evaluations: EvaluationMetrics | null;
  }>({
    experiences: [],
    conversations: [],
    filteredConversations: [],
    dataset: [],
    evaluations: null
  });
  const [requestLogs, setRequestLogs] = useState<RequestLogEntry[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const sessionIdRef = useRef<string>(uuidv4());
  
  // Pipeline configuration state
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['hotel']);
  const [numDialogues, setNumDialogues] = useState<number>(1);
  
  // Backend connection status
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [backendCheckInProgress, setBackendCheckInProgress] = useState<boolean>(false);
  
  // Available domains
  const availableDomains = ['hotel', 'restaurant', 'taxi', 'train', 'attraction'];

  // Check backend health on mount and periodically
  useEffect(() => {
    const checkBackendHealth = async () => {
      setBackendCheckInProgress(true);
      try {
        const isHealthy = await API_CONFIG.checkHealth();
        setBackendConnected(isHealthy);
        if (isHealthy) {
          console.log('✅ Backend is healthy');
        } else {
          console.warn('⚠️ Backend health check failed');
        }
      } catch (error) {
        console.error('❌ Backend health check error:', error);
        setBackendConnected(false);
      } finally {
        setBackendCheckInProgress(false);
      }
    };

    // Check immediately
    checkBackendHealth();

    // Check every 10 seconds
    const healthCheckInterval = setInterval(checkBackendHealth, 10000);

    return () => clearInterval(healthCheckInterval);
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    const socketUrl = API_CONFIG.getSocketUrl();
    console.log('🔌 Connecting to WebSocket:', socketUrl);
    
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });
    
    socketRef.current = socket;
    
    // Connection status tracking
    socket.on('connect', () => {
      console.log('✅ WebSocket connected:', socket.id);
      setBackendConnected(true);
      addRequestLog({
        stepId: 'connection',
        stepName: 'WebSocket Connection',
        endpoint: '/socket',
        status: 'success',
        message: `Connected to pipeline server (ID: ${socket.id})`
      });
      
      // Join session immediately after connection
      socket.emit('join_session', { session_id: sessionIdRef.current });
    });
    
    socket.on('disconnect', (reason: string) => {
      console.log('❌ WebSocket disconnected:', reason);
      setBackendConnected(false);
      addRequestLog({
        stepId: 'connection',
        stepName: 'WebSocket Connection',
        endpoint: '/socket',
        status: 'error',
        message: `Disconnected: ${reason}`
      });
    });
    
    socket.on('connect_error', (error: Error) => {
      console.error('❌ WebSocket connection error:', error);
      setBackendConnected(false);
      const currentSocketUrl = API_CONFIG.getSocketUrl();
      addRequestLog({
        stepId: 'connection',
        stepName: 'WebSocket Connection',
        endpoint: '/socket',
        status: 'error',
        message: `Connection error: ${error.message}. Make sure the backend server is running on ${currentSocketUrl}`
      });
    });
    
    socket.on('reconnect', (attemptNumber: number) => {
      console.log('🔄 WebSocket reconnected after', attemptNumber, 'attempts');
      addRequestLog({
        stepId: 'connection',
        stepName: 'WebSocket Connection',
        endpoint: '/socket',
        status: 'success',
        message: `Reconnected after ${attemptNumber} attempts`
      });
    });
    
    // Server confirmation events
    socket.on('connected', (data: any) => {
      console.log('✅ Server confirmed connection:', data);
      addRequestLog({
        stepId: 'connection',
        stepName: 'WebSocket Connection',
        endpoint: '/socket',
        status: 'success',
        message: `Server confirmed: ${data.message || 'Connected'}`
      });
    });
    
    socket.on('joined', (data: any) => {
      console.log('✅ Joined session:', data);
      addRequestLog({
        stepId: 'connection',
        stepName: 'Session Join',
        endpoint: '/socket',
        status: 'success',
        message: `Joined session: ${data.session_id || 'unknown'}`
      });
    });
    
    // Pipeline events
    socket.on('pipeline_start', (data: any) => {
      console.log('Pipeline started:', data);
      addRequestLog({
        stepId: 'pipeline',
        stepName: 'Pipeline Start',
        endpoint: '/api/run-pipeline',
        status: 'success',
        message: data.data?.message || 'Pipeline started'
      });
      setIsRunning(true);
      setCurrentStep(0);
    });
    
    socket.on('step_start', (data: any) => {
      console.log('Step started:', data);
      const stepData = data.data || {};
      const stepName = stepData.step_name || stepData.step || 'Unknown Step';
      
      addRequestLog({
        stepId: stepData.step || 'unknown',
        stepName: stepName,
        endpoint: '/api/run-pipeline',
        status: 'success',
        message: stepData.message || `${stepName} started`
      });
      
      // Update current step based on step name
      const stepMap: Record<string, number> = {
        'experience_generation': 0,
        'dialogue_simulation': 1,
        'quality_filtering': 2,
        'saving': 3,
        'evaluation': 4
      };
      
      if (stepData.step && stepMap[stepData.step] !== undefined) {
        setCurrentStep(stepMap[stepData.step]);
      }
    });
    
    socket.on('step_data', (data: any) => {
      console.log('Step data received:', data);
      const stepData = data.data || {};
      const step = data.data?.step || stepData.step || 'unknown';
      
      // Only process events for the current session
      const eventSessionId = data.session_id;
      if (eventSessionId && eventSessionId !== sessionIdRef.current) {
        console.log(`Ignoring step_data event for different session: ${eventSessionId} (current: ${sessionIdRef.current})`);
        return;
      }
      
      // Update pipeline data based on step
      if (step === 'experience_generation' && stepData.data?.experience) {
        const exp = stepData.data.experience;
        const experience: Experience = {
          experience_id: exp.experience_id || `exp_${Date.now()}`,
          domain: exp.domain || 'unknown',
          task: exp.goal || exp.task || '',
          personas: [
            { role: 'user', name: exp.user_persona || 'User', traits: [], memory: [] },
            { role: 'assistant', name: 'SupportBot', traits: ['helpful', 'professional'], memory: [] }
          ],
          situation: exp.context || '',
          goal: exp.goal || '',
          constraints: { max_turns: 10, max_tokens_per_turn: 100 },
          conversation_starter: exp.first_utterance || ''
        };
        
        setPipelineData(prev => {
          // Check if this experience already exists (prevent duplicates)
          const existingIndex = prev.experiences.findIndex(
            e => e.experience_id === experience.experience_id
          );
          
          if (existingIndex >= 0) {
            console.log(`Experience ${experience.experience_id} already exists, skipping duplicate`);
            return prev; // Don't add duplicate
          }
          
          return {
            ...prev,
            experiences: [...prev.experiences, experience]
          };
        });
      }
      
      if (step === 'dialogue_simulation' && stepData.data?.dialogue) {
        const dial = stepData.data.dialogue;
        console.log('Processing dialogue:', dial);
        console.log('Dialogue turns:', dial.turns);
        
        // Convert backend dialogue format to frontend conversation format
        // Ensure turns is an array
        let turnsArray: any[] = [];
        if (Array.isArray(dial.turns)) {
          turnsArray = dial.turns;
        } else if (dial.turns && typeof dial.turns === 'object') {
          // If turns is an object, try to convert it
          turnsArray = Object.values(dial.turns);
        }
        
        console.log('Processed turns array:', turnsArray);
        
        const conversation: Conversation = {
          conv_id: dial.dialogue_id || `conv_${Date.now()}`,
          domain: dial.domain || 'unknown',
          task: dial.goal || '',
          experience_id: dial.experience_id || '',
          personas: [
            { role: 'user', name: dial.user_persona || 'User', traits: [], memory: [] },
            { role: 'assistant', name: 'SupportBot', traits: ['helpful', 'professional'], memory: [] }
          ],
          situation: dial.context || '',
          goal: dial.goal || '',
          constraints: { max_turns: 10, max_tokens_per_turn: 100 },
          conversation_starter: turnsArray[0]?.text || '',
          turns: turnsArray.map((turn: any, idx: number) => ({
            turn_id: idx + 1,
            speaker: turn.role === 'User' ? 'user' : 'assistant',
            text: turn.text || ''
          })),
          task_success: dial.metadata?.quality_score > 0.7 || false,
          judge_score: (dial.metadata?.quality_score || 0) * 5,
          mtld: 0,
          provenance: {
            generator_model: dial.metadata?.model_version || 'unknown',
            prompt_version: 'v1',
            temperature: 0.7,
            shot_ids: [],
            timestamp: dial.metadata?.generated_at || new Date().toISOString()
          }
        };
        
        console.log('Adding conversation to pipeline data:', conversation);
        setPipelineData(prev => {
          // Check if this conversation already exists (prevent duplicates)
          const existingIndex = prev.conversations.findIndex(
            c => c.conv_id === conversation.conv_id
          );
          
          if (existingIndex >= 0) {
            console.log(`Conversation ${conversation.conv_id} already exists, skipping duplicate`);
            return prev; // Don't add duplicate
          }
          
          const updated = {
            ...prev,
            conversations: [...prev.conversations, conversation]
          };
          console.log('Updated pipeline data conversations count:', updated.conversations.length);
          return updated;
        });
      }
      
      if (step === 'quality_filtering' && stepData.data) {
        const filterData = stepData.data;
        addRequestLog({
          stepId: 'quality_filtering',
          stepName: 'Quality Filtering',
          endpoint: '/api/run-pipeline',
          status: 'success',
          message: `Accepted: ${filterData.accepted || 0}, Rejected: ${filterData.rejected || 0}`
        });
      }
    });
    
    socket.on('log', (data: any) => {
      console.log('Log received:', data);
      const logData = data.data || {};
      addRequestLog({
        stepId: logData.step || 'pipeline',
        stepName: logData.step || 'Pipeline',
        endpoint: '/api/run-pipeline',
        status: logData.level === 'error' ? 'error' : 'success',
        message: logData.message || ''
      });
    });
    
    socket.on('pipeline_complete', (data: any) => {
      console.log('Pipeline completed:', data);
      
      // Only process events for the current session
      const eventSessionId = data.session_id;
      if (eventSessionId && eventSessionId !== sessionIdRef.current) {
        console.log(`Ignoring pipeline_complete event for different session: ${eventSessionId} (current: ${sessionIdRef.current})`);
        return;
      }
      
      const completeData = data.data || {};
      addRequestLog({
        stepId: 'pipeline',
        stepName: 'Pipeline Complete',
        endpoint: '/api/run-pipeline',
        status: 'success',
        message: completeData.message || 'Pipeline completed successfully'
      });
      
      // Store evaluation metrics if available
      if (completeData.evaluation) {
        console.log('Evaluation metrics received:', completeData.evaluation);
        setPipelineData(prev => ({
          ...prev,
          evaluations: completeData.evaluation
        }));
      }
      
      if (completeData.final_data) {
        // Update with final statistics
        console.log('Final data:', completeData.final_data);
      }
      
      setIsRunning(false);
      setCurrentStep(4); // Move to evaluation step
    });
    
    socket.on('pipeline_error', (data: any) => {
      console.error('Pipeline error:', data);
      const errorData = data.data || {};
      addRequestLog({
        stepId: 'pipeline',
        stepName: 'Pipeline Error',
        endpoint: '/api/run-pipeline',
        status: 'error',
        message: errorData.message || 'Pipeline failed'
      });
      setIsRunning(false);
    });
    
    
    // Cleanup on unmount
    return () => {
      console.log('Cleaning up WebSocket connection');
      socket.disconnect();
    };
  }, []);
  
  // Debug: Log when pipeline state changes
  useEffect(() => {
    console.log('Pipeline state changed:', { isRunning, currentStep, pipelineRunId });
  }, [isRunning, currentStep, pipelineRunId]);

  const addRequestLog = (entry: Omit<RequestLogEntry, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toISOString();
    const id = `${timestamp}-${Math.random().toString(36).slice(2, 8)}`;
    setRequestLogs(prev => [
      { id, timestamp, ...entry },
      ...prev
    ].slice(0, 50));
  };

  const steps: PipelineStep[] = useMemo(() => [
    {
      id: 'experience',
      name: 'Experience Generation',
      description: 'Create structured blueprints with personas, situations, and goals',
      icon: <Brain className="w-6 h-6" />,
      status: 'pending',
      progress: 0,
      component: (
        <ExperienceGenerator
          key={`experience-${pipelineRunId}-${currentStep}`}
          experiences={pipelineData.experiences}
          autoStart={false}
          onComplete={(data) => handleStepComplete(0, data)}
          onLog={(log) =>
            addRequestLog({
              stepId: 'experience',
              stepName: 'Experience Generation',
              endpoint: '/api/run-pipeline',
              ...log,
            })
          }
        />
      )
    },
    {
      id: 'simulation',
      name: 'Multi-Agent Simulation',
      description: 'Generate natural dialogues through LLM agent interactions',
      icon: <Users className="w-6 h-6" />,
      status: 'pending',
      progress: 0,
      component: (
        <MultiAgentSimulator
          key={`simulation-${pipelineRunId}-${currentStep}`}
          experiences={pipelineData.experiences}
          conversations={pipelineData.conversations}
          autoStart={false}
          onComplete={(data) => handleStepComplete(1, data)}
          onLog={(log) =>
            addRequestLog({
              stepId: 'simulation',
              stepName: 'Multi-Agent Simulation',
              endpoint: '/api/run-pipeline',
              ...log,
            })
          }
        />
      )
    },
    {
      id: 'postprocessing',
      name: 'Post-Processing',
      description: 'Filter, deduplicate, and ensure quality of generated dialogues',
      icon: <Filter className="w-6 h-6" />,
      status: 'pending',
      progress: 0,
      component: (
        <PostProcessor
          key={`postprocessor-${pipelineRunId}-${currentStep}`}
          conversations={pipelineData.conversations}
          filteredConversations={pipelineData.filteredConversations}
          autoStart={false}
          onComplete={(data) => handleStepComplete(2, data)}
          onLog={(log) =>
            addRequestLog({
              stepId: 'postprocessing',
              stepName: 'Post-Processing',
              endpoint: '/api/run-pipeline',
              ...log,
            })
          }
        />
      )
    },
    {
      id: 'dataset',
      name: 'Dataset Construction',
      description: 'Compile high-quality dialogues into structured dataset',
      icon: <Database className="w-6 h-6" />,
      status: 'pending',
      progress: 0,
      component: (
        <DatasetConstructor
          key={`dataset-${pipelineRunId}-${currentStep}`}
          filteredConversations={pipelineData.filteredConversations}
          dataset={pipelineData.dataset}
          conversations={pipelineData.conversations}
          autoStart={false}
          onComplete={(data) => handleStepComplete(3, data)}
          onLog={(log) =>
            addRequestLog({
              stepId: 'dataset',
              stepName: 'Dataset Construction',
              endpoint: '/api/run-pipeline',
              ...log,
            })
          }
        />
      )
    },
    {
      id: 'evaluation',
      name: 'Evaluation',
      description: 'Assess quality, diversity, and downstream task performance',
      icon: <TrendingUp className="w-6 h-6" />,
      status: 'pending',
      progress: 0,
      component: (
        <Evaluator
          key={`evaluator-${pipelineRunId}-${currentStep}`}
          dataset={pipelineData.dataset}
          autoStart={isRunning && currentStep === 4}
          onComplete={(data) => handleStepComplete(4, data)}
          onLog={(log) =>
            addRequestLog({
              stepId: 'evaluation',
              stepName: 'Evaluation',
              endpoint: '/api/pipeline/evaluator',
              ...log,
            })
          }
        />
      )
    }
  ], [isRunning, currentStep, pipelineData, pipelineRunId]);

  const handleStepComplete = (stepIndex: number, data: unknown) => {
    const newPipelineData = { ...pipelineData };

    switch (stepIndex) {
      case 0:
        newPipelineData.experiences = data as Experience[];
        break;
      case 1:
        newPipelineData.conversations = data as Conversation[];
        break;
      case 2:
        newPipelineData.filteredConversations = data as FilteredConversation[];
        break;
      case 3:
        newPipelineData.dataset = data as DatasetItem[];
        break;
      case 4:
        newPipelineData.evaluations = data as EvaluationMetrics;
        break;
    }

    setPipelineData(newPipelineData);

    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const runPipeline = async () => {
    console.log('Run Pipeline clicked');
    
    // Validate configuration
    if (selectedDomains.length === 0) {
      alert('Please select at least one domain');
      return;
    }
    if (numDialogues < 1) {
      alert('Number of dialogues must be at least 1');
      return;
    }
    
    // Check backend connection before starting
    if (!backendConnected) {
      const isHealthy = await API_CONFIG.checkHealth();
      if (!isHealthy) {
        const errorMsg = `Backend server is not accessible at ${API_CONFIG.baseUrl}. Please ensure the backend server is running.\n\nTo start the backend:\ncd goalconvo-2\n./start_backend.sh`;
        alert(errorMsg);
        addRequestLog({
          stepId: 'pipeline',
          stepName: 'Pipeline Start',
          endpoint: '/api/run-pipeline',
          status: 'error',
          message: `Backend server not accessible at ${API_CONFIG.baseUrl}`
        });
        return;
      }
      setBackendConnected(true);
    }
    
    // Generate new session ID FIRST (before resetting state)
    const newSessionId = uuidv4();
    sessionIdRef.current = newSessionId;
    
    // Reset state completely
    setRequestLogs([]);
    setPipelineRunId(prev => prev + 1);
    setCurrentStep(0);
    setIsRunning(false); // Ensure running state is reset
    setPipelineData({
      experiences: [],
      conversations: [],
      filteredConversations: [],
      dataset: [],
      evaluations: null
    });
    
    try {
      // Call the new unified pipeline API
      const response = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.runPipeline), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num_dialogues: numDialogues,
          domains: selectedDomains.length > 0 ? selectedDomains : undefined,
          session_id: sessionIdRef.current
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Pipeline start failed: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Pipeline started:', data);
      
      // Join session via WebSocket if connected
      if (socketRef.current?.connected) {
        socketRef.current.emit('join_session', { session_id: sessionIdRef.current });
      } else {
        console.warn('WebSocket not connected, attempting to reconnect...');
        // Try to reconnect if not connected
        if (socketRef.current) {
          socketRef.current.connect();
        }
      }
      
      addRequestLog({
        stepId: 'pipeline',
        stepName: 'Pipeline Start',
        endpoint: '/api/run-pipeline',
        status: 'success',
        message: data.message || 'Pipeline started successfully'
      });
      
      setIsRunning(true);
    } catch (error) {
      console.error('Failed to start pipeline:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Provide helpful error message for network errors
      let userMessage = errorMessage;
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        userMessage = `Cannot connect to backend server at ${API_CONFIG.baseUrl}. Please ensure:\n1. Backend server is running (cd goalconvo-2 && ./start_backend.sh)\n2. Backend is accessible at ${API_CONFIG.baseUrl}\n3. No firewall is blocking the connection`;
      }
      
      addRequestLog({
        stepId: 'pipeline',
        stepName: 'Pipeline Start',
        endpoint: '/api/run-pipeline',
        status: 'error',
        message: userMessage
      });
      
      alert(`Failed to start pipeline:\n\n${userMessage}`);
    }
  };

  const resetPipeline = () => {
    console.log('Reset Pipeline clicked');
    setIsRunning(false);
    setCurrentStep(0);
    setPipelineRunId(0);
    setRequestLogs([]);
    setPipelineData({
      experiences: [],
      conversations: [],
      filteredConversations: [],
      dataset: [],
      evaluations: {
        overall_score: 0,
        diversity_score: 0,
        coherence_score: 0,
        task_success_rate: 0,
        fluency_score: 0,
        groundedness_score: 0,
        categories: {
          lexical_diversity: 0,
          conversation_length: { avg_turns: 0, std_dev: 0 },
          domain_distribution: {},
          task_success_by_domain: {}
        }
      }
    });
  };

  const downloadDialoguesJSON = () => {
    if (pipelineData.conversations.length === 0) {
      alert('No dialogues available to download');
      return;
    }

    // Prepare dialogues data for download
    const dialoguesData = {
      metadata: {
        generated_at: new Date().toISOString(),
        total_dialogues: pipelineData.conversations.length,
        total_turns: pipelineData.conversations.reduce((sum, conv) => sum + (conv.turns?.length || 0), 0),
        domains: [...new Set(pipelineData.conversations.map(c => c.domain))],
        pipeline_run_id: pipelineRunId
      },
      dialogues: pipelineData.conversations.map(conv => ({
        dialogue_id: conv.conv_id,
        domain: conv.domain,
        goal: conv.goal || conv.task,
        context: conv.situation,
        user_persona: conv.personas?.find(p => p.role === 'user')?.name || 'General user',
        turns: conv.turns?.map(turn => ({
          role: turn.speaker === 'user' ? 'User' : 'SupportBot',
          text: turn.text,
          turn_id: turn.turn_id
        })) || [],
        metadata: {
          num_turns: conv.turns?.length || 0,
          task_success: conv.task_success,
          quality_score: conv.judge_score ? conv.judge_score / 5 : 0,
          generated_at: conv.provenance?.timestamp || new Date().toISOString(),
          model_version: conv.provenance?.generator_model || 'unknown'
        }
      }))
    };

    // Create and download JSON file
    const jsonString = JSON.stringify(dialoguesData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `goalconvo-dialogues-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Pipeline Control</h2>
            <p className="text-gray-300">Manage the entire GoalConvo generation pipeline</p>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-green-400' : 'bg-red-400'} ${backendCheckInProgress ? 'animate-pulse' : ''}`} />
              <span className="text-xs text-gray-400">
                {backendCheckInProgress ? 'Checking...' : backendConnected ? 'Backend Connected' : 'Backend Disconnected'}
              </span>
              {!backendConnected && (
                <span className="text-xs text-yellow-400 ml-2">
                  ({API_CONFIG.baseUrl})
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runPipeline}
              disabled={isRunning || !backendConnected}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title={!backendConnected ? 'Backend server is not connected. Please start the backend server first.' : ''}
            >
              <Play className="w-5 h-5" />
              {isRunning ? 'Running...' : 'Run Pipeline'}
            </motion.button>
            {pipelineData.conversations.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadDialoguesJSON}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all"
                title={`Download ${pipelineData.conversations.length} dialogue(s) as JSON`}
              >
                <Download className="w-5 h-5" />
                Download Dialogues ({pipelineData.conversations.length})
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetPipeline}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </motion.button>
          </div>
        </div>

        {/* Pipeline Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Number of Dialogues
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={numDialogues}
              onChange={(e) => setNumDialogues(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={isRunning}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter number of dialogues"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Select Domains
            </label>
            <div className="flex flex-wrap gap-2">
              {availableDomains.map((domain) => (
                <label
                  key={domain}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                    selectedDomains.includes(domain)
                      ? 'bg-cyan-500/20 border-cyan-400 text-white'
                      : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                  } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDomains.includes(domain)}
                    onChange={(e) => {
                      if (isRunning) return;
                      if (e.target.checked) {
                        setSelectedDomains([...selectedDomains, domain]);
                      } else {
                        setSelectedDomains(selectedDomains.filter(d => d !== domain));
                      }
                    }}
                    disabled={isRunning}
                    className="w-4 h-4 text-cyan-500 rounded focus:ring-cyan-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium capitalize">{domain}</span>
                </label>
              ))}
            </div>
            {selectedDomains.length === 0 && (
              <p className="text-xs text-yellow-400 mt-2">⚠️ Please select at least one domain</p>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0.5 }}
              animate={{
                opacity: index <= currentStep ? 1 : 0.5,
                scale: index === currentStep ? 1.05 : 1
              }}
              className={`p-3 rounded-xl border transition-all ${
                index === currentStep
                  ? 'border-cyan-400 bg-cyan-500/20'
                  : index < currentStep
                    ? 'border-green-400 bg-green-500/20'
                    : 'border-white/20 bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {step.icon}
                <span className="text-sm font-semibold text-white">{step.name}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${step.progress}%` }}
                  className={`h-2 rounded-full transition-all ${
                    index < currentStep ? 'bg-green-400' : 'bg-cyan-400'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Evaluation Display (when complete) or Current Step Display + Request Log Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="wait">
        {!isRunning && pipelineData.evaluations ? (
          // Show Evaluation Display when pipeline is complete
          <motion.div
            key="evaluation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 lg:col-span-2"
          >
            <Evaluator
              key={`evaluator-${pipelineRunId}`}
              dataset={pipelineData.dataset}
              metrics={pipelineData.evaluations}
              autoStart={false}
              onComplete={(metrics) => {
                console.log('Evaluation complete:', metrics);
              }}
              onLog={(log) =>
                addRequestLog({
                  stepId: 'evaluation',
                  stepName: 'Evaluation',
                  endpoint: '/api/run-pipeline',
                  status: log.status,
                  message: log.message
                })
              }
            />
          </motion.div>
        ) : (
          // Show Current Step Display when pipeline is running
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 lg:col-span-2"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl">
                {steps[currentStep].icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {steps[currentStep].name}
                </h3>
                <p className="text-gray-300">{steps[currentStep].description}</p>
              </div>
            </div>

            {steps[currentStep].component}
          </motion.div>
        )}
      </AnimatePresence>

        {/* Request Log Stack */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col max-h-[32rem]"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-white">Request Log</h3>
              <p className="text-xs text-gray-400">Latest API calls across the pipeline</p>
            </div>
            <span className="text-xs text-gray-300 bg-white/10 px-2 py-1 rounded-full">
              {requestLogs.length} events
            </span>
          </div>

          <div className="mt-2 space-y-2 overflow-y-auto">
            {requestLogs.length === 0 ? (
              <p className="text-xs text-gray-400">
                No requests yet. Run the pipeline to see activity.
              </p>
            ) : (
              requestLogs.map((log) => (
                <div
                  key={log.id}
                  className={`rounded-lg border px-3 py-2 text-xs flex flex-col gap-1 ${
                    log.status === 'success'
                      ? 'border-green-400/40 bg-green-500/10'
                      : 'border-red-400/40 bg-red-500/10'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">
                      {log.stepName}
                    </span>
                    <span className="text-[10px] text-gray-300">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-cyan-200">
                      {log.endpoint}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        log.status === 'success'
                          ? 'bg-green-500/30 text-green-100'
                          : 'bg-red-500/30 text-red-100'
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-100 line-clamp-2">
                    {log.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Pipeline Data Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="text-cyan-400 font-semibold mb-1">Experiences</div>
          <div className="text-2xl font-bold text-white">{pipelineData.experiences.length}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="text-purple-400 font-semibold mb-1">Conversations</div>
          <div className="text-2xl font-bold text-white">{pipelineData.conversations.length}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="text-pink-400 font-semibold mb-1">Filtered</div>
          <div className="text-2xl font-bold text-white">{pipelineData.filteredConversations.length}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="text-green-400 font-semibold mb-1">Dataset Size</div>
          <div className="text-2xl font-bold text-white">{pipelineData.dataset.length}</div>
        </div>
      </motion.div>

      {/* Generated Experiences and Dialogues Display - Shown when pipeline completes */}
      {!isRunning && (pipelineData.experiences.length > 0 || pipelineData.conversations.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 space-y-6"
        >
          {/* Generated Experiences Section */}
          {pipelineData.experiences.length > 0 && (
            <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-6 border border-cyan-400/30">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Generated Experiences</h2>
                <span className="ml-auto px-3 py-1 bg-cyan-500/30 text-cyan-100 rounded-full text-sm font-semibold">
                  {pipelineData.experiences.length} {pipelineData.experiences.length === 1 ? 'Experience' : 'Experiences'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pipelineData.experiences.map((experience, idx) => (
                  <motion.div
                    key={experience.experience_id || idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:border-cyan-400/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm font-semibold text-cyan-400 mb-1">
                          {experience.domain.toUpperCase()}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {experience.task || experience.goal}
                        </h3>
                      </div>
                      <div className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
                        #{idx + 1}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Goal:</span>
                        <p className="text-white mt-1">{experience.goal}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Situation:</span>
                        <p className="text-white/90 mt-1 line-clamp-2">{experience.situation}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Starter:</span>
                        <p className="text-cyan-200 mt-1 italic">"{experience.conversation_starter}"</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Generated Dialogues Section */}
          {pipelineData.conversations.length > 0 && (
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Generated Dialogues</h2>
                <span className="ml-auto px-3 py-1 bg-purple-500/30 text-purple-100 rounded-full text-sm font-semibold">
                  {pipelineData.conversations.length} {pipelineData.conversations.length === 1 ? 'Dialogue' : 'Dialogues'}
                </span>
              </div>
              
              <div className="space-y-4">
                {pipelineData.conversations.map((conversation, idx) => (
                  <motion.div
                    key={conversation.conv_id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:border-purple-400/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-semibold text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full">
                            {conversation.domain.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400">
                            {conversation.turns?.length || 0} turns
                          </span>
                          {conversation.task_success && (
                            <span className="text-xs bg-green-500/30 text-green-100 px-2 py-1 rounded-full">
                              ✓ Task Success
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          {conversation.task || conversation.goal}
                        </h3>
                        {conversation.judge_score && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-400">Quality Score:</span>
                            <div className="flex-1 bg-white/20 rounded-full h-2 max-w-[200px]">
                              <div
                                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                                style={{ width: `${(conversation.judge_score / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-white font-semibold">
                              {conversation.judge_score.toFixed(1)}/5.0
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Conversation Preview */}
                    {conversation.turns && conversation.turns.length > 0 && (
                      <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                        {conversation.turns.slice(0, 4).map((turn, turnIdx) => (
                          <div
                            key={turnIdx}
                            className={`flex gap-3 p-2 rounded-lg ${
                              turn.speaker === 'user'
                                ? 'bg-cyan-500/10 border-l-2 border-cyan-400'
                                : 'bg-purple-500/10 border-l-2 border-purple-400'
                            }`}
                          >
                            <span className={`text-xs font-semibold min-w-[60px] ${
                              turn.speaker === 'user' ? 'text-cyan-300' : 'text-purple-300'
                            }`}>
                              {turn.speaker === 'user' ? '👤 User' : '🤖 Bot'}
                            </span>
                            <p className="text-sm text-white/90 flex-1">{turn.text}</p>
                          </div>
                        ))}
                        {conversation.turns.length > 4 && (
                          <div className="text-center text-xs text-gray-400 pt-2">
                            + {conversation.turns.length - 4} more turns
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
