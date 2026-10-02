import React from 'react';
import { LucideIcon, Plus, FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = FolderOpen,
  action,
  actionLabel,
  onAction,
}) => {
  const finalActionLabel = action?.label || actionLabel;
  const finalActionClick = action?.onClick || onAction;

  return (
    <div className="py-16 px-6 text-center rounded-2xl bg-white border border-dashed border-slate-200/80 my-4 flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-base sm:text-lg font-medium text-slate-800 mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 font-light max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {finalActionLabel && finalActionClick && (
        <button
          type="button"
          onClick={finalActionClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-medium hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{finalActionLabel}</span>
        </button>
      )}
    </div>
  );
};
