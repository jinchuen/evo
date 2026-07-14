import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { useEvoTheme } from './ThemeProvider';
import styles from '../css/theme-toggle.module.scss';

export interface EvoThemeToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'> {
  /** Visual size of the toggle. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label. @default 'Toggle color theme' */
  ariaLabel?: string;
  /** Extra className to merge with the built-in styles. */
  className?: string;
  /** Disables interaction and dims the control. @default false */
  disabled?: boolean;
}

/**
 * A drop-in button that flips between light and dark mode.
 *
 * Sits inside an `<EvoThemeProvider>`. The icon and animation
 * automatically reflect the resolved theme.
 *
 * @example
 * ```tsx
 * <EvoThemeProvider>
 *   <EvoThemeToggle />
 * </EvoThemeProvider>
 * ```
 */
export const EvoThemeToggle = forwardRef<HTMLButtonElement, EvoThemeToggleProps>(
  function EvoThemeToggle(
    { size = 'md', ariaLabel = 'Toggle color theme', className, disabled = false, onClick, ...rest },
    ref
  ) {
    const { resolvedTheme, toggleTheme } = useEvoTheme();
    const isDark = resolvedTheme === 'dark';

    const classes = [styles.toggle, styles[size], className].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            toggleTheme();
          }
        }}
        className={classes}
        data-theme-state={resolvedTheme}
        {...rest}
      >
        <span className={styles.track}>
          <span className={styles.thumb}>
            {/* Sun icon */}
            <svg
              className={styles.sun}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
            {/* Moon icon */}
            <svg
              className={styles.moon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </span>
        </span>
      </button>
    );
  }
);

EvoThemeToggle.displayName = 'EvoThemeToggle';
