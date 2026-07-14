import { forwardRef, type HTMLAttributes } from 'react';
import styles from '../css/container.module.scss';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Configuration properties for the EvoContainer component.
 *
 * Extends every native `<div>` attribute (id, style, data-*, aria-*, role,
 * onClick, …) so consumers don't have to ask for them one by one.
 */
export interface EvoContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width breakpoint the container caps at.
   * @default 'lg'
   */
  size?: ContainerSize;

  /** Center the container horizontally within its parent. @default true */
  centered?: boolean;
}

export const EvoContainer = forwardRef<HTMLDivElement, EvoContainerProps>(
  function EvoContainer({ children, size = 'lg', centered = true, className, ...rest }, ref) {
    const classes = [styles.container, styles[size], centered ? styles.centered : '', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  },
);

EvoContainer.displayName = 'EvoContainer';
