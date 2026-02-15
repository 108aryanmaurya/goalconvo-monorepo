'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Download, FileText, Archive, Loader2, Play } from 'lucide-react';
import { API_CONFIG } from '@/lib/api-config';

interface DatasetItem {
  id: string;
  conv_id: string;
  domain: string;
  task: string;
  personas: Array<{
    role: string;
    name: string;
    traits: string[];
    memory?: string[];
  }>;
  turns: Array<{
    turn_id: number;
    speaker: string;
    text: string;
  }>;
  task_success: boolean;
  metadata: {
    total_turns: number;
    domain_category: string;
    creation_timestamp: string;
    quality_score: number;
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

interface Conversation {
  conv_id: string;
  domain: string;
  task: string;
  goal: string;
  turns: Array<{
    turn_id: number;
    speaker: string;
    text: string;
  }>;
  task_success: boolean;
  judge_score: number;
  provenance?: {
    generator_model: string;
    timestamp: string;
  };
}

interface DatasetConstructorProps {
  filteredConversations?: FilteredConversation[];
  dataset?: DatasetItem[]; // Data comes from socket events via dashboard
  conversations?: Conversation[]; // Raw conversations for individual download
  autoStart?: boolean;
  onLog?: (entry: { status: 'success' | 'error'; message: string }) => void;
  onComplete: (dataset: DatasetItem[]) => void;
}

export default function DatasetConstructor({ filteredConversations = [], dataset: propDataset = [], conversations = [], autoStart = false, onLog, onComplete }: DatasetConstructorProps) {
  const [isConstructing, setIsConstructing] = useState(false);
  const [dataset, setDataset] = useState<DatasetItem[]>(propDataset);
  const [constructionStep, setConstructionStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  // Update local state when dataset prop changes (from socket events)
  useEffect(() => {
    if (propDataset.length > 0) {
      setDataset(propDataset);
      setProgress(100);
      setIsConstructing(false);
      onComplete(propDataset);
    } else if (propDataset.length === 0 && dataset.length > 0) {
      // Reset when dataset is cleared
      setDataset([]);
      setProgress(0);
    }
  }, [propDataset, onComplete]);

  const mockDataset: DatasetItem[] = [
    {
      id: 'dataset_001',
      conv_id: 'goalconvo_001_001',
      domain: 'healthcare',
      task: 'diagnose_fever',
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
      metadata: {
        total_turns: 4,
        domain_category: 'clinical_diagnosis',
        creation_timestamp: '2024-01-15T10:05:00Z',
        quality_score: 0.95
      }
    },
    {
      id: 'dataset_002',
      conv_id: 'goalconvo_001_002',
      domain: 'customer_support',
      task: 'refund_request',
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
      metadata: {
        total_turns: 4,
        domain_category: 'refund_processing',
        creation_timestamp: '2024-01-15T14:05:00Z',
        quality_score: 0.92
      }
    }
  ];

  const startConstruction = async () => {
    setIsConstructing(true);
    setProgress(0);
    setDataset([]);
    setConstructionStep('');

    try {
      const steps = [
        'Structuring conversation data...',
        'Adding domain classifications...',
        'Incorporating persona information...',
        'Calculating metadata and statistics...',
        'Validating data integrity...',
        'Finalizing dataset format...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setConstructionStep(steps[i]);
        setProgress((i + 1) / steps.length * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Component now only displays data from props (populated via socket events)
      // No API calls - data comes from GoalConvoDashboard via socket events
      setIsConstructing(false);
    } catch (error: any) {
      console.error('Dataset construction error:', error);
      setIsConstructing(false);
    }
  };

  const exportDataset = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(dataset, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'goalconvo_dataset.json';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const downloadDialogueJSON = (conversation: Conversation) => {
    // Convert conversation to dialogue format for download
    const dialogueData = {
      dialogue_id: conversation.conv_id,
      domain: conversation.domain,
      goal: conversation.goal || conversation.task,
      context: '',
      user_persona: 'General user',
      turns: conversation.turns.map(turn => ({
        role: turn.speaker === 'user' ? 'User' : 'SupportBot',
        text: turn.text,
        timestamp: new Date().toISOString()
      })),
      metadata: {
        num_turns: conversation.turns.length,
        generated_at: conversation.provenance?.timestamp || new Date().toISOString(),
        model_version: conversation.provenance?.generator_model || 'unknown',
        task_success: conversation.task_success,
        quality_score: conversation.judge_score ? conversation.judge_score / 5 : 0
      }
    };

    const jsonString = JSON.stringify(dialogueData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dialogue-${conversation.conv_id}-${conversation.domain}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Construction Controls */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Dataset Construction</h3>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startConstruction}
              disabled={isConstructing}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isConstructing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Constructing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Construct Dataset
                </>
              )}
            </motion.button>
            {dataset.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => exportDataset('json')}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                <Download className="w-5 h-5" />
                Export JSON
              </motion.button>
            )}
          </div>
        </div>

        {/* Construction Progress */}
        {isConstructing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-300">{constructionStep}</span>
              <span className="text-green-400 font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-green-400 to-teal-600 h-3 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Dataset Statistics */}
      {dataset.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-white/5 rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-green-400">{dataset.length}</div>
            <div className="text-sm text-gray-400">Total Conversations</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {dataset.reduce((acc, item) => acc + item.turns.length, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Turns</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {new Set(dataset.map(item => item.domain)).size}
            </div>
            <div className="text-sm text-gray-400">Domains</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {(dataset.reduce((acc, item) => acc + item.metadata.quality_score, 0) / dataset.length * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Avg Quality</div>
          </div>
        </motion.div>
      )}

      {/* Dataset Items */}
      {dataset.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Archive className="w-5 h-5 text-green-400" />
            Dataset Items
          </h4>

          {dataset.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-xl border border-white/20 overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setSelectedItem(selectedItem === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.task_success ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <div>
                    <h5 className="font-semibold text-white">{item.id}</h5>
                    <p className="text-sm text-gray-300">
                      {item.domain} • {item.task.replace('_', ' ')} • {item.turns.length} turns
                    </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.task_success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {item.task_success ? 'Success' : 'Failed'}
                    </span>
                    {/* Download individual dialogue button */}
                    {conversations.length > 0 && (() => {
                      const matchingConv = conversations.find(c => c.conv_id === item.conv_id);
                      return matchingConv ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadDialogueJSON(matchingConv);
                          }}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all border border-blue-400/30"
                          title="Download this dialogue as JSON"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>

              {/* Detailed View */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: selectedItem === index ? 'auto' : 0,
                  opacity: selectedItem === index ? 1 : 0
                }}
                className="border-t border-white/20 overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  {/* Download Button in Detailed View */}
                  {conversations.length > 0 && (() => {
                    const matchingConv = conversations.find(c => c.conv_id === item.conv_id);
                    return matchingConv ? (
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => downloadDialogueJSON(matchingConv)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all"
                          title="Download this dialogue as JSON"
                        >
                          <Download className="w-4 h-4" />
                          Download Dialogue JSON
                        </motion.button>
                      </div>
                    ) : null;
                  })()}
                  
                  {/* Metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Domain:</span>
                      <div className="text-white font-semibold capitalize">{item.domain}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Task:</span>
                      <div className="text-white font-semibold">{item.task.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Quality Score:</span>
                      <div className="text-white font-semibold">{(item.metadata.quality_score * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Created:</span>
                      <div className="text-white font-semibold">
                        {new Date(item.metadata.creation_timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Personas */}
                  <div className="space-y-2">
                    <h6 className="text-sm font-semibold text-white">Participants</h6>
                    <div className="grid md:grid-cols-2 gap-3">
                      {item.personas.map((persona, pIndex) => (
                        <div key={pIndex} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${
                              pIndex === 0 ? 'bg-blue-400' : 'bg-purple-400'
                            }`} />
                            <span className="font-semibold text-white">{persona.name}</span>
                            <span className="text-xs bg-white/20 text-gray-300 px-2 py-1 rounded capitalize">
                              {persona.role}
                            </span>
                          </div>
                          {persona.memory && persona.memory.length > 0 && (
                            <div className="text-sm text-gray-300 mb-2">
                              <span className="text-cyan-400">Memory:</span> {persona.memory.join(', ')}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {persona.traits.map((trait, tIndex) => (
                              <span key={tIndex} className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Conversation */}
                  <div className="space-y-2">
                    <h6 className="text-sm font-semibold text-white">Sample Conversation</h6>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10 max-h-32 overflow-y-auto">
                      {item.turns.slice(0, 2).map((turn) => (
                        <div key={turn.turn_id} className="text-sm text-gray-300 mb-2 last:mb-0">
                          <span className={`font-semibold ${
                            turn.speaker === 'patient' || turn.speaker === 'customer' ? 'text-blue-400' : 'text-purple-400'
                          }`}>
                            {turn.speaker}:
                          </span> {turn.text}
                        </div>
                      ))}
                      {item.turns.length > 2 && (
                        <div className="text-xs text-gray-500 mt-2">
                          ... and {item.turns.length - 2} more turns
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Export Options */}
      {dataset.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-xl p-6 border border-white/20"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-green-400" />
            Export Options
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exportDataset('json')}
              className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              <FileText className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <div className="font-semibold text-white">JSON Format</div>
                <div className="text-sm text-gray-400">Structured data format</div>
              </div>
            </motion.button>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
              <Archive className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <div className="font-semibold text-gray-400">CSV Format</div>
                <div className="text-sm text-gray-500">Coming soon</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
              <Database className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <div className="font-semibold text-gray-400">Database Export</div>
                <div className="text-sm text-gray-500">Coming soon</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
