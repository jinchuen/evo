import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import styles from '../css/button.module.scss';

type Variant = 'solid' | 'outline' | 'ghost' | 'soft';
type Severity = 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info';
type Size = 'sm' | 'md' | 'lg';
type Shape = 'default' | 'rounded' | 'square';

/**
 * Configuration properties for the EvoButton component.
 *
 * Extends every native `<button>` attribute (type, form, name, autoFocus,
 * aria-*, onMouseEnter, …) so consumers don't have to ask for them one by one.
 */
export interface EvoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Text shown inside the button. Convenience shorthand for `children`. */
  label?: string;

  /**
   * Visual style of the button.
   * - `solid`   — filled background (default).
   * - `outline` — bordered, transparent background.
   * - `ghost`   — no border or background until hover.
   * - `soft`    — tinted background using the severity's soft token.
   * @default 'solid'
   */
  variant?: Variant;

  /**
   * Semantic color theme.
   * @default 'primary'
   */
  severity?: Severity;

  /** @default 'md' */
  size?: Size;

  /**
   * Border-radius shape, orthogonal to `variant`.
   * - `default` — normal radius.
   * - `rounded` — pill / fully rounded edges.
   * - `square`  — equal width/height; use for icon-only buttons.
   * @default 'default'
   */
  shape?: Shape;

  /** Icon rendered before the label. */
  iconLeft?: ReactNode;

  /** Icon rendered after the label. */
  iconRight?: ReactNode;

  /**
   * When true, replaces icons with a spinner and disables interaction.
   * `aria-busy` is set automatically.
   */
  loading?: boolean;

  /** Optional text shown next to the spinner while `loading` is true. */
  loadingText?: string;

  /** Stretch to fill the parent's width. */
  fullWidth?: boolean;
}

export const EvoButton = forwardRef<HTMLButtonElement, EvoButtonProps>(function EvoButton(
  {
    label,
    children,
    variant = 'solid',
    severity = 'primary',
    size = 'md',
    shape = 'default',
    iconLeft,
    iconRight,
    loading = false,
    loadingText,
    fullWidth = false,
    disabled,
    type = 'button',
    className,
    ...rest
  },
  ref,
) {
  const content = children ?? label;
  const visibleContent = loading ? loadingText : content;
  const isDisabled = disabled || loading;

  const classes = [
    styles.button,
    styles[variant],
    styles[severity],
    styles[size],
    shape !== 'default' ? styles[shape] : '',
    fullWidth ? styles.fullWidth : '',
    !visibleContent ? styles.iconOnly : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        iconLeft && <span className={styles.icon}>{iconLeft}</span>
      )}

      {visibleContent != null && visibleContent !== '' && (
        <span className={styles.label}>{visibleContent}</span>
      )}

      {!loading && iconRight && <span className={styles.icon}>{iconRight}</span>}
    </button>
  );
});
