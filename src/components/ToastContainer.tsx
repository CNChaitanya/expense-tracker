import React from 'react';
import type { Toast } from '../hooks/useNotification';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastContainerProps {
  toasts: Toast[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] space-y-3 w-full max-w-sm pointer-events-none px-4">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`glass dark:glass-dark p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 pointer-events-auto border-l-4 ${
            toast.type === 'success' ? 'border-green-500' : 
            toast.type === 'error' ? 'border-red-500' : 'border-blue-500'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="text-green-500" size={20} />}
          {toast.type === 'error' && <AlertCircle className="text-red-500" size={20} />}
          {toast.type === 'info' && <Info className="text-blue-500" size={20} />}
          <span className="text-sm font-medium flex-1">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
