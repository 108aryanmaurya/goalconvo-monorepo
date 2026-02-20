'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Zap, Play, User, Bot } from 'lucide-react';
import { API_CONFIG } from '@/lib/api-config';

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
    // Optional metadata when coming from backend
    speaker_role?: string;
    timestamp?: string;
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

interface MultiAgentSimulatorProps {
  experiences?: Experience[];
  conversations?: Conversation[]; // Data comes from socket events via dashboard
  autoStart?: boolean;
  onLog?: (entry: { status: 'success' | 'error'; message: string }) => void;
  onComplete: (conversations: Conversation[]) => void;
}

export default function MultiAgentSimulator({ experiences = [], conversations: propConversations = [], autoStart = false, onLog, onComplete }: MultiAgentSimulatorProps) {
  const [conversations, setConversations] = useState<Conversation[]>(propConversations);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);

  // Update local state when conversations prop changes (from socket events)
  useEffect(() => {
    if (propConversations.length > 0) {
      setConversations(propConversations);
      setSimulationProgress(100);
      setIsSimulating(false);
      onComplete(propConversations);
    } else if (propConversations.length === 0 && conversations.length > 0) {
      // Reset when conversations are cleared
      setConversations([]);
      setSimulationProgress(0);
    }
  }, [propConversations, onComplete]);

  const mockConversations: Conversation[] = [
    {
      conv_id: 'goalconvo_001_001',
      domain: 'healthcare',
      task: 'diagnose_fever',
      experience_id: 'exp_001',
      personas: [
        {
          role: 'doctor',
          name: 'Dr. Sarah Chen',
          traits: ['calm', 'analytical', 'empathetic'],
          memory: ['worked 10y in ER']
        },
        {
          role: 'patient',
          name: 'Alex Rodriguez',
          traits: ['worried', 'cooperative', 'detailed'],
          memory: []
        }
      ],
      situation: 'Patient reports fever and cough symptoms for 3 days',
      goal: 'Doctor identifies likely cause and recommends appropriate tests or treatment',
      constraints: {
        max_turns: 10,
        max_tokens_per_turn: 60
      },
      conversation_starter: 'I have had fever for three days and it\'s not improving.',
      turns: [
        {
          turn_id: 1,
          speaker: 'patient',
          text: 'I have had fever for three days and it\'s not improving.'
        },
        {
          turn_id: 2,
          speaker: 'doctor',
          text: 'I understand you\'re concerned. When did the symptoms start exactly, and have you taken any medication?'
        },
        {
          turn_id: 3,
          speaker: 'patient',
          text: 'It started on Monday evening. I took some ibuprofen yesterday, but the fever came back this morning.'
        },
        {
          turn_id: 4,
          speaker: 'doctor',
          text: 'Based on your symptoms, this could be a viral infection. I recommend getting a COVID test and monitoring your temperature. If it persists beyond 5 days, please come in for further evaluation.'
        }
      ],
      task_success: true,
      judge_score: 4.1,
      mtld: 82.3,
      provenance: {
        generator_model: 'gpt-4o-mini',
        prompt_version: 'agent_prompt_v1',
        temperature: 0.6,
        shot_ids: ['shot_001'],
        timestamp: '2024-01-15T10:05:00Z'
      }
    },
    {
      conv_id: 'goalconvo_001_002',
      domain: 'customer_support',
      task: 'refund_request',
      experience_id: 'exp_002',
      personas: [
        {
          role: 'customer_service_agent',
          name: 'Jennifer Walsh',
          traits: ['patient', 'solution-oriented', 'professional'],
          memory: []
        },
        {
          role: 'customer',
          name: 'Michael Thompson',
          traits: ['frustrated', 'determined', 'polite'],
          memory: []
        }
      ],
      situation: 'Customer received a defective electronic device and wants a refund',
      goal: 'Agent processes refund and maintains customer satisfaction',
      constraints: {
        max_turns: 10,
        max_tokens_per_turn: 60
      },
      conversation_starter: 'I received my order yesterday, but the device isn\'t working properly. I\'d like to return it for a refund.',
      turns: [
        {
          turn_id: 1,
          speaker: 'customer',
          text: 'I received my order yesterday, but the device isn\'t working properly. I\'d like to return it for a refund.'
        },
        {
          turn_id: 2,
          speaker: 'customer_service_agent',
          text: 'I\'m sorry to hear about the issue with your device. Could you please describe the specific problem you\'re experiencing?'
        },
        {
          turn_id: 3,
          speaker: 'customer',
          text: 'The screen won\'t turn on even though I charged it overnight. The charging light doesn\'t come on either.'
        },
        {
          turn_id: 4,
          speaker: 'customer_service_agent',
          text: 'I understand. This sounds like a hardware issue. I\'ll process your return authorization right away. You should receive a prepaid return label within 24 hours, and your refund will be processed once we receive the item.'
        }
      ],
      task_success: true,
      judge_score: 4.3,
      mtld: 78.9,
      provenance: {
        generator_model: 'gpt-4o-mini',
        prompt_version: 'agent_prompt_v1',
        temperature: 0.6,
        shot_ids: ['shot_002'],
        timestamp: '2024-01-15T14:05:00Z'
      }
    }
  ];

  const startSimulation = async () => {
    setIsSimulating(true);
    setSimulationProgress(0);
    setConversations([]);
    setCurrentTurn(0);

    try {
      // Simulate conversation generation process
      const steps = [
        'Initializing agents...',
        'Setting up conversation context...',
        'Generating first responses...',
        'Processing agent interactions...',
        'Monitoring goal progress...',
        'Completing conversations...'
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSimulationProgress((i + 1) / steps.length * 100);
      }

      // Component now only displays data from props (populated via socket events)
      // No API calls - data comes from GoalConvoDashboard via socket events
      setIsSimulating(false);
    } catch (error: any) {
      console.error('Multi-agent simulation error:', error);
      setIsSimulating(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Multi-Agent Simulation</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSimulating ? (
              <>
                <Zap className="w-5 h-5 animate-pulse" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Simulation
              </>
            )}
          </motion.button>
        </div>

        {/* Simulation Progress */}
        {isSimulating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Simulation Progress</span>
              <span className="text-purple-400 font-semibold">{Math.round(simulationProgress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${simulationProgress}%` }}
                className="bg-gradient-to-r from-purple-400 to-pink-600 h-3 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Conversations Display */}
      {conversations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-400" />
            Generated Conversations ({conversations.length})
          </h4>

          {conversations.map((conversation, index) => (
            <motion.div
              key={conversation.conv_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-xl border border-white/20 overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setSelectedConversation(selectedConversation === index ? null : index)}
              >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    conversation.task_success ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <div>
                    <h5 className="font-semibold text-white">{conversation.conv_id}</h5>
                    <p className="text-sm text-gray-300">
                      {conversation.turns.length} turns • MTLD: {conversation.mtld?.toFixed(1)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    conversation.task_success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {conversation.task_success ? 'Success' : 'Failed'}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/20 text-blue-300">
                    Judge: {conversation.judge_score?.toFixed(1)}
                  </span>
                </div>
              </div>
              </div>

              {/* Conversation Turns */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: selectedConversation === index ? 'auto' : 0,
                  opacity: selectedConversation === index ? 1 : 0
                }}
                className="border-t border-white/20 overflow-hidden"
              >
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {conversation.turns.map((turn, turnIndex) => (
                    <motion.div
                      key={turn.turn_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: turnIndex * 0.1 }}
                      className={`flex gap-3 ${
                        turn.speaker_role === 'patient' || turn.speaker_role === 'customer'
                          ? 'justify-start'
                          : 'justify-end'
                      }`}
                    >
                      <div className={`max-w-md p-3 rounded-lg ${
                        turn.speaker_role === 'patient' || turn.speaker_role === 'customer'
                          ? 'bg-blue-500/20 border border-blue-400/30'
                          : 'bg-purple-500/20 border border-purple-400/30'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {turn.speaker_role === 'patient' || turn.speaker_role === 'customer' ? (
                            <User className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Bot className="w-4 h-4 text-purple-400" />
                          )}
                          <span className="font-semibold text-white text-sm">{turn.speaker}</span>
                          {turn.timestamp && (
                            <span className="text-xs text-gray-400">
                              {formatTimestamp(turn.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-200">{turn.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Conversation Metadata */}
                <div className="px-4 pb-4 border-t border-white/10">
                  <div className="grid grid-cols-4 gap-4 pt-3 text-sm">
                    <div className="text-center">
                      <div className="text-gray-400">Total Turns</div>
                      <div className="text-white font-semibold">{conversation.turns.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Judge Score</div>
                      <div className="text-white font-semibold">{conversation.judge_score?.toFixed(1)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">MTLD</div>
                      <div className="text-white font-semibold">{conversation.mtld?.toFixed(1)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Model</div>
                      <div className="text-white font-semibold text-xs">{conversation.provenance.generator_model}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Real-time Simulation Stats */}
      {isSimulating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{conversations.length}</div>
              <div className="text-sm text-gray-400">Conversations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{currentTurn}</div>
              <div className="text-sm text-gray-400">Current Turn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{Math.round(simulationProgress)}%</div>
              <div className="text-sm text-gray-400">Progress</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
