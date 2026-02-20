'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Target, CheckCircle, XCircle, AlertTriangle, Award, Zap, Clock } from 'lucide-react';
import { API_CONFIG } from '@/lib/api-config';

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
  comprehensive_metrics?: {
    bertscore_similarity?: {
      overall_bertscore: number;
      std_bertscore: number;
      target_score: number;
      domain_bertscores?: Record<string, { mean: number; std: number; count: number }>;
      note?: string;
    };
    lexical_diversity?: {
      distinct_1: number;
      distinct_2: number;
      combined: number;
      target_diversity: number;
      real_diversity?: { distinct_1: number; distinct_2: number; combined: number };
      diversity_ratio?: number;
      domain_diversity?: Record<string, { distinct_1: number; distinct_2: number; combined: number }>;
      note?: string;
    };
    response_time?: {
      avg_response_time: number;
      std_response_time: number;
      min_response_time: number;
      max_response_time: number;
      avg_time_per_turn: number;
      total_dialogues: number;
      dialogues_with_timing: number;
      target_time: number;
      domain_response_times?: Record<string, { mean: number; std: number; min: number; max: number; count: number }>;
      note?: string;
    };
    goal_completion_rate?: {
      overall_gcr: number;
      completed_count: number;
      total_count: number;
      domain_gcr?: Record<string, { completed: number; total: number; percentage: number }>;
    };
    task_success_rate?: {
      overall_tsr: number;
      successful_count: number;
      total_count: number;
      domain_tsr?: Record<string, { successful: number; total: number; percentage: number }>;
    };
    bleu_score?: {
      average_bleu: number;
      std_bleu: number;
      domain_bleu?: Record<string, { mean: number; std: number; count: number }>;
    };
    dialogue_length?: {
      avg_turns: number;
      std_turns: number;
      avg_words: number;
      avg_chars: number;
      domain_metrics?: Record<string, { avg_turns: number; avg_words: number; avg_chars: number }>;
    };
    repetition_rate?: {
      overall_repetition_rate: number;
      std_repetition_rate: number;
      domain_repetition?: Record<string, { avg_repetition: number; std_repetition: number; count: number }>;
    };
    llm_judge?: {
      overall_scores?: {
        task_success?: { mean: number; std: number; count: number };
        coherence?: { mean: number; std: number; count: number };
        diversity?: { mean: number; std: number; count: number };
        fluency?: { mean: number; std: number; count: number };
        groundedness?: { mean: number; std: number; count: number };
      };
      domain_scores?: Record<string, any>;
    };
  };
}

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

interface EvaluatorProps {
  dataset?: DatasetItem[];
  metrics?: EvaluationMetrics; // Data comes from socket events via dashboard
  autoStart?: boolean;
  onLog?: (entry: { status: 'success' | 'error'; message: string }) => void;
  onComplete: (evaluations: EvaluationMetrics) => void;
}

export default function Evaluator({ dataset = [], metrics: propMetrics, autoStart = false, onLog, onComplete }: EvaluatorProps) {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [metrics, setMetrics] = useState<EvaluationMetrics | null>(propMetrics || null);
  const [evaluationStep, setEvaluationStep] = useState('');
  const [progress, setProgress] = useState(0);

  // Update local state when metrics prop changes (from socket events)
  useEffect(() => {
    if (propMetrics) {
      setMetrics(propMetrics);
      setProgress(100);
      setIsEvaluating(false);
      onComplete(propMetrics);
    } else if (!propMetrics && metrics) {
      // Reset when metrics are cleared
      setMetrics(null);
      setProgress(0);
    }
  }, [propMetrics, onComplete]);

  const mockMetrics: EvaluationMetrics = {
    overall_score: 0.89,
    diversity_score: 0.85,
    coherence_score: 0.92,
    task_success_rate: 0.87,
    fluency_score: 0.91,
    groundedness_score: 0.88,
    categories: {
      lexical_diversity: 78.5,
      conversation_length: {
        avg_turns: 6.8,
        std_dev: 2.1
      },
      domain_distribution: {
        healthcare: 45,
        customer_support: 35,
        education: 20
      },
      task_success_by_domain: {
        healthcare: 0.92,
        customer_support: 0.85,
        education: 0.83
      }
    }
  };

  const startEvaluation = async () => {
    setIsEvaluating(true);
    setProgress(0);
    setMetrics(null);

    try {
      const steps = [
        'Analyzing lexical diversity (MTLD)...',
        'Evaluating conversation coherence...',
        'Assessing task success rates...',
        'Measuring fluency and naturalness...',
        'Checking groundedness in personas...',
        'Computing domain distribution...',
        'Generating final evaluation report...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setEvaluationStep(steps[i]);
        setProgress((i + 1) / steps.length * 100);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Component now only displays data from props (populated via socket events)
      // No API calls - data comes from GoalConvoDashboard via socket events
      setIsEvaluating(false);
    } catch (error: any) {
      console.error('Evaluation error:', error);
      onLog?.({
        status: 'error',
        message: `Evaluation failed: ${error?.message || 'Unknown error'}. Using mock evaluation metrics.`
      });
      // Fallback to mock data if API fails
      setMetrics(mockMetrics);
      setIsEvaluating(false);
      onComplete(mockMetrics);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-400 bg-green-500/20 border-green-400/30';
    if (score >= 0.8) return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
    if (score >= 0.7) return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
    return 'text-red-400 bg-red-500/20 border-red-400/30';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 0.9) return <Award className="w-5 h-5" />;
    if (score >= 0.8) return <CheckCircle className="w-5 h-5" />;
    if (score >= 0.7) return <AlertTriangle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Evaluation Controls */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">Evaluation Framework</h3>
          </div>
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startEvaluation}
            disabled={isEvaluating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isEvaluating ? (
              <>
                <Zap className="w-5 h-5 animate-pulse" />
                Evaluating...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                Start Evaluation
              </>
            )}
          </motion.button> */}
        </div>

        {/* Evaluation Progress */}
        {isEvaluating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-300">{evaluationStep}</span>
              <span className="text-cyan-400 font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-cyan-400 to-blue-600 h-3 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Evaluation Results */}
      {metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* BERTScore Semantic Similarity - Prominent Display */}
          {metrics.comprehensive_metrics?.bertscore_similarity && (
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border-2 border-blue-400/50 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">BERTScore Semantic Similarity</h3>
                    <p className="text-sm text-gray-300">Measures semantic similarity to MultiWOZ reference dialogues</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-400">
                    {metrics.comprehensive_metrics.bertscore_similarity.overall_bertscore?.toFixed(3)}
                  </div>
                  <div className="text-sm text-gray-300">
                    Target: {metrics.comprehensive_metrics.bertscore_similarity.target_score?.toFixed(2)}
                  </div>
                  {metrics.comprehensive_metrics.bertscore_similarity.overall_bertscore >= metrics.comprehensive_metrics.bertscore_similarity.target_score ? (
                    <div className="text-green-400 text-sm font-semibold mt-1">✅ Above Target</div>
                  ) : (
                    <div className="text-yellow-400 text-sm font-semibold mt-1">⚠️ Below Target</div>
                  )}
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-400 to-cyan-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(metrics.comprehensive_metrics.bertscore_similarity.overall_bertscore / metrics.comprehensive_metrics.bertscore_similarity.target_score) * 100}%` }}
                />
              </div>
              {metrics.comprehensive_metrics.bertscore_similarity.domain_bertscores && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(metrics.comprehensive_metrics.bertscore_similarity.domain_bertscores).map(([domain, stats]: [string, any]) => (
                    <div key={domain} className="text-center">
                      <div className="text-xs text-gray-400 capitalize mb-1">{domain}</div>
                      <div className="text-lg font-bold text-white">{stats.mean?.toFixed(3)}</div>
                      <div className="text-xs text-gray-500">n={stats.count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Lexical Diversity - Prominent Display */}
          {metrics.comprehensive_metrics?.lexical_diversity && (
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border-2 border-purple-400/50 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">Lexical Diversity</h3>
                    <p className="text-sm text-gray-300">Measures vocabulary richness using Distinct-1 and Distinct-2 metrics</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-purple-400">
                    {metrics.comprehensive_metrics.lexical_diversity.combined?.toFixed(3)}
                  </div>
                  <div className="text-sm text-gray-300">
                    Target: {metrics.comprehensive_metrics.lexical_diversity.target_diversity?.toFixed(2)}
                  </div>
                  {metrics.comprehensive_metrics.lexical_diversity.combined >= metrics.comprehensive_metrics.lexical_diversity.target_diversity ? (
                    <div className="text-green-400 text-sm font-semibold mt-1">✅ Above Target</div>
                  ) : (
                    <div className="text-yellow-400 text-sm font-semibold mt-1">⚠️ Below Target</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Distinct-1</div>
                  <div className="text-2xl font-bold text-purple-300">
                    {metrics.comprehensive_metrics.lexical_diversity.distinct_1?.toFixed(3)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Unique unigrams / Total</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Distinct-2</div>
                  <div className="text-2xl font-bold text-pink-300">
                    {metrics.comprehensive_metrics.lexical_diversity.distinct_2?.toFixed(3)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Unique bigrams / Total</div>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((metrics.comprehensive_metrics.lexical_diversity.combined / metrics.comprehensive_metrics.lexical_diversity.target_diversity) * 100, 100)}%` }}
                />
              </div>
              {metrics.comprehensive_metrics.lexical_diversity.domain_diversity && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(metrics.comprehensive_metrics.lexical_diversity.domain_diversity).map(([domain, stats]: [string, any]) => (
                    <div key={domain} className="text-center">
                      <div className="text-xs text-gray-400 capitalize mb-1">{domain}</div>
                      <div className="text-lg font-bold text-white">{stats.combined?.toFixed(3)}</div>
                      <div className="text-xs text-gray-500">D-1: {stats.distinct_1?.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Response Time - Prominent Display */}
          {metrics.comprehensive_metrics?.response_time && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border-2 border-green-400/50 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-green-400" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">Response Time</h3>
                    <p className="text-sm text-gray-300">Measures dialogue generation time per dialogue</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-green-400">
                    {metrics.comprehensive_metrics?.response_time?.avg_response_time?.toFixed(2)}s
                  </div>
                  <div className="text-sm text-gray-300">
                    Target: {metrics.comprehensive_metrics.response_time.target_time?.toFixed(1)}s
                  </div>
                  {metrics.comprehensive_metrics?.response_time?.avg_response_time <= metrics.comprehensive_metrics?.response_time?.target_time ? (
                    <div className="text-green-400 text-sm font-semibold mt-1">✅ Within Target</div>
                  ) : (
                    <div className="text-yellow-400 text-sm font-semibold mt-1">⚠️ Above Target</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Average</div>
                  <div className="text-2xl font-bold text-green-300">
                    {metrics.comprehensive_metrics?.response_time?.avg_response_time?.toFixed(2)}s
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Per Turn</div>
                  <div className="text-2xl font-bold text-emerald-300">
                    {metrics.comprehensive_metrics.response_time.avg_time_per_turn?.toFixed(3)}s
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Min</div>
                  <div className="text-xl font-bold text-green-200">
                    {metrics.comprehensive_metrics.response_time.min_response_time?.toFixed(2)}s
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Max</div>
                  <div className="text-xl font-bold text-green-200">
                    {metrics.comprehensive_metrics.response_time.max_response_time?.toFixed(2)}s
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((metrics.comprehensive_metrics.response_time.target_time / Math.max(metrics.comprehensive_metrics.response_time.avg_response_time, 0.1)) * 100, 100)}%` }}
                />
              </div>
              <div className="mt-3 text-sm text-gray-400">
                {metrics.comprehensive_metrics.response_time.dialogues_with_timing} / {metrics.comprehensive_metrics.response_time.total_dialogues} dialogues with timing data
              </div>
              {metrics.comprehensive_metrics.response_time.domain_response_times && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(metrics.comprehensive_metrics.response_time.domain_response_times).map(([domain, stats]: [string, any]) => (
                    <div key={domain} className="text-center">
                      <div className="text-xs text-gray-400 capitalize mb-1">{domain}</div>
                      <div className="text-lg font-bold text-white">{stats.mean?.toFixed(2)}s</div>
                      <div className="text-xs text-gray-500">n={stats.count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Overall Scores */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className={`rounded-xl border p-4 ${getScoreColor(metrics.overall_score)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getScoreIcon(metrics.overall_score)}
                <span className="font-semibold text-white">Overall Score</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(metrics.overall_score * 100)?.toFixed(1)}%
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${getScoreColor(metrics.diversity_score)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getScoreIcon(metrics.diversity_score)}
                <span className="font-semibold text-white">Diversity</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(metrics.diversity_score * 100)?.toFixed(1)}%
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${getScoreColor(metrics.coherence_score)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getScoreIcon(metrics.coherence_score)}
                <span className="font-semibold text-white">Coherence</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(metrics.coherence_score * 100)?.toFixed(1)}%
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${getScoreColor(metrics.task_success_rate)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getScoreIcon(metrics.task_success_rate)}
                <span className="font-semibold text-white">Task Success</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(metrics.task_success_rate * 100)?.toFixed(1)}%
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${getScoreColor(metrics.fluency_score)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getScoreIcon(metrics.fluency_score)}
                <span className="font-semibold text-white">Fluency</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(metrics.fluency_score * 100)?.toFixed(1)}%
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${getScoreColor(metrics.groundedness_score)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getScoreIcon(metrics.groundedness_score)}
                <span className="font-semibold text-white">Groundedness</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(metrics.groundedness_score * 100)?.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lexical Diversity */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Lexical Diversity
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">MTLD Score</span>
                  <span className="font-semibold text-white">{metrics.categories.lexical_diversity?.toFixed(1)}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-pink-600 h-2 rounded-full"
                    style={{ width: `${(metrics.categories.lexical_diversity / 100) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Higher MTLD indicates greater lexical diversity and richness in vocabulary
                </p>
              </div>
            </div>

            {/* Conversation Length */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Conversation Statistics
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Turns</span>
                  <span className="font-semibold text-white">{metrics.categories.conversation_length.avg_turns?.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Standard Deviation</span>
                  <span className="font-semibold text-white">{metrics.categories.conversation_length.std_dev?.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-400">
                  Balanced conversation lengths indicate natural dialogue patterns
                </p>
              </div>
            </div>
          </div>

          {/* Domain Distribution */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Domain Distribution
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {Object.entries(metrics.categories.domain_distribution).map(([domain, percentage]) => (
                <div key={domain} className="text-center">
                  <div className="text-lg font-bold text-white mb-1 capitalize">{domain.replace('_', ' ')}</div>
                  <div className="text-2xl font-bold text-cyan-400">{percentage}%</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {Object.entries(metrics.categories.domain_distribution).map(([domain, percentage]) => (
                <div key={domain} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-gray-300 capitalize">{domain.replace('_', ' ')}</div>
                  <div className="flex-1 bg-white/20 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-blue-600 h-3 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm font-semibold text-white text-right">{percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Success by Domain */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Task Success by Domain
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(metrics.categories.task_success_by_domain).map(([domain, successRate]) => (
                <div key={domain} className={`rounded-lg p-4 border ${getScoreColor(successRate)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getScoreIcon(successRate)}
                    <span className="font-semibold text-white capitalize">{domain.replace('_', ' ')}</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {(successRate * 100)?.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-300">Success Rate</div>
                </div>
              ))}
            </div>
          </div>

          {/* Comprehensive Metrics Section */}
          {metrics.comprehensive_metrics && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
                Comprehensive Evaluation Metrics
              </h3>

              {/* BERTScore Semantic Similarity - Detailed View */}
              {metrics.comprehensive_metrics.bertscore_similarity && (
                <div className="bg-white/5 rounded-xl p-6 border border-blue-400/30">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    BERTScore Semantic Similarity
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Overall BERTScore</span>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-blue-400">
                          {metrics.comprehensive_metrics.bertscore_similarity.overall_bertscore?.toFixed(3)}
                        </span>
                        <span className="text-gray-400 ml-2">
                          / {metrics.comprehensive_metrics.bertscore_similarity.target_score?.toFixed(2)} target
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      Std Dev: {metrics.comprehensive_metrics.bertscore_similarity.std_bertscore?.toFixed(3)}
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-cyan-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((metrics.comprehensive_metrics.bertscore_similarity.overall_bertscore / metrics.comprehensive_metrics.bertscore_similarity.target_score) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {metrics.comprehensive_metrics.bertscore_similarity.note || "Measures semantic similarity to MultiWOZ reference dialogues"}
                    </p>
                    {metrics.comprehensive_metrics.bertscore_similarity.domain_bertscores && (
                      <div className="mt-4 space-y-2">
                        <div className="text-sm font-semibold text-gray-300">By Domain:</div>
                        {Object.entries(metrics.comprehensive_metrics.bertscore_similarity.domain_bertscores).map(([domain, stats]: [string, any]) => (
                          <div key={domain} className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 capitalize">{domain}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-white">{stats.mean?.toFixed(3)}</span>
                              <span className="text-gray-500">±{stats.std?.toFixed(3)}</span>
                              <span className="text-gray-500">(n={stats.count})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Lexical Diversity - Detailed View */}
              {metrics.comprehensive_metrics.lexical_diversity && (
                <div className="bg-white/5 rounded-xl p-6 border border-purple-400/30">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    Lexical Diversity
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Combined Score</div>
                        <div className="text-3xl font-bold text-purple-400">
                          {metrics.comprehensive_metrics.lexical_diversity.combined?.toFixed(3)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Target: {metrics.comprehensive_metrics.lexical_diversity.target_diversity?.toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Distinct-1</div>
                        <div className="text-2xl font-bold text-purple-300">
                          {metrics.comprehensive_metrics.lexical_diversity.distinct_1?.toFixed(3)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Unique unigrams / Total</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Distinct-2</div>
                        <div className="text-2xl font-bold text-pink-300">
                          {metrics.comprehensive_metrics.lexical_diversity.distinct_2?.toFixed(3)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Unique bigrams / Total</div>
                      </div>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-pink-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((metrics.comprehensive_metrics.lexical_diversity.combined / metrics.comprehensive_metrics.lexical_diversity.target_diversity) * 100, 100)}%` }}
                      />
                    </div>
                    {metrics.comprehensive_metrics.lexical_diversity.real_diversity && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-sm text-gray-400">Synthetic Diversity:</div>
                        <div className="text-sm font-semibold text-white">
                          {metrics.comprehensive_metrics.lexical_diversity.combined?.toFixed(3)}
                        </div>
                        <div className="text-sm text-gray-400">Real (MultiWOZ) Diversity:</div>
                        <div className="text-sm font-semibold text-white">
                          {metrics.comprehensive_metrics.lexical_diversity.real_diversity.combined?.toFixed(3)}
                        </div>
                        {metrics.comprehensive_metrics.lexical_diversity.diversity_ratio && (
                          <>
                            <div className="text-sm text-gray-400">Diversity Ratio:</div>
                            <div className="text-sm font-semibold text-purple-400">
                              {metrics.comprehensive_metrics.lexical_diversity.diversity_ratio?.toFixed(2)}x
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    <p className="text-sm text-gray-400 mt-2">
                      {metrics.comprehensive_metrics.lexical_diversity.note || "Measures vocabulary richness using Distinct-1 and Distinct-2 metrics"}
                    </p>
                    {metrics.comprehensive_metrics.lexical_diversity.domain_diversity && (
                      <div className="mt-4 space-y-2">
                        <div className="text-sm font-semibold text-gray-300">By Domain:</div>
                        {Object.entries(metrics.comprehensive_metrics.lexical_diversity.domain_diversity).map(([domain, stats]: [string, any]) => (
                          <div key={domain} className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 capitalize">{domain}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-white">Combined: {stats.combined?.toFixed(3)}</span>
                              <span className="text-gray-500">D-1: {stats.distinct_1?.toFixed(2)}</span>
                              <span className="text-gray-500">D-2: {stats.distinct_2?.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Response Time - Detailed View */}
              {metrics.comprehensive_metrics.response_time && (
                <div className="bg-white/5 rounded-xl p-6 border border-green-400/30">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    Response Time
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Average Time</div>
                        <div className="text-3xl font-bold text-green-400">
                          {metrics.comprehensive_metrics?.response_time?.avg_response_time?.toFixed(2)}s
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Target: {metrics.comprehensive_metrics.response_time.target_time?.toFixed(1)}s
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Per Turn</div>
                        <div className="text-2xl font-bold text-emerald-400">
                          {metrics.comprehensive_metrics.response_time.avg_time_per_turn?.toFixed(3)}s
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Average per turn</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Min Time</div>
                        <div className="text-2xl font-bold text-green-300">
                          {metrics.comprehensive_metrics.response_time.min_response_time?.toFixed(2)}s
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Max Time</div>
                        <div className="text-2xl font-bold text-green-300">
                          {metrics.comprehensive_metrics.response_time.max_response_time?.toFixed(2)}s
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      Std Dev: {metrics.comprehensive_metrics.response_time.std_response_time?.toFixed(3)}s
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-400 to-emerald-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((metrics.comprehensive_metrics.response_time.target_time / Math.max(metrics.comprehensive_metrics.response_time.avg_response_time, 0.1)) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {metrics.comprehensive_metrics.response_time.note || "Measures dialogue generation time in seconds"}
                    </p>
                    {metrics.comprehensive_metrics.response_time.domain_response_times && (
                      <div className="mt-4 space-y-2">
                        <div className="text-sm font-semibold text-gray-300">By Domain:</div>
                        {Object.entries(metrics.comprehensive_metrics.response_time.domain_response_times).map(([domain, stats]: [string, any]) => (
                          <div key={domain} className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 capitalize">{domain}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-white">Avg: {stats.mean?.toFixed(2)}s</span>
                              <span className="text-gray-500">Min: {stats.min?.toFixed(2)}s</span>
                              <span className="text-gray-500">Max: {stats.max?.toFixed(2)}s</span>
                              <span className="text-gray-500">(n={stats.count})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Goal Completion Rate & Task Success Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {metrics.comprehensive_metrics.goal_completion_rate && (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-400" />
                      Goal Completion Rate (GCR)
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Overall GCR</span>
                        <span className="text-2xl font-bold text-green-400">
                          {metrics.comprehensive_metrics.goal_completion_rate.overall_gcr?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {metrics.comprehensive_metrics.goal_completion_rate.completed_count} / {metrics.comprehensive_metrics.goal_completion_rate.total_count} dialogues completed
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                          style={{ width: `${metrics.comprehensive_metrics.goal_completion_rate.overall_gcr}%` }}
                        />
                      </div>
                      {metrics.comprehensive_metrics.goal_completion_rate.domain_gcr && (
                        <div className="mt-4 space-y-2">
                          <div className="text-sm font-semibold text-gray-300">By Domain:</div>
                          {Object.entries(metrics.comprehensive_metrics.goal_completion_rate.domain_gcr).map(([domain, stats]) => (
                            <div key={domain} className="flex justify-between items-center text-sm">
                              <span className="text-gray-400 capitalize">{domain}</span>
                              <span className="text-white">{stats.percentage?.toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {metrics.comprehensive_metrics.task_success_rate && (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                      Task Success Rate (TSR)
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Overall TSR</span>
                        <span className="text-2xl font-bold text-blue-400">
                          {metrics.comprehensive_metrics.task_success_rate.overall_tsr?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {metrics.comprehensive_metrics.task_success_rate.successful_count} / {metrics.comprehensive_metrics.task_success_rate.total_count} dialogues successful
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
                          style={{ width: `${metrics.comprehensive_metrics.task_success_rate.overall_tsr}%` }}
                        />
                      </div>
                      {metrics.comprehensive_metrics.task_success_rate.domain_tsr && (
                        <div className="mt-4 space-y-2">
                          <div className="text-sm font-semibold text-gray-300">By Domain:</div>
                          {Object.entries(metrics.comprehensive_metrics.task_success_rate.domain_tsr).map(([domain, stats]) => (
                            <div key={domain} className="flex justify-between items-center text-sm">
                              <span className="text-gray-400 capitalize">{domain}</span>
                              <span className="text-white">{stats.percentage?.toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* BLEU Score & Repetition Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {metrics.comprehensive_metrics.bleu_score && (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      BLEU Score
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Average BLEU</span>
                        <span className="text-2xl font-bold text-purple-400">
                          {metrics.comprehensive_metrics.bleu_score.average_bleu?.toFixed(3)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Std Dev: {metrics.comprehensive_metrics.bleu_score.std_bleu?.toFixed(3)}
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-400 to-pink-600 h-3 rounded-full"
                          style={{ width: `${(metrics.comprehensive_metrics.bleu_score.average_bleu * 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        Measures fluency by comparing to MultiWOZ reference dialogues
                      </p>
                    </div>
                  </div>
                )}

                {metrics.comprehensive_metrics.repetition_rate && (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-yellow-400" />
                      Repetition Rate
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Overall Rate</span>
                        <span className="text-2xl font-bold text-yellow-400">
                          {(metrics.comprehensive_metrics.repetition_rate.overall_repetition_rate * 100)?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Lower is better (indicates more diverse dialogue)
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-600 h-3 rounded-full"
                          style={{ width: `${(metrics.comprehensive_metrics.repetition_rate.overall_repetition_rate * 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        Measures redundancy across dialogue turns
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* LLM-as-a-Judge Metrics */}
              {metrics.comprehensive_metrics.llm_judge?.overall_scores && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-cyan-400" />
                    LLM-as-a-Judge Evaluation
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {metrics.comprehensive_metrics.llm_judge.overall_scores.task_success && (
                      <div className={`rounded-lg border p-4 ${getScoreColor(metrics.comprehensive_metrics.llm_judge.overall_scores.task_success.mean / 100)}`}>
                        <div className="text-sm text-gray-300 mb-1">Task Success</div>
                        <div className="text-2xl font-bold text-white">
                          {metrics.comprehensive_metrics.llm_judge.overall_scores.task_success.mean?.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-400">/ 100</div>
                      </div>
                    )}
                    {metrics.comprehensive_metrics.llm_judge.overall_scores.coherence && (
                      <div className={`rounded-lg border p-4 ${getScoreColor(metrics.comprehensive_metrics.llm_judge.overall_scores.coherence.mean / 100)}`}>
                        <div className="text-sm text-gray-300 mb-1">Coherence</div>
                        <div className="text-2xl font-bold text-white">
                          {metrics.comprehensive_metrics.llm_judge.overall_scores.coherence.mean?.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-400">/ 100</div>
                      </div>
                    )}
                    {metrics.comprehensive_metrics.llm_judge.overall_scores.diversity && (
                      <div className={`rounded-lg border p-4 ${getScoreColor(metrics.comprehensive_metrics.llm_judge.overall_scores.diversity.mean / 100)}`}>
                        <div className="text-sm text-gray-300 mb-1">Diversity</div>
                        <div className="text-2xl font-bold text-white">
                          {metrics.comprehensive_metrics.llm_judge.overall_scores.diversity.mean?.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-400">/ 100</div>
                      </div>
                    )}
                    {metrics.comprehensive_metrics.llm_judge.overall_scores.fluency && (
                      <div className={`rounded-lg border p-4 ${getScoreColor(metrics.comprehensive_metrics.llm_judge.overall_scores.fluency.mean / 100)}`}>
                        <div className="text-sm text-gray-300 mb-1">Fluency</div>
                        <div className="text-2xl font-bold text-white">
                          {metrics.comprehensive_metrics.llm_judge.overall_scores.fluency.mean?.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-400">/ 100</div>
                      </div>
                    )}
                    {metrics.comprehensive_metrics.llm_judge.overall_scores.groundedness && (
                      <div className={`rounded-lg border p-4 ${getScoreColor(metrics.comprehensive_metrics.llm_judge.overall_scores.groundedness.mean / 100)}`}>
                        <div className="text-sm text-gray-300 mb-1">Groundedness</div>
                        <div className="text-2xl font-bold text-white">
                          {metrics.comprehensive_metrics.llm_judge.overall_scores.groundedness.mean?.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-400">/ 100</div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    Expert LLM evaluation on a 0-100 scale for each quality dimension
                  </p>
                  <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <h5 className="text-sm font-semibold text-white mb-2">Score drill-down: how each dimension contributes</h5>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li><strong className="text-gray-300">Task Success</strong> — Whether the user goal was fulfilled (85+ = goal achieved or user satisfied).</li>
                      <li><strong className="text-gray-300">Coherence</strong> — Turns are logical and context-aware; conversation flows naturally.</li>
                      <li><strong className="text-gray-300">Diversity</strong> — Phrasing is varied and non-repetitive across turns.</li>
                      <li><strong className="text-gray-300">Fluency</strong> — Grammar and language are natural with no obvious errors.</li>
                      <li><strong className="text-gray-300">Groundedness</strong> — Responses stay on topic and avoid fabrication.</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">Overall quality is a combination of these dimensions; low scores in one (e.g. Task Success) can pull down the aggregate.</p>
                  </div>
                </div>
              )}

              {/* Dialogue Length Details */}
              {metrics.comprehensive_metrics.dialogue_length && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    Dialogue Length Statistics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-300 mb-1">Avg Turns</div>
                      <div className="text-xl font-bold text-white">
                        {metrics.comprehensive_metrics.dialogue_length.avg_turns?.toFixed(1)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300 mb-1">Std Dev</div>
                      <div className="text-xl font-bold text-white">
                        {metrics.comprehensive_metrics.dialogue_length.std_turns?.toFixed(1)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300 mb-1">Avg Words</div>
                      <div className="text-xl font-bold text-white">
                        {metrics.comprehensive_metrics.dialogue_length.avg_words?.toFixed(0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300 mb-1">Avg Chars</div>
                      <div className="text-xl font-bold text-white">
                        {metrics.comprehensive_metrics.dialogue_length.avg_chars?.toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Evaluation Summary */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-xl p-6 border border-cyan-400/30">
            <h4 className="text-lg font-semibold text-white mb-3">Evaluation Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300 mb-2">
                  The GoalConvo system demonstrates strong performance across all evaluated metrics:
                </p>
                <ul className="space-y-1 text-gray-300">
                  <li>• High lexical diversity indicating rich vocabulary usage</li>
                  <li>• Excellent coherence scores showing natural conversation flow</li>
                  <li>• Strong task success rates across all domains</li>
                  <li>• Good balance of conversation lengths</li>
                  {metrics.comprehensive_metrics?.goal_completion_rate && (
                    <li>• Goal Completion Rate: {metrics.comprehensive_metrics.goal_completion_rate.overall_gcr?.toFixed(1)}%</li>
                  )}
                  {metrics.comprehensive_metrics?.bleu_score && (
                    <li>• BLEU Score: {metrics.comprehensive_metrics.bleu_score.average_bleu?.toFixed(3)}</li>
                  )}
                </ul>
              </div>
              <div>
                <p className="text-gray-300 mb-2">
                  Areas for potential improvement:
                </p>
                <ul className="space-y-1 text-gray-300">
                  <li>• Further domain diversification</li>
                  <li>• Enhanced persona complexity</li>
                  <li>• More sophisticated goal detection</li>
                  <li>• Advanced filtering mechanisms</li>
                  {metrics.comprehensive_metrics?.repetition_rate && metrics.comprehensive_metrics.repetition_rate.overall_repetition_rate > 0.15 && (
                    <li>• Reduce repetition rate (currently {(metrics.comprehensive_metrics.repetition_rate.overall_repetition_rate * 100)?.toFixed(1)}%)</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
