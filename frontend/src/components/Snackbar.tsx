import { useEffect, useState } from 'react';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarProps {
  message: string;
  type?: SnackbarType;
  duration?: number;
  onClose?: () => void;
  isOpen: boolean;
  title?: string;
}

const typeStyles = {
  success: 'bg-green-50 border-green-500 text-green-800',
  error: 'bg-red-50 border-red-500 text-red-800',
  info: 'bg-blue-50 border-blue-500 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-800'
};

const defaultTitles = {
  success: '成功',
  error: 'エラー',
  info: 'お知らせ',
  warning: '警告'
};

export function Snackbar({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose, 
  isOpen,
  title 
}: SnackbarProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const displayTitle = title || defaultTitles[type];

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => {
          onClose?.();
        }, 500);
      }, duration - 500);
      return () => clearTimeout(timer);
    }
    return;
  }, [duration, onClose, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={
        'pointer-events-auto max-w-sm rounded-lg border shadow-lg relative ' +
        (isLeaving ? 'animate-fade-out' : 'animate-slide-in-right') + ' ' +
        typeStyles[type]
      }
    >
      <button
        onClick={onClose}
        className={
          'absolute top-1.5 right-1.5 rounded-md p-1 hover:bg-opacity-20 ' +
          'focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
          (type === 'success' ? 'hover:bg-green-200 focus:ring-green-500 ' : '') +
          (type === 'error' ? 'hover:bg-red-200 focus:ring-red-500 ' : '') +
          (type === 'info' ? 'hover:bg-blue-200 focus:ring-blue-500 ' : '') +
          (type === 'warning' ? 'hover:bg-yellow-200 focus:ring-yellow-500 ' : '')
        }
      >
        {/* Xアイコンはプロジェクトに合わせて差し替えてください */}
        <span className="w-3.5 h-3.5">×</span>
      </button>
      <div>
        <div className="text-xs font-semibold px-3 pt-2">{displayTitle}</div>
        <div className="text-sm font-medium px-4 pb-3 pt-1">{message}</div>
      </div>
    </div>
  );
}