'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, User, Plus, ChevronRight, BarChart3, FileDown, CheckCircle, Database } from 'lucide-react';
import { API_CONFIG } from '@/lib/api-config';

interface VersionItem {
  version_id: string;
  created_at?: string;
  dialogue_count?: number;
  tags?: string[];
}

const DIMENSIONS = [
  { id: 'coherence', label: 'Coherence' },
  { id: 'naturalness', label: 'Naturalness' },
  { id: 'task_success', label: 'Task Success' },
  { id: 'fluency', label: 'Fluency' },
  { id: 'relevance', label: 'Relevance' },
  { id: 'overall_quality', label: 'Overall Quality' },
] as const;

const ANNOTATOR_STORAGE_KEY = 'goalconvo_annotator_id';

interface DialogueData {
  goal?: string;
  domain?: string;
  turns?: Array<{ role: string; text: string }>;
}

interface TaskItem {
  task_id: string;
  dialogue_id: string;
  assigned_to: string;
  status: string;
  created_at: string;
  completed_at?: string;
}

export default function HumanEvaluation() {
  const [annotatorId, setAnnotatorId] = useState('');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskDetail, setTaskDetail] = useState<{ dialogue_data: DialogueData } | null>(null);
  const [dimensions, setDimensions] = useState<Record<string, number>>(
    Object.fromEntries(DIMENSIONS.map(d => [d.id, 3]))
  );
  const [comments, setComments] = useState('');
  const [taskCompleted, setTaskCompleted] = useState(true);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [agreementDialogueId, setAgreementDialogueId] = useState('');
  const [agreementDimension, setAgreementDimension] = useState('overall_quality');
  const [agreementResult, setAgreementResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [versionDialogues, setVersionDialogues] = useState<Array<{ dialogue_id: string; dialogue_data: DialogueData }>>([]);
  const [creatingTasks, setCreatingTasks] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(ANNOTATOR_STORAGE_KEY) : null;
    if (stored) setAnnotatorId(stored);
  }, []);

  useEffect(() => {
    if (annotatorId && typeof window !== 'undefined') {
      localStorage.setItem(ANNOTATOR_STORAGE_KEY, annotatorId);
    }
  }, [annotatorId]);

  const fetchTasks = async () => {
    if (!annotatorId) {
      setMessage({ type: 'error', text: 'Set Annotator ID first' });
      return;
    }
    setLoading(true);
    try {
      const url = `${API_CONFIG.getUrl(API_CONFIG.endpoints.humanEvalTasks)}?assigned_to=${encodeURIComponent(annotatorId)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) setTasks(data.tasks || []);
      else setMessage({ type: 'error', text: data.error || 'Failed to load tasks' });
    } catch (e) {
      setMessage({ type: 'error', text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskDetail = async (taskId: string) => {
    setLoading(true);
    try {
      const res = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.humanEvalTask(taskId)));
      const data = await res.json();
      if (res.ok) {
        setSelectedTaskId(taskId);
        setTaskDetail({ dialogue_data: data.dialogue_data || {} });
        setDimensions(Object.fromEntries(DIMENSIONS.map(d => [d.id, 3])));
        setComments('');
        setTaskCompleted(true);
      } else setMessage({ type: 'error', text: data.error || 'Failed to load task' });
    } catch (e) {
      setMessage({ type: 'error', text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const submitAnnotation = async () => {
    if (!selectedTaskId || !annotatorId) {
      setMessage({ type: 'error', text: 'Task and Annotator ID required' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.humanEvalAnnotate), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: selectedTaskId,
          annotator_id: annotatorId,
          dimensions,
          comments: comments || undefined,
          task_completed: taskCompleted,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Annotation submitted' });
        setSelectedTaskId(null);
        setTaskDetail(null);
        fetchTasks();
      } else setMessage({ type: 'error', text: data.error || 'Submit failed' });
    } catch (e) {
      setMessage({ type: 'error', text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.humanEvalStatistics));
      const data = await res.json();
      if (res.ok) setStats(data);
      else setMessage({ type: 'error', text: data.error || 'Failed to load statistics' });
    } catch (e) {
      setMessage({ type: 'error', text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const fetchAgreement = async () => {
    if (!agreementDialogueId) {
      setMessage({ type: 'error', text: 'Enter a dialogue ID' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.humanEvalAgreement), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dialogue_id: agreementDialogueId, dimension: agreementDimension }),
      });
      const data = await res.json();
      if (res.ok) setAgreementResult(data);
      else setMessage({ type: 'error', text: data.error || 'Agreement failed' });
    } catch (e) {
      setMessage({ type: 'error', text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.versions));
      const data = await res.json();
      if (res.ok) setVersions(data.versions || data || []);
      else setMessage({ type: 'error', text: data.error || 'Failed to load versions' });
    } catch (e) {
      setMessage({ type: 'error', text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const loadDialoguesForVersion = async () => {
    if (!selectedVersionId) {
      setMessage({ type: 'error', text: 'Select a version first' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.versionDialogues(selectedVersionId)));
      const data = await res.json();
      if (res.ok) {
        const list = data.dialogues || data || [];
        setVersionDialogues(
          list.map((d: { dialogue_id?: string; id?: string; goal?: string; domain?: string; turns?: unknown[] }) => ({
            dialogue_id: d.dialogue_id || d.id || '',
            dialogue_data: { goal: d.goal, domain: d.domain, turns: d.turns || [] },
          }))
        );
        setMessage({ type: 'success', text: `Loaded ${list.length} dialogues` });
      } else setMessage({ type: 'error', text: data.error || 'Failed to load dialogues' });
    } catch (e) {
      setMessage({ type: 'error', text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const createTasksFromVersionDialogues = async () => {
    if (!annotatorId) {
      setMessage({ type: 'error', text: 'Set Annotator ID first' });
      return;
    }
    if (versionDialogues.length === 0) {
      setMessage({ type: 'error', text: 'Load dialogues from a version first' });
      return;
    }
    setCreatingTasks(true);
    try {
      const res = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.humanEvalTasksBatch), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dialogues: versionDialogues, assigned_to: annotatorId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Created ${data.count || 0} tasks` });
        fetchTasks();
      } else setMessage({ type: 'error', text: data.error || 'Create tasks failed' });
    } catch (e) {
      setMessage({ type: 'error', text: (e as Error).message });
    } finally {
      setCreatingTasks(false);
    }
  };

  const exportEvaluations = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.humanEvalExport), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Exported to ${data.output_path || 'file'}` });
      } else setMessage({ type: 'error', text: data.error || 'Export failed' });
    } catch (e) {
      setMessage({ type: 'error', text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <ClipboardList className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">Human Evaluation</h3>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <User className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={annotatorId}
              onChange={(e) => setAnnotatorId(e.target.value)}
              placeholder="Annotator ID (saved in browser)"
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchVersions}
              disabled={loading}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 flex items-center gap-1"
            >
              <Database className="w-4 h-4" /> Load versions
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedVersionId}
            onChange={(e) => setSelectedVersionId(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
          >
            <option value="">Select version</option>
            {versions.map((v) => (
              <option key={v.version_id} value={v.version_id}>
                {v.version_id} {v.dialogue_count != null ? `(${v.dialogue_count})` : ''}
              </option>
            ))}
          </select>
          <button
            onClick={loadDialoguesForVersion}
            disabled={loading || !selectedVersionId}
            className="px-4 py-2 bg-cyan-500/30 text-cyan-100 rounded-lg hover:bg-cyan-500/50 disabled:opacity-50"
          >
            Load dialogues
          </button>
          <span className="text-sm text-gray-400">{versionDialogues.length} loaded</span>
          <button
            onClick={createTasksFromVersionDialogues}
            disabled={creatingTasks || versionDialogues.length === 0 || !annotatorId}
            className="flex items-center gap-1 px-4 py-2 bg-green-500/30 text-green-100 rounded-lg hover:bg-green-500/50 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Create tasks for me
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTasks}
            disabled={loading || !annotatorId}
            className="px-4 py-2 bg-cyan-500/30 text-cyan-100 rounded-lg hover:bg-cyan-500/50 disabled:opacity-50"
          >
            Load my tasks
          </button>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="px-4 py-2 bg-purple-500/30 text-purple-100 rounded-lg hover:bg-purple-500/50 disabled:opacity-50"
          >
            Statistics
          </button>
          <button
            onClick={exportEvaluations}
            disabled={loading}
            className="px-4 py-2 bg-green-500/30 text-green-100 rounded-lg hover:bg-green-500/50 disabled:opacity-50 flex items-center gap-1"
          >
            <FileDown className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {stats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-white/10 rounded-xl border border-white/20"
        >
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Overall statistics
          </h4>
          <pre className="text-xs text-gray-300 overflow-auto max-h-48">
            {JSON.stringify(stats, null, 2)}
          </pre>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-white/10 rounded-xl border border-white/20">
          <h4 className="text-white font-semibold mb-3">My tasks ({tasks.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tasks.length === 0 && !loading && (
              <p className="text-gray-400 text-sm">Create tasks from Versions (load dialogues, then create tasks for this annotator).</p>
            )}
            {tasks.map((t) => (
              <div
                key={t.task_id}
                className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all ${
                  selectedTaskId === t.task_id ? 'border-cyan-400 bg-cyan-500/20' : 'border-white/20 hover:bg-white/10'
                }`}
                onClick={() => fetchTaskDetail(t.task_id)}
              >
                <span className="text-white text-sm truncate flex-1">{t.dialogue_id}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${t.status === 'completed' ? 'bg-green-500/30' : 'bg-yellow-500/30'}`}>
                  {t.status}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white/10 rounded-xl border border-white/20">
          <h4 className="text-white font-semibold mb-3">Inter-annotator agreement</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            <input
              type="text"
              value={agreementDialogueId}
              onChange={(e) => setAgreementDialogueId(e.target.value)}
              placeholder="Dialogue ID"
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 w-40"
            />
            <select
              value={agreementDimension}
              onChange={(e) => setAgreementDimension(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
            >
              {DIMENSIONS.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
            <button
              onClick={fetchAgreement}
              disabled={loading}
              className="px-3 py-2 bg-cyan-500/30 text-cyan-100 rounded-lg text-sm hover:bg-cyan-500/50 disabled:opacity-50"
            >
              Compute
            </button>
          </div>
          {agreementResult && (
            <pre className="text-xs text-gray-300 mt-2 p-2 bg-black/20 rounded overflow-auto max-h-32">
              {JSON.stringify(agreementResult, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {taskDetail && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/10 rounded-xl border border-cyan-400/30"
        >
          <h4 className="text-white font-semibold mb-2">Dialogue</h4>
          <p className="text-gray-400 text-sm mb-2">Goal: {taskDetail.dialogue_data.goal || '—'}</p>
          <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
            {(taskDetail.dialogue_data.turns || []).map((turn, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-sm ${
                  turn.role === 'User' ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : 'bg-purple-500/10 border-l-2 border-purple-400'
                }`}
              >
                <span className="font-medium text-gray-300">{turn.role}:</span> {turn.text}
              </div>
            ))}
          </div>
          <h4 className="text-white font-semibold mb-3">Rate 1–5</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {DIMENSIONS.map((d) => (
              <div key={d.id}>
                <label className="block text-sm text-gray-300 mb-1">{d.label}</label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.5}
                  value={dimensions[d.id] ?? 3}
                  onChange={(e) => setDimensions((prev) => ({ ...prev, [d.id]: parseFloat(e.target.value) }))}
                  className="w-full accent-cyan-500"
                />
                <span className="text-xs text-white ml-1">{dimensions[d.id] ?? 3}</span>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Comments (optional)</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm"
              placeholder="Optional notes"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <input
              type="checkbox"
              checked={taskCompleted}
              onChange={(e) => setTaskCompleted(e.target.checked)}
            />
            Task completed by user in dialogue
          </label>
          <div className="flex gap-2">
            <button
              onClick={submitAnnotation}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/50 text-white rounded-lg hover:bg-green-500/70 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" /> Submit annotation
            </button>
            <button
              onClick={() => { setSelectedTaskId(null); setTaskDetail(null); }}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
