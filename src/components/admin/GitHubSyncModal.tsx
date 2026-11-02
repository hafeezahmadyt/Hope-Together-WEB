import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  X,
  ShieldCheck,
  AlertTriangle,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { githubSyncService, GitHubSyncSettings } from '../../services/githubSyncService';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [settings, setSettings] = useState<GitHubSyncSettings>(() =>
    githubSyncService.getSettings()
  );
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    user?: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(githubSyncService.getSettings());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      githubSyncService.saveSettings(settings);
      const res = await githubSyncService.testConnection();
      setTestResult(res);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    githubSyncService.saveSettings(settings);
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 text-slate-800 rounded-xl">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                GitHub Cloud Deployment Setup
              </h3>
              <p className="text-xs text-slate-400">
                Upload images & data straight to your GitHub repository.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Info Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1D70B8]" />
              Automatic Cloudflare Pages Redeployment
            </div>
            <p className="text-[11px] text-blue-800/90 leading-relaxed">
              When you upload a partner logo, team picture, or event cover, it commits directly to your GitHub repository (<code className="bg-white/70 px-1 py-0.5 rounded font-mono">public/assets/partners/</code>, <code className="bg-white/70 px-1 py-0.5 rounded font-mono">public/assets/events/</code>, or <code className="bg-white/70 px-1 py-0.5 rounded font-mono">public/assets/team/</code>). Cloudflare Pages automatically detects the commit and redeploys to all phones, PCs, and visitors in ~1 minute.
            </p>
          </div>

          {/* Token Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Key className="w-3.5 h-3.5" />
                GitHub Personal Access Token (PAT)
              </label>
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#1D70B8] hover:underline inline-flex items-center gap-1"
              >
                <span>Generate token on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={settings.token}
                onChange={(e) => setSettings({ ...settings, token: e.target.value })}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#1D70B8]"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Required scope: <code className="font-mono text-slate-600 bg-slate-100 px-1 rounded">repo</code> (Full control of repositories). Stored securely in your admin browser.
            </p>
          </div>

          {/* Repo Owner & Repo Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Repository Owner
              </label>
              <input
                type="text"
                value={settings.owner}
                onChange={(e) => setSettings({ ...settings, owner: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/40"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Repository Name
              </label>
              <input
                type="text"
                value={settings.repo}
                onChange={(e) => setSettings({ ...settings, repo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/40"
              />
            </div>
          </div>

          {/* Branch & Auto-sync */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Target Branch
              </label>
              <input
                type="text"
                value={settings.branch}
                onChange={(e) => setSettings({ ...settings, branch: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/40"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={settings.autoSync}
                  onChange={(e) => setSettings({ ...settings, autoSync: e.target.checked })}
                  className="rounded text-[#1D70B8] focus:ring-[#1D70B8] w-4 h-4 cursor-pointer"
                />
                <span>Auto-upload on Save</span>
              </label>
            </div>
          </div>

          {/* Connection Test Result */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {testResult.success ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              <span>
                {testResult.success
                  ? `Verified successfully! Connected as @${testResult.user} with write access to ${settings.owner}/${settings.repo}.`
                  : testResult.error}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting || !settings.token}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-xs cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
