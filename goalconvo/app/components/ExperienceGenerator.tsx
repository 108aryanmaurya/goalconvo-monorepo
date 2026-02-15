'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, User, MessageSquare, Target, Clock, ChevronDown, ChevronUp, Play, Loader2 } from 'lucide-react';
import { API_CONFIG } from '@/lib/api-config';

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

interface ExperienceGeneratorProps {
  experiences?: Experience[]; // Data comes from socket events via dashboard
  autoStart?: boolean;
  onLog?: (entry: { status: 'success' | 'error'; message: string }) => void;
  onComplete: (experiences: Experience[]) => void;
}

export default function ExperienceGenerator({ experiences = [], autoStart = false, onLog, onComplete }: ExperienceGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedExperiences, setGeneratedExperiences] = useState<Experience[]>(experiences);
  const [selectedExperience, setSelectedExperience] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');

  // Update local state when experiences prop changes (from socket events)
  useEffect(() => {
    if (experiences.length > 0) {
      setGeneratedExperiences(experiences);
      setProgress(100);
      setIsGenerating(false);
      onComplete(experiences);
    } else if (experiences.length === 0 && generatedExperiences.length > 0) {
      // Reset when experiences are cleared
      setGeneratedExperiences([]);
      setProgress(0);
    }
  }, [experiences, onComplete]);


  const generateExperiences = async () => {
    setIsGenerating(true);
    setProgress(0);
    setCurrentTask('Initializing experience generator...');
    setGeneratedExperiences([]);

    try {
      // Simulate the experience generation process
      const steps = [
        'Analyzing domain and task requirements...',
        'Generating diverse personas...',
        'Creating realistic situations...',
        'Defining clear objectives...',
        'Crafting conversation starters...',
        'Applying constraints and guidelines...',
        'Finalizing experience blueprints...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentTask(steps[i]);
        setProgress((i + 1) / steps.length * 100);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Call the Flask backend directly - only send num_experiences, backend handles domain selection
      const response = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.experienceGenerator), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num_experiences: 1
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate experiences');
      }

      const data = await response.json();
console.log(data);
      if (data.success) {
        setGeneratedExperiences(data.experiences);
        setProgress(100);
        onLog?.({
          status: 'success',
          message: `Generated ${data.experiences.length} experiences successfully.`
        });
        onComplete(data.experiences);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }

    } catch (error: any) {
      console.error('Experience generation error:', error);
      onLog?.({
        status: 'error',
        message: `Experience generation failed: ${error?.message || 'Unknown error'}. Using mock data fallback.`
      });
      // Fallback to mock data if API fails
      const mockExperiences: Experience[] = [
        {
          experience_id: 'exp_001',
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
          situation: 'Patient reports fever and cough symptoms for 3 days',
          goal: 'Doctor identifies likely cause and recommends appropriate tests or treatment',
          constraints: {
            max_turns: 10,
            max_tokens_per_turn: 60
          },
          conversation_starter: 'I have had fever for three days and it\'s not improving.'
        },
        {
          experience_id: 'exp_002',
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
          situation: 'Customer received a defective electronic device and wants a refund',
          goal: 'Agent processes refund and maintains customer satisfaction',
          constraints: {
            max_turns: 10,
            max_tokens_per_turn: 60
          },
          conversation_starter: 'I received my order yesterday, but the device isn\'t working properly. I\'d like to return it for a refund.'
        }
      ];

      setGeneratedExperiences(mockExperiences);
      setProgress(100);
      onComplete(mockExperiences);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">Experience Generation</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateExperiences}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Generate Experiences
              </>
            )}
          </motion.button>
        </div>

        {/* Progress Display */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-300">{currentTask}</span>
              <span className="text-cyan-400 font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-cyan-400 to-purple-600 h-3 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Generated Experiences */}
      {generatedExperiences.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Generated Experiences ({generatedExperiences.length})
          </h4>

          {generatedExperiences.map((experience, index) => (
            <motion.div
              key={experience.experience_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-xl border border-white/20 overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setSelectedExperience(selectedExperience === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      experience.domain === 'healthcare' ? 'bg-red-400' :
                      experience.domain === 'customer_support' ? 'bg-blue-400' :
                      experience.domain === 'education' ? 'bg-green-400' : 'bg-purple-400'
                    }`} />
                    <div>
                      <h5 className="font-semibold text-white">{experience.personas[0].name} & {experience.personas[1].name}</h5>
                      <p className="text-sm text-gray-300">{experience.task.replace('_', ' ').toUpperCase()}</p>
                    </div>
                  </div>
                  {selectedExperience === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {selectedExperience === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/20"
                  >
                    <div className="p-4 space-y-4">
                      {/* Personas */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {experience.personas.map((persona, pIndex) => (
                          <div key={pIndex} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-white">{persona.name}</span>
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded capitalize">
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

                      {/* Situation & Goal */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-purple-400" />
                            <span className="font-semibold text-white">Situation</span>
                          </div>
                          <p className="text-sm text-gray-300">{experience.situation}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-green-400" />
                            <span className="font-semibold text-white">Goal</span>
                          </div>
                          <p className="text-sm text-gray-300">{experience.goal}</p>
                        </div>
                      </div>

                      {/* Conversation Starter */}
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-pink-400" />
                          <span className="font-semibold text-white">Conversation Starter</span>
                        </div>
                        <p className="text-sm text-gray-300 italic">&ldquo;{experience.conversation_starter}&rdquo;</p>
                      </div>

                      {/* Constraints */}
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <span className="font-semibold text-white">Constraints</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-300">
                            <span className="text-cyan-400">Max Turns:</span> {experience.constraints.max_turns}
                          </div>
                          <div className="text-gray-300">
                            <span className="text-cyan-400">Max Tokens:</span> {experience.constraints.max_tokens_per_turn}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
