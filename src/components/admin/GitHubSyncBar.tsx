import React, { useState, useEffect } from 'react';
import { UploadCloud, RefreshCw, Settings } from 'lucide-react';
import { githubSyncService, GitHubSyncSettings } from '../../services/githubSyncService';

interface GitHubSyncBarProps {
  resourceName: string;
  folderPath: string;
  isSyncing: boolean;
  onSync: () => void | Promise<void>;
  onOpenSettings: () => void;
}

export const GitHubSyncBar: React.FC<GitHubSyncBarProps> = ({
  resourceName,
  folderPath,
  isSyncing,
  onSync,
  onOpenSettings,
}) => {
  const [settings, setSettings] = useState<GitHubSyncSettings>(() =>
    githubSyncService.getSettings()
  );
  const [isConfigured, setIsConfigured] = useState<boolean>(() =>
    githubSyncService.isConfigured()
  );

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(githubSyncService.getSettings());
      setIsConfigured(githubSyncService.isConfigured());
    };

    window.addEventListener('hope_together_github_settings_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('hope_together_github_settings_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isConfigured
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : 'bg-amber-50 text-amber-600 border border-amber-100'
          }`}
        >
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-800">
              GitHub Cloud Deployment & Auto-Sync
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                isConfigured
                  ? 'bg-emerald-100/70 text-emerald-700'
                  : 'bg-amber-100/70 text-amber-700'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              {isConfigured ? 'Connected' : 'Token Required'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {isConfigured
              ? `Images auto-upload to ${folderPath} on repo: ${settings.owner}/${settings.repo} (${settings.branch})`
              : `Connect GitHub to automatically upload ${resourceName.toLowerCase()} images to ${folderPath} and deploy live via Cloudflare Pages.`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        {isConfigured && (
          <button
            type="button"
            onClick={onSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Deploying...' : `Sync ${resourceName} to GitHub`}</span>
          </button>
        )}
        <button
          type="button"
          onClick={onOpenSettings}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          <span>{isConfigured ? 'Sync Settings' : 'Connect GitHub'}</span>
        </button>
      </div>
    </div>
  );
};
