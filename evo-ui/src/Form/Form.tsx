import React, { createContext, useContext, useId } from 'react';
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
      {children}
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

EvoForm.Header = EvoFormHeader;
EvoForm.Section = EvoFormSection;
EvoForm.Row = EvoFormRow;
EvoForm.Field = EvoFormField;
EvoForm.Actions = EvoFormActions;
