'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, GitCompare, Tag, FileDown, ChevronDown } from 'lucide-react';
import { API_CONFIG } from '@/lib/api-config';

interface VersionRecord {
  version_id: string;
  timestamp?: string;
  description?: string;
  dialogue_count?: number;
  domain_distribution?: Record<string, number>;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export default function Versions() {
  const [versions, setVersions] = useState<VersionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');
  const [compareResult, setCompareResult] = useState<Record<string, unknown> | null>(null);
  const [tagVersionId, setTagVersionId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [exportVersionId, setExportVersionId] = useState('');
  const [exportFormat, setExportFormat] = useState('json');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dialoguesPreview, setDialoguesPreview] = useState<unknown[]>([]);

  const fetchVersions = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.versions));
      const data = await res.json();
      if (res.ok) {
        setVersions(data.versions || data || []);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to load versions' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const runCompare = async () => {
    if (!compareA || !compareB) {
      setMessage({ type: 'error', text: 'Select both versions to compare' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.versionCompare), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version_1: compareA, version_2: compareB }),
      });
      const data = await res.json();
      if (res.ok) {
        setCompareResult(data);
      } else {
        setMessage({ type: 'error', text: data.error || 'Compare failed' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const addTag = async () => {
    if (!tagVersionId || !tagInput.trim()) {
      setMessage({ type: 'error', text: 'Select version and enter tag' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.versionTag(tagVersionId)), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: [tagInput.trim()] }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Tag added' });
        setTagInput('');
        fetchVersions();
      } else {
        setMessage({ type: 'error', text: data.error || 'Tag failed' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const runExport = async () => {
    if (!exportVersionId) {
      setMessage({ type: 'error', text: 'Select a version to export' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.versionExport(exportVersionId)), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: exportFormat }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message || `Exported to ${data.output_path || 'file'}` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Export failed' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const loadDialoguesPreview = async (versionId: string) => {
    try {
      const res = await fetch(API_CONFIG.getUrl(API_CONFIG.endpoints.versionDialogues(versionId)) + '?limit=5');
      const data = await res.json();
      if (res.ok) setDialoguesPreview(data.dialogues || []);
    } catch {
      setDialoguesPreview([]);
    }
  };

  const toggleExpand = (versionId: string) => {
    if (expandedId === versionId) {
      setExpandedId(null);
      setDialoguesPreview([]);
    } else {
      setExpandedId(versionId);
      loadDialoguesPreview(versionId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">Dataset Versions</h3>
        <button
          onClick={fetchVersions}
          disabled={loading}
          className="ml-auto px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50"
        >
          Refresh
        </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-white/10 rounded-xl border border-white/20">
          <h4 className="text-white font-semibold mb-3">List</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading && versions.length === 0 && <p className="text-gray-400">Loading...</p>}
            {!loading && versions.length === 0 && (
              <p className="text-gray-400 text-sm">No versions yet. Run the pipeline to create a version.</p>
            )}
            {versions.map((v) => (
              <div
                key={v.version_id}
                className="p-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpand(v.version_id)}
                >
                  <div>
                    <span className="text-white font-medium">{v.version_id}</span>
                    <span className="text-gray-400 text-sm ml-2">({v.dialogue_count ?? 0} dialogues)</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === v.version_id ? 'rotate-180' : ''}`}
                  />
                </div>
                {v.tags && v.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {v.tags.map((t) => (
                      <span key={t} className="text-xs bg-cyan-500/30 text-cyan-100 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {expandedId === v.version_id && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-gray-400 mb-2">Preview (first 5 dialogues):</p>
                    <pre className="text-xs text-gray-300 overflow-auto max-h-40 bg-black/20 p-2 rounded">
                      {JSON.stringify(dialoguesPreview, null, 1)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <GitCompare className="w-5 h-5" /> Compare
            </h4>
            <div className="flex flex-wrap gap-2 mb-2">
              <select
                value={compareA}
                onChange={(e) => setCompareA(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              >
                <option value="">Version A</option>
                {versions.map((v) => (
                  <option key={v.version_id} value={v.version_id}>{v.version_id}</option>
                ))}
              </select>
              <select
                value={compareB}
                onChange={(e) => setCompareB(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              >
                <option value="">Version B</option>
                {versions.map((v) => (
                  <option key={v.version_id} value={v.version_id}>{v.version_id}</option>
                ))}
              </select>
              <button
                onClick={runCompare}
                disabled={loading || !compareA || !compareB}
                className="px-4 py-2 bg-cyan-500/30 text-cyan-100 rounded-lg hover:bg-cyan-500/50 disabled:opacity-50"
              >
                Compare
              </button>
            </div>
            {compareResult && (
              <pre className="text-xs text-gray-300 mt-2 p-2 bg-black/20 rounded overflow-auto max-h-48">
                {JSON.stringify(compareResult, null, 2)}
              </pre>
            )}
          </div>

          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5" /> Tag
            </h4>
            <div className="flex flex-wrap gap-2 mb-2">
              <select
                value={tagVersionId}
                onChange={(e) => setTagVersionId(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              >
                <option value="">Select version</option>
                {versions.map((v) => (
                  <option key={v.version_id} value={v.version_id}>{v.version_id}</option>
                ))}
              </select>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. baseline"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 w-32"
              />
              <button
                onClick={addTag}
                disabled={loading || !tagVersionId || !tagInput.trim()}
                className="px-4 py-2 bg-purple-500/30 text-purple-100 rounded-lg hover:bg-purple-500/50 disabled:opacity-50"
              >
                Add tag
              </button>
            </div>
          </div>

          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <FileDown className="w-5 h-5" /> Export
            </h4>
            <div className="flex flex-wrap gap-2">
              <select
                value={exportVersionId}
                onChange={(e) => setExportVersionId(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              >
                <option value="">Select version</option>
                {versions.map((v) => (
                  <option key={v.version_id} value={v.version_id}>{v.version_id}</option>
                ))}
              </select>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              >
                <option value="json">JSON</option>
                <option value="jsonl">JSONL</option>
                <option value="hf">HuggingFace</option>
                <option value="rasa">Rasa</option>
              </select>
              <button
                onClick={runExport}
                disabled={loading || !exportVersionId}
                className="px-4 py-2 bg-green-500/30 text-green-100 rounded-lg hover:bg-green-500/50 disabled:opacity-50"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
