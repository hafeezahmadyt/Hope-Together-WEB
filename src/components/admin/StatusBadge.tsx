import React from 'react';
import { ContentStatus, MessageStatus } from '../../types/admin';

interface StatusBadgeProps {
  status: ContentStatus | MessageStatus | boolean | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  let label = String(status);
  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';

  if (typeof status === 'boolean') {
    label = status ? 'Active' : 'Inactive';
    bgClass = status
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
      : 'bg-slate-100 text-slate-500 border-slate-200';
  } else {
    switch (status) {
      case 'Published':
      case 'Active':
        bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
        break;
      case 'Draft':
        bgClass = 'bg-amber-50 text-amber-700 border-amber-200/60';
        break;
      case 'Completed':
        bgClass = 'bg-blue-50 text-[#1D70B8] border-blue-200/60';
        break;
      case 'Archived':
      case 'Inactive':
        bgClass = 'bg-slate-100 text-slate-600 border-slate-200';
        break;
      case 'Unread':
        bgClass = 'bg-sky-50 text-sky-700 border-sky-200/70 font-semibold';
        break;
      case 'Read':
        bgClass = 'bg-slate-50 text-slate-500 border-slate-200';
        break;
    }
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses} ${bgClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
};
