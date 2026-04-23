import React, { createContext, useCallback, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from '../css/toast.module.scss';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within EvoToastProvider');
  return ctx;
};

const icons: Record<ToastType, string> = {
  success: '✓', error: '✕', warning: '⚠', info: 'ℹ',
};

const SingleToast = ({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) => {
  React.useEffect(() => {
    const t = setTimeout(() => onDismiss(item.id), item.duration ?? 4000);
    return () => clearTimeout(t);
  }, [item.id, item.duration, onDismiss]);

  return (
    <div className={`${styles.toast} ${styles[item.type]}`} role="alert" aria-live="assertive">
      <span className={styles.icon}>{icons[item.type]}</span>
      <span className={styles.message}>{item.message}</span>
      <button className={styles.dismissBtn} onClick={() => onDismiss(item.id)} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
};

export const EvoToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {ReactDOM.createPortal(
        <div className={styles.container}>
          {toasts.map((item) => (
            <SingleToast key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
