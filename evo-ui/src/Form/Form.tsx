import React, { createContext, useContext, useId } from 'react';
import { EvoButton } from '../Button/Button';
import styles from '../css/form.module.scss';

type FormSize = 'sm' | 'md' | 'lg';
type FormLayout = 'vertical' | 'horizontal';

interface FormContextType {
  disabled?: boolean;
  size?: FormSize;
  layout?: FormLayout;
}

const FormContext = createContext<FormContextType>({});

export const useFormContext = () => useContext(FormContext);

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

// ---------- Root ----------
interface EvoFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  disabled?: boolean;
  size?: FormSize;
  layout?: FormLayout;
  maxWidth?: number | string;
  className?: string;
}

export const EvoForm = ({
  children,
  disabled = false,
  size = 'md',
  layout = 'vertical',
  maxWidth,
  className = '',
  style,
  ...rest
}: EvoFormProps) => (
  <FormContext.Provider value={{ disabled, size, layout }}>
    <form
      className={cx(styles.form, styles[`form_${size}`], styles[`form_${layout}`], className)}
      style={maxWidth !== undefined ? { maxWidth, ...style } : style}
      {...rest}
    >
      {/*
        Render content inside a real <fieldset disabled> when `disabled` is
        set, so every native control underneath is blocked by the browser
        for free — not just controls that happen to read useFormContext().
        `display: contents` (see .fieldset in form.module.scss) keeps the
        fieldset out of the .form flex layout entirely.
      */}
      <fieldset className={styles.fieldset} disabled={disabled}>
        {children}
      </fieldset>
    </form>
  </FormContext.Provider>
);

// ---------- Header ----------
interface EvoFormHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const EvoFormHeader = ({ title, description, badge, children, className = '' }: EvoFormHeaderProps) => (
  <header className={cx(styles.header, className)}>
    {badge && <div className={styles.headerBadge}>{badge}</div>}
    {title && <h2 className={styles.headerTitle}>{title}</h2>}
    {description && <p className={styles.headerDesc}>{description}</p>}
    {children}
  </header>
);

// ---------- Section ----------
interface EvoFormSectionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: 'stacked' | 'split';
  children: React.ReactNode;
  className?: string;
}

const EvoFormSection = ({
  title,
  description,
  variant = 'stacked',
  children,
  className = '',
}: EvoFormSectionProps) => (
  <section className={cx(styles.section, styles[`section_${variant}`], className)}>
    {(title || description) && (
      <div className={styles.sectionHead}>
        {title && <h3 className={styles.sectionTitle}>{title}</h3>}
        {description && <p className={styles.sectionDesc}>{description}</p>}
      </div>
    )}
    <div className={styles.sectionBody}>{children}</div>
  </section>
);

// ---------- Row (side-by-side fields) ----------
interface EvoFormRowProps {
  children: React.ReactNode;
  gap?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

const EvoFormRow = ({ children, gap = 'md', align = 'start', className = '' }: EvoFormRowProps) => (
  <div className={cx(styles.row, styles[`row_${gap}`], styles[`row_align_${align}`], className)}>
    {children}
  </div>
);

// ---------- Field ----------
interface EvoFormFieldProps {
  children: React.ReactNode;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

const EvoFormField = ({
  children,
  label,
  description,
  error,
  required,
  htmlFor,
  className = '',
}: EvoFormFieldProps) => {
  const reactId = useId();
  const fieldId = htmlFor ?? `evo-field-${reactId}`;
  const hasMeta = label || description || error;

  if (!hasMeta) {
    return <div className={cx(styles.field, className)}>{children}</div>;
  }

  return (
    <div className={cx(styles.field, error ? styles.field_error : '', className)}>
      {label && (
        <label htmlFor={fieldId} className={styles.fieldLabel}>
          {label}
          {required && <span className={styles.fieldRequired} aria-hidden="true">*</span>}
        </label>
      )}
      <div className={styles.fieldControl}>{children}</div>
      {error ? (
        <p className={styles.fieldError} role="alert">{error}</p>
      ) : description ? (
        <p className={styles.fieldDesc}>{description}</p>
      ) : null}
    </div>
  );
};

// ---------- Actions (footer) ----------
interface EvoFormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'right' | 'between' | 'center';
  divider?: boolean;
  className?: string;
}

const EvoFormActions = ({
  children,
  align = 'right',
  divider = true,
  className = '',
}: EvoFormActionsProps) => (
  <div
    className={cx(
      styles.actions,
      styles[`actions_${align}`],
      divider ? styles.actions_divider : '',
      className,
    )}
  >
    {children}
  </div>
);

// ---------- Repeater (repeatable field-group — "Add another") ----------
interface EvoFormRepeaterApi<T> {
  update: (index: number, patch: Partial<T>) => void;
  remove: (index: number) => void;
}

interface EvoFormRepeaterProps<T> {
  value: T[];
  onChange: (next: T[]) => void;
  min?: number;
  max?: number;
  addLabel?: React.ReactNode;
  renderItem: (item: T, index: number, api: EvoFormRepeaterApi<T>) => React.ReactNode;
  className?: string;
}

// The IKEA effect: users trust and value what they assemble themselves.
// A repeatable "Add another" field-group lets people build up a list
// (contacts, links, line items) one row at a time instead of being handed
// a single rigid form — mirrors the Row/Field/Section slot pattern so it
// composes the same way as the rest of EvoForm.
function EvoFormRepeater<T>({
  value,
  onChange,
  min = 0,
  max,
  addLabel = 'Add another',
  renderItem,
  className = '',
}: EvoFormRepeaterProps<T>) {
  const canAdd = max === undefined || value.length < max;
  const canRemove = value.length > min;

  const update = (index: number, patch: Partial<T>) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const remove = (index: number) => {
    if (!canRemove) return;
    onChange(value.filter((_, i) => i !== index));
  };

  const add = () => {
    if (!canAdd) return;
    // Each new row starts as an empty object; renderItem is responsible for
    // supplying sensible defaults for whatever fields it renders.
    onChange([...value, {} as T]);
  };

  return (
    <div className={cx(styles.repeaterList, className)}>
      {value.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key -- rows have no stable id in this generic shape
        <div className={styles.repeaterItem} key={index}>
          <div className={styles.repeaterItemBody}>{renderItem(item, index, { update, remove })}</div>
          <EvoButton
            variant="ghost"
            severity="danger"
            size="sm"
            shape="square"
            className={styles.repeaterRemove}
            onClick={() => remove(index)}
            disabled={!canRemove}
            aria-label={`Remove row ${index + 1}`}
          >
            ✕
          </EvoButton>
        </div>
      ))}
      <EvoButton
        variant="ghost"
        size="sm"
        className={styles.repeaterAdd}
        onClick={add}
        disabled={!canAdd}
      >
        {addLabel}
      </EvoButton>
    </div>
  );
}

EvoForm.Header = EvoFormHeader;
EvoForm.Section = EvoFormSection;
EvoForm.Row = EvoFormRow;
EvoForm.Field = EvoFormField;
EvoForm.Actions = EvoFormActions;
EvoForm.Repeater = EvoFormRepeater;
