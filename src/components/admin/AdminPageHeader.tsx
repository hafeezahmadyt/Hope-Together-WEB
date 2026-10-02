import React from 'react';
import { LucideIcon, Plus } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  action?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  action,
}) => {
  const PrimaryIcon = primaryAction?.icon || Plus;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-500 font-light mt-1">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        {action}

        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors shadow-xs"
          >
            {secondaryAction.label}
          </button>
        )}

        {primaryAction && (
          <button
            type="button"
            onClick={primaryAction.onClick}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-medium hover:bg-slate-800 transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            <PrimaryIcon className="w-4 h-4" />
            <span>{primaryAction.label}</span>
          </button>
        )}
      </div>
    </div>
  );
};
