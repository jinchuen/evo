import React, { createContext, useContext } from 'react';
import styles from '../css/form.module.scss';

interface FormContextType {
  disabled?: boolean;
}

const FormContext = createContext<FormContextType>({});

export const useFormContext = () => useContext(FormContext);

interface EvoFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

interface EvoFormFieldProps {
  children: React.ReactNode;
  className?: string;
}

const EvoFormField = ({ children, className = '' }: EvoFormFieldProps) => (
  <div className={`${styles.field} ${className}`}>{children}</div>
);

export const EvoForm = ({ children, disabled = false, className = '', ...rest }: EvoFormProps) => (
  <FormContext.Provider value={{ disabled }}>
    <form className={`${styles.form} ${className}`} {...rest}>
      {children}
    </form>
  </FormContext.Provider>
);

EvoForm.Field = EvoFormField;
