import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from '../css/tooltip.module.scss';
import { useAnchoredPosition, type AnchorSide } from '../hooks/useAnchoredPosition';

type TooltipPlacement = AnchorSide;

interface EvoTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  /** Preferred side; flips automatically when there is no room. Default 'top'. */
  placement?: TooltipPlacement;
  className?: string;
}

export const EvoTooltip = ({
  content,
  children,
  placement = 'top',
  className = '',
}: EvoTooltipProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);

  const { floatingRef, floatingStyles, arrowStyles, placement: side } = useAnchoredPosition({
    open,
    anchorRef,
    placement,
    offset: 8,
  });

  return (
    <span
      ref={anchorRef}
      className={`${styles.wrapper} ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <div
            ref={floatingRef}
            className={styles.tooltip}
            data-placement={side}
            style={floatingStyles}
            role="tooltip"
          >
            {content}
            <span className={styles.arrow} data-placement={side} style={arrowStyles} />
          </div>,
          document.body,
        )}
    </span>
  );
};
