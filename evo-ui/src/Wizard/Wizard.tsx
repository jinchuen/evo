import React, {
  forwardRef,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import styles from '../css/wizard.module.scss';
import {
  EvoStepper,
  type EvoStepperOrientation,
  type EvoStepperSeverity,
  type EvoStepperSize,
} from '../Stepper/Stepper';
import { EvoButton } from '../Button/Button';

// ============================================================
// EvoWizard
// ------------------------------------------------------------
// Research before building (CLAUDE.md §2):
//  - Mantine's `Stepper` mixes the progress display and the step
//    content into one component via a `content` prop per child.
//    We deliberately keep them separate: EvoStepper stays a pure,
//    presentational progress primitive (already shipped) and
//    EvoWizard is a *different* component that composes it — a
//    wizard CONTAINS forms and orchestrates state; EvoForm itself
//    has no notion of steps. Fundamentally different semantics,
//    not one config knob on an existing component.
//  - Ark UI's Steps machine treats "can I leave this step" as a
//    guard the consumer supplies per step, not something the
//    machine derives by inspecting form validity itself. We copy
//    that shape: `EvoWizard.Step` takes `canAdvance` (default
//    `true`) — the wizard orchestrates flow, it does not know or
//    care what is inside a step (an EvoForm, a plain div, anything).
//  - shadcn/Radix ship no wizard primitive; most hand-rolled
//    versions store the step index in the page and separately
//    re-derive stepper markers + panel visibility + button state,
//    which drifts out of sync. EvoWizard centralizes all three off
//    a single `activeIndex`, controlled or uncontrolled per Evo's
//    naming rules (`activeStep` / `defaultStep` / `onStepChange`).
//
// Distinctive decision (UX doc §1, 宜家效应 / IKEA effect — people
// value what they built with their own hands far more than what
// they were handed): `EvoWizard.Review` is not an inert dump of
// values. Its `Review.Item` rows tie each answer back to the step
// it came from with a quiet "Edit" affordance that jumps straight
// to that step — so the payoff screen reads as "here is what YOU
// assembled," and stays literally editable at the exact moment the
// user feels proudest of it, instead of a slab of take-it-or-
// leave-it static text. Everything else (spacing, transitions,
// button treatment) stays quiet.
// ============================================================

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(' ');
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), Math.max(max, min));
}

interface StepMeta {
  id: string;
  title: ReactNode;
}

interface WizardContextValue {
  activeIndex: number;
  steps: StepMeta[];
  linear: boolean;
  canAdvance: boolean;
  isFirst: boolean;
  isFinalAction: boolean;
  hasReview: boolean;
  onReviewStep: boolean;
  goTo: (index: number) => void;
  next: () => void;
  back: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

function useWizardContext(component: string): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <EvoWizard>.`);
  }
  return ctx;
}

// Injected by EvoWizard onto each EvoWizard.Step via cloneElement, mirroring
// how EvoStepper.Step learns its own position — internal wiring only, not
// part of the public Step API.
interface StepPosition {
  __evoIndex?: number;
}

// ----- EvoWizard.Step -----------------------------------------------------

export interface EvoWizardStepProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Stable identifier for this step. Used by `EvoWizard.Review.Item`'s `step` prop to jump back here. Defaults to the step's 0-based position when omitted. */
  id?: string;
  /** Step label, shown in `EvoWizard.Progress`. */
  title: ReactNode;
  /** Gate on advancing past this step (the Next/Finish button in `EvoWizard.Actions` is disabled while this is `false`). Typically wired to a form's validity. @default true */
  canAdvance?: boolean;
  /** The step's content — typically an `EvoForm`, but any content is valid. */
  children: ReactNode;
}

export const EvoWizardStep = forwardRef<HTMLDivElement, EvoWizardStepProps & StepPosition>(
  function EvoWizardStep(
    { id, title, canAdvance = true, className, children, __evoIndex, ...rest },
    ref,
  ) {
    void canAdvance; // read by EvoWizard's own scan of this element's props, not used in render
    const { activeIndex } = useWizardContext('EvoWizard.Step');
    const index = __evoIndex ?? 0;
    if (activeIndex !== index) return null;

    const titleText = typeof title === 'string' ? title : undefined;

    return (
      <div
        ref={ref}
        className={cx(styles.step, className)}
        role="group"
        aria-label={titleText}
        data-wizard-step={id ?? index}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
EvoWizardStep.displayName = 'EvoWizardStep';

// ----- EvoWizard.Progress --------------------------------------------------

export interface EvoWizardProgressProps
  extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  /** @default 'horizontal' */
  orientation?: EvoStepperOrientation;
  /** Accent for the current step's marker/title, forwarded to the underlying `EvoStepper`. @default 'primary' */
  severity?: EvoStepperSeverity;
  /** @default 'md' */
  size?: EvoStepperSize;
}

export const EvoWizardProgress = forwardRef<HTMLOListElement, EvoWizardProgressProps>(
  function EvoWizardProgress(
    { orientation = 'horizontal', severity = 'primary', size = 'md', className, ...rest },
    ref,
  ) {
    const { steps, activeIndex, linear, goTo } = useWizardContext('EvoWizard.Progress');

    return (
      <EvoStepper
        ref={ref}
        active={activeIndex}
        orientation={orientation}
        severity={severity}
        size={size}
        // Gated (linear) flows can't express "this marker is not reachable
        // yet" through EvoStepper's per-step API, so Progress stays a pure
        // display in that mode — exactly EvoStepper's own documented
        // "omit onStepClick to keep it display-only" behavior. Free (non-
        // linear) flows get full click-to-jump navigation.
        onStepClick={linear ? undefined : goTo}
        className={cx(styles.progress, className)}
        {...rest}
      >
        {steps.map((s) => (
          <EvoStepper.Step key={s.id} title={s.title} />
        ))}
      </EvoStepper>
    );
  },
);
EvoWizardProgress.displayName = 'EvoWizardProgress';

// ----- EvoWizard.Review / EvoWizard.Review.Item ----------------------------

export interface EvoWizardReviewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Heading shown above the review rows. */
  title?: ReactNode;
  /** One or more `EvoWizard.Review.Item` rows (or any custom content). */
  children: ReactNode;
}

const EvoWizardReviewRoot = forwardRef<HTMLDivElement, EvoWizardReviewProps>(
  function EvoWizardReview({ title, className, children, ...rest }, ref) {
    const { onReviewStep } = useWizardContext('EvoWizard.Review');
    if (!onReviewStep) return null;

    const titleText = typeof title === 'string' ? title : 'Review';

    return (
      <div
        ref={ref}
        className={cx(styles.review, className)}
        role="group"
        aria-label={titleText}
        {...rest}
      >
        {title && <div className={styles.reviewTitle}>{title}</div>}
        <div className={styles.reviewList}>{children}</div>
      </div>
    );
  },
);
EvoWizardReviewRoot.displayName = 'EvoWizardReview';

export interface EvoWizardReviewItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Row label (e.g. the field or step name this value came from). */
  label: ReactNode;
  /** The step this value belongs to — either its `EvoWizard.Step` `id` or 0-based index. When set, an "Edit" affordance jumps straight back to that step. Omit for a plain, non-editable row. */
  step?: string | number;
  /** Text for the edit affordance. @default 'Edit' */
  editLabel?: string;
  /** The value to display. */
  children: ReactNode;
}

const EvoWizardReviewItem = forwardRef<HTMLDivElement, EvoWizardReviewItemProps>(
  function EvoWizardReviewItem(
    { label, step, editLabel = 'Edit', className, children, ...rest },
    ref,
  ) {
    const { steps, goTo } = useWizardContext('EvoWizard.Review.Item');
    const labelText = typeof label === 'string' ? label : undefined;

    const handleEdit = () => {
      if (step == null) return;
      const index = typeof step === 'number' ? step : steps.findIndex((s) => s.id === step);
      if (index >= 0) goTo(index);
    };

    return (
      <div ref={ref} className={cx(styles.reviewItem, className)} {...rest}>
        <div className={styles.reviewItemBody}>
          <span className={styles.reviewItemLabel}>{label}</span>
          <div className={styles.reviewItemValue}>{children}</div>
        </div>
        {step != null && (
          <button
            type="button"
            className={styles.reviewItemEdit}
            onClick={handleEdit}
            aria-label={labelText ? `Edit ${labelText}` : editLabel}
          >
            {editLabel}
          </button>
        )}
      </div>
    );
  },
);
EvoWizardReviewItem.displayName = 'EvoWizardReviewItem';

type EvoWizardReviewComponent = typeof EvoWizardReviewRoot & {
  Item: typeof EvoWizardReviewItem;
};

export const EvoWizardReview = EvoWizardReviewRoot as EvoWizardReviewComponent;
EvoWizardReview.Item = EvoWizardReviewItem;

// ----- EvoWizard.Actions ---------------------------------------------------

export interface EvoWizardActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** @default 'Back' */
  backLabel?: string;
  /** @default 'Next' */
  nextLabel?: string;
  /** Label used on the final action (last step with no Review, or the Review step itself). @default 'Finish' */
  finishLabel?: string;
}

export const EvoWizardActions = forwardRef<HTMLDivElement, EvoWizardActionsProps>(
  function EvoWizardActions(
    { backLabel = 'Back', nextLabel = 'Next', finishLabel = 'Finish', className, ...rest },
    ref,
  ) {
    const { isFirst, isFinalAction, canAdvance, back, next } = useWizardContext(
      'EvoWizard.Actions',
    );

    return (
      <div ref={ref} className={cx(styles.actions, className)} {...rest}>
        <EvoButton
          type="button"
          variant="ghost"
          severity="secondary"
          label={backLabel}
          onClick={back}
          disabled={isFirst}
        />
        <EvoButton
          type="button"
          variant="solid"
          severity={isFinalAction ? 'success' : 'primary'}
          label={isFinalAction ? finishLabel : nextLabel}
          onClick={next}
          disabled={!canAdvance}
        />
      </div>
    );
  },
);
EvoWizardActions.displayName = 'EvoWizardActions';

// ----- EvoWizard (root) -----------------------------------------------------

export interface EvoWizardProps extends HTMLAttributes<HTMLDivElement> {
  /** Controlled 0-based active step index. Pair with `onStepChange`. Set once; `defaultStep` is ignored while this is provided. */
  activeStep?: number;
  /** Initial active step index for uncontrolled use. @default 0 */
  defaultStep?: number;
  /** Called with the new 0-based index whenever the active step changes (Next, Back, a Progress click, or a Review "Edit" jump). */
  onStepChange?: (index: number) => void;
  /** Called when the user completes the final action — Finish on the last step (no Review present) or Finish on the Review step. */
  onComplete?: () => void;
  /**
   * When `true` (default), `EvoWizard.Progress` stays a pure, non-clickable
   * display and the only way forward is the gated Next/Finish button in
   * `EvoWizard.Actions` — matches the "gated advancement" flow most wizards
   * want. When `false`, every step marker in `EvoWizard.Progress` becomes
   * clickable for free navigation in either direction.
   * @default true
   */
  linear?: boolean;
  /** `EvoWizard.Progress`, one or more `EvoWizard.Step`, an optional `EvoWizard.Review`, and `EvoWizard.Actions`. */
  children: ReactNode;
}

export const EvoWizardRoot = forwardRef<HTMLDivElement, EvoWizardProps>(function EvoWizard(
  {
    activeStep,
    defaultStep = 0,
    onStepChange,
    onComplete,
    linear = true,
    className,
    children,
    ...rest
  },
  ref,
) {
  const childArray = React.Children.toArray(children);

  const stepElements = childArray.filter(
    (child): child is React.ReactElement<EvoWizardStepProps> =>
      React.isValidElement(child) && child.type === EvoWizardStep,
  );
  const hasReview = childArray.some(
    (child) => React.isValidElement(child) && child.type === EvoWizardReview,
  );

  const steps: StepMeta[] = stepElements.map((el, i) => ({
    id: el.props.id ?? String(i),
    title: el.props.title,
  }));
  const totalSteps = steps.length;
  const reviewIndex = totalSteps;
  const maxIndex = hasReview ? reviewIndex : Math.max(totalSteps - 1, 0);

  const [uncontrolledIndex, setUncontrolledIndex] = useState(() =>
    clamp(defaultStep, 0, maxIndex),
  );
  const isControlled = activeStep !== undefined;
  const activeIndex = clamp(isControlled ? activeStep! : uncontrolledIndex, 0, maxIndex);

  // Tracks the furthest index ever reached so `linear` gating can allow
  // revisiting any already-reached step (Back, or a Review "Edit" jump)
  // without allowing a skip-ahead into territory not yet earned.
  const [maxReached, setMaxReached] = useState(activeIndex);
  useEffect(() => {
    setMaxReached((m) => Math.max(m, activeIndex));
  }, [activeIndex]);

  const setIndex = useCallback(
    (next: number) => {
      const clamped = clamp(next, 0, maxIndex);
      if (!isControlled) setUncontrolledIndex(clamped);
      onStepChange?.(clamped);
    },
    [isControlled, maxIndex, onStepChange],
  );

  const goTo = useCallback(
    (index: number) => {
      const clamped = clamp(index, 0, maxIndex);
      if (clamped === activeIndex) return;
      if (linear && clamped > maxReached) return;
      setIndex(clamped);
    },
    [linear, maxReached, maxIndex, activeIndex, setIndex],
  );

  const onReviewStep = hasReview && activeIndex === reviewIndex;
  // True on the last *content* step regardless of whether a Review follows —
  // used below to decide whether Next should hand off to Review or call
  // onComplete directly. `isFinalAction` (what Actions renders as "Finish")
  // is the narrower case: the last content step only counts as the final
  // action when there is no Review step waiting after it.
  const isLastContentStep = activeIndex === totalSteps - 1;
  const isFinalAction = onReviewStep || (isLastContentStep && !hasReview);

  const currentStepCanAdvance =
    activeIndex < totalSteps ? stepElements[activeIndex]?.props.canAdvance ?? true : true;
  const canAdvance = onReviewStep ? true : currentStepCanAdvance;

  const next = useCallback(() => {
    if (!canAdvance) return;
    if (onReviewStep) {
      onComplete?.();
      return;
    }
    if (isLastContentStep) {
      if (hasReview) {
        setIndex(reviewIndex);
      } else {
        onComplete?.();
      }
      return;
    }
    setIndex(activeIndex + 1);
  }, [canAdvance, onReviewStep, isLastContentStep, hasReview, reviewIndex, activeIndex, setIndex, onComplete]);

  const back = useCallback(() => {
    if (activeIndex === 0) return;
    setIndex(activeIndex - 1);
  }, [activeIndex, setIndex]);

  const contextValue: WizardContextValue = {
    activeIndex,
    steps,
    linear,
    canAdvance,
    isFirst: activeIndex === 0,
    isFinalAction,
    hasReview,
    onReviewStep,
    goTo,
    next,
    back,
  };

  const renderedChildren = childArray.map((child, i) => {
    if (React.isValidElement(child) && child.type === EvoWizardStep) {
      const index = stepElements.indexOf(child as React.ReactElement<EvoWizardStepProps>);
      return React.cloneElement(
        child as React.ReactElement<EvoWizardStepProps & StepPosition>,
        { key: child.key ?? i, __evoIndex: index },
      );
    }
    return child;
  });

  return (
    <WizardContext.Provider value={contextValue}>
      <div ref={ref} className={cx(styles.root, className)} {...rest}>
        {renderedChildren}
      </div>
    </WizardContext.Provider>
  );
});
EvoWizardRoot.displayName = 'EvoWizard';

// ----- Compound export -----

type EvoWizardComponent = typeof EvoWizardRoot & {
  Root: typeof EvoWizardRoot;
  Progress: typeof EvoWizardProgress;
  Step: typeof EvoWizardStep;
  Review: typeof EvoWizardReview;
  Actions: typeof EvoWizardActions;
};

export const EvoWizard = EvoWizardRoot as EvoWizardComponent;
EvoWizard.Root = EvoWizardRoot;
EvoWizard.Progress = EvoWizardProgress;
EvoWizard.Step = EvoWizardStep;
EvoWizard.Review = EvoWizardReview;
EvoWizard.Actions = EvoWizardActions;
