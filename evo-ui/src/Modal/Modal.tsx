import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '../css/modal.module.scss';

type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';

interface EvoModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  className?: string;
}

interface EvoModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
}

interface EvoModalBodyProps { children: React.ReactNode; }
interface EvoModalFooterProps { children: React.ReactNode; }

const EvoModalHeader = ({ children, onClose }: EvoModalHeaderProps) => (
  <div className={styles.header}>
    <div className={styles.headerContent}>{children}</div>
    {onClose && (
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
        ✕
      </button>
    )}
  </div>
);

const EvoModalBody = ({ children }: EvoModalBodyProps) => (
  <div className={styles.body}>{children}</div>
);

const EvoModalFooter = ({ children }: EvoModalFooterProps) => (
  <div className={styles.footer}>{children}</div>
);

export const EvoModal = ({ open, onClose, children, size = 'md', className = '' }: EvoModalProps) => {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={[styles.dialog, styles[size], className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

EvoModal.Header = EvoModalHeader;
EvoModal.Body = EvoModalBody;
EvoModal.Footer = EvoModalFooter;
