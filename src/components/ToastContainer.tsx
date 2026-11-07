import React from 'react';
import { useBot } from '../context/BotContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useBot();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-purple-500/40 bg-[#12141f] text-white';
        let icon = <Info className="w-4 h-4 text-purple-400 flex-shrink-0" />;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/40 bg-[#0d1713] text-emerald-100';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500/40 bg-[#1c0f13] text-rose-100';
          icon = <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 ${borderClass}`}
          >
            <div className="flex items-center gap-2.5 text-xs font-medium leading-snug">
              {icon}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
