import React, { forwardRef, createContext, useContext, type ReactNode } from 'react';
import styles from '../css/stepper.module.scss';

// ============================================================
// EvoStepper
// ------------------------------------------------------------
// Research before building (CLAUDE.md §2):
//   - Mantine's `Stepper` uses a numeric `active` index and derives
//     each step's visual state (complete / current / upcoming) by
//     comparing its position to `active` — no per-step boolean
//     bookkeeping needed by the consumer. We copy that: `active` is
//     the single source of truth.
//   - Ark UI's `Steps` models each step as an explicit state machine
//     value (`complete` | `current` | `incomplete`) rather than a
//     boolean `done` flag, which is what makes an `error` state
//     expressible without a second prop. We copy that too, but let
//     `status` on `EvoStepper.Step` *override* the derived value —
//     the common case (95% of steps) needs zero config, the rare
//     case (a failed step) needs one prop.
//   - Radix has no Stepper primitive; we borrow its compose spirit
//     anyway (`EvoStepper` + `EvoStepper.Step`, Card-style) instead
//     of a `steps={[{...}]}` array, so a step's own JSX (rich
//     description, custom icon) is just JSX, not config.
//
// Distinctive decision (UX doc §1, 目标梯度/goal-gradient effect —
// "never let the user start at 0%"): the connector segment after a
// *completed* step fills solid in the success color and transitions
// smoothly when `active` advances. Progress already made is rendered
// as a visibly "banked" solid line, not just a numbered dot — so the
// remaining distance always reads as shorter than the distance
// already covered. That is the one deliberate visual flourish; every
// other affordance (markers, focus rings, spacing) stays quiet.
// ============================================================

export type EvoStepperOrientation = 'horizontal' | 'vertical';
export type EvoStepperSeverity = 'primary' | 'success' | 'info';
export type EvoStepperSize = 'sm' | 'md' | 'lg';
export type EvoStepperStepStatus = 'complete' | 'current' | 'upcoming' | 'error';

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(' ');
}

interface StepperContextValue {
  active: number;
  orientation: EvoStepperOrientation;
  severity: EvoStepperSeverity;
  size: EvoStepperSize;
  onStepClick?: (index: number) => void;
}

const StepperContext = createContext<StepperContextValue | null>(null);

function useStepperContext(component: string): StepperContextValue {
  const ctx = useContext(StepperContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <EvoStepper>.`);
  }
  return ctx;
}

// Injected by EvoStepper onto each EvoStepper.Step via cloneElement so a
// step always knows its own position — this is how the parent derives
// "complete / current / upcoming" without the consumer tracking indices
// by hand. Internal wiring only; not part of the public Step API.
interface StepPosition {
  __evoIndex?: number;
  __evoIsLast?: boolean;
}

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" width="0.9em" height="0.9em" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 16 16" width="0.9em" height="0.9em" fill="none" aria-hidden="true">
    <path d="M8 4.5v4.25M8 11.25h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ----- EvoStepper (root) -------------------------------------------------

export interface EvoStepperProps extends React.HTMLAttributes<HTMLOListElement> {
  /** 0-based index of the current step. Drives the derived status of every step. */
  active: number;
  /** @default 'horizontal' */
  orientation?: EvoStepperOrientation;
  /** Accent used for the current step's marker/ring and title. Complete and error steps keep their own fixed semantic colors regardless of this prop. @default 'primary' */
  severity?: EvoStepperSeverity;
  /** @default 'md' */
  size?: EvoStepperSize;
  /** Called with a step's index when its marker is activated (click, Enter, Space). Supplying this makes every step marker a real, focusable `<button>`; omit it to keep the stepper purely a display / progress indicator. */
  onStepClick?: (index: number) => void;
  /** One `<EvoStepper.Step>` per step. */
  children: ReactNode;
}

export const EvoStepperRoot = forwardRef<HTMLOListElement, EvoStepperProps>(
  function EvoStepper(
    {
      active,
      orientation = 'horizontal',
      severity = 'primary',
      size = 'md',
      onStepClick,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const steps = React.Children.toArray(children);
    const total = steps.length;
    const clampedActive = Math.min(Math.max(active, 0), Math.max(total - 1, 0));
    const activeChild = steps[clampedActive];
    const activeTitle =
      React.isValidElement(activeChild) && activeChild.props
        ? (activeChild.props as EvoStepperStepProps).title
        : undefined;
    const liveText =
      total > 0
        ? `Step ${clampedActive + 1} of ${total}${
            typeof activeTitle === 'string' ? `: ${activeTitle}` : ''
          }`
        : '';

    return (
      <StepperContext.Provider value={{ active: clampedActive, orientation, severity, size, onStepClick }}>
        {/* Announces progress on every `active` change; the <ol> itself already
            gives assistive tech per-item position ("1 of 5") for free. */}
        <span className={styles.srOnly} aria-live="polite">
          {liveText}
        </span>
        <ol
          ref={ref}
          className={cx(styles.root, styles[orientation], styles[`size-${size}`], className)}
          {...rest}
        >
          {steps.map((child, index) => {
            if (!React.isValidElement(child)) return child;
            return React.cloneElement(child as React.ReactElement<StepPosition>, {
              key: child.key ?? index,
              __evoIndex: index,
              __evoIsLast: index === total - 1,
            });
          })}
        </ol>
      </StepperContext.Provider>
    );
  },
);
EvoStepperRoot.displayName = 'EvoStepper';

// ----- EvoStepper.Step -----------------------------------------------------

export interface EvoStepperStepProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title'> {
  /** Step label. */
  title: ReactNode;
  /** Optional supporting copy shown under the title. */
  description?: ReactNode;
  /** Custom marker content. Defaults to the step number, or a checkmark / warning glyph for `complete` / `error`. */
  icon?: ReactNode;
  /** Override the status derived from the parent's `active` index (e.g. flag a failed step). Leave unset for the normal complete/current/upcoming progression. */
  status?: EvoStepperStepStatus;
}

export const EvoStepperStep = forwardRef<HTMLLIElement, EvoStepperStepProps & StepPosition>(
  function EvoStepperStep(
    { title, description, icon, status, className, __evoIndex, __evoIsLast, ...rest },
    ref,
  ) {
    const { active, severity, onStepClick } = useStepperContext('EvoStepper.Step');
    const index = __evoIndex ?? 0;
    const isLast = __evoIsLast ?? true;
    const computedStatus: EvoStepperStepStatus =
      status ?? (index < active ? 'complete' : index === active ? 'current' : 'upcoming');
    const isCurrent = computedStatus === 'current';
    const clickable = typeof onStepClick === 'function';
    // The connector drawn after this step banks the "already covered"
    // distance solid the moment this step itself is done.
    const connectorFilled = computedStatus === 'complete';

    let markerContent: ReactNode = icon;
    if (markerContent == null) {
      if (computedStatus === 'complete') markerContent = <CheckIcon />;
      else if (computedStatus === 'error') markerContent = <ErrorIcon />;
      else markerContent = index + 1;
    }

    const markerClasses = cx(
      styles.marker,
      styles[computedStatus],
      isCurrent && styles[`severity-${severity}`],
    );

    const titleText = typeof title === 'string' ? title : undefined;

    return (
      <li
        ref={ref}
        className={cx(styles.step, className)}
        aria-current={isCurrent ? 'step' : undefined}
        {...rest}
      >
        <span className={styles.indicator}>
          {clickable ? (
            <button
              type="button"
              className={markerClasses}
              onClick={() => onStepClick?.(index)}
              aria-label={titleText ? `Go to step ${index + 1}: ${titleText}` : `Go to step ${index + 1}`}
            >
              <span aria-hidden="true">{markerContent}</span>
            </button>
          ) : (
            <span className={markerClasses} aria-hidden="true">
              {markerContent}
            </span>
          )}
          {!isLast && (
            <span
              className={cx(styles.connector, connectorFilled && styles.connectorFilled)}
              aria-hidden="true"
            />
          )}
        </span>
        <span className={styles.content}>
          <span className={cx(styles.title, isCurrent && styles[`severity-${severity}`])}>
            {title}
          </span>
          {description && <span className={styles.description}>{description}</span>}
        </span>
      </li>
    );
  },
);
EvoStepperStep.displayName = 'EvoStepperStep';

// ----- Compound export -----

type EvoStepperComponent = typeof EvoStepperRoot & {
  Step: typeof EvoStepperStep;
};

export const EvoStepper = EvoStepperRoot as EvoStepperComponent;
EvoStepper.Step = EvoStepperStep;
