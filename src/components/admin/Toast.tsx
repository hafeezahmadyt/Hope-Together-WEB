import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toast?: ToastMessage | null;
  message?: ToastMessage | null;
  onDismiss?: () => void;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, message, onDismiss, onClose }) => {
  const activeToast = toast || message || null;
  const handleDismiss = onDismiss || onClose || (() => {});

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      handleDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [activeToast, handleDismiss]);

  if (!activeToast) return null;

  const isSuccess = activeToast.type === 'success';
  const isError = activeToast.type === 'error';

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-slate-200/90 shadow-xl animate-in slide-in-from-bottom-3 duration-200 max-w-sm"
      role="status"
    >
      {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
      {isError && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
      {!isSuccess && !isError && <Info className="w-5 h-5 text-[#1D70B8] flex-shrink-0" />}

      <p className="text-xs sm:text-sm text-slate-800 font-medium flex-1">
        {activeToast.text}
      </p>

      <button
        type="button"
        onClick={handleDismiss}
        className="text-slate-400 hover:text-slate-600 p-1"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
