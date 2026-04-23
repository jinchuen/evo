import React, { useState } from 'react';
import styles from '../css/tooltip.module.scss';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface EvoTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  className?: string;
}

export const EvoTooltip = ({
  content,
  children,
  placement = 'top',
  className = '',
}: EvoTooltipProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={`${styles.wrapper} ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className={`${styles.tooltip} ${styles[placement]}`} role="tooltip">
          {content}
          <span className={styles.arrow} />
        </span>
      )}
    </span>
  );
};
