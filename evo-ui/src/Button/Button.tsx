import styles from '../css/button.module.scss';

type Variant = 'solid' | 'outline' | 'ghost' | 'rounded';
type Severity = 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info';
type Size = 'sm' | 'md' | 'lg';

/**
 * Configuration properties for the EvoButton component.
 */
interface EvoButtonProps {
  /** * The text content to display inside the button.
   */
  label: string;

  /** * The visual style of the button.
   * - `solid`: Full background color (default).
   * - `outline`: Border only with transparent background.
   * - `ghost`: No background or border, only text.
   * - `rounded`: Fully circular edges.
   * @default 'solid'
   */
  variant?: Variant;

  /** * The contextual color theme of the button.
   * - `primary`: Main brand color.
   * - `secondary`: Alternative accent color.
   * - `success`: Positive actions (Green).
   * - `info`: Informational actions (Blue).
   * - `warning`: Cautionary actions (Orange).
   * - `danger`: Destructive or error actions (Red).
   * @default 'primary'
   */
  severity?: Severity;

  /** * The relative size of the button component.
   * - `sm`: Small (compact).
   * - `md`: Medium (standard).
   * - `lg`: Large (prominent).
   * @default 'md'
   */
  size?: Size;

  /** * If true, prevents user interaction and applies disabled styling.
   * @default false
   */
  disabled?: boolean;

  /** * Callback function triggered when the button is clicked.
   * @example () => alert('Action confirmed')
   */
  onClick?: () => void;
}

export const EvoButton = ({
  label,
  variant = 'solid',
  severity = 'primary',
  size = 'md',
  disabled,
  onClick,
}: EvoButtonProps) => {
  const classes = [
    styles.button,
    styles[variant],
    styles[severity],
    size !== 'md' ? styles[size] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
};