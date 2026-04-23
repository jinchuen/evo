import React from 'react';
import styles from '../css/container.module.scss';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface EvoContainerProps {
  children: React.ReactNode;
  size?: ContainerSize;
  centered?: boolean;
  className?: string;
}

export const EvoContainer = ({
  children,
  size = 'lg',
  centered = true,
  className = '',
}: EvoContainerProps) => (
  <div
    className={[
      styles.container,
      styles[size],
      centered ? styles.centered : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </div>
);
