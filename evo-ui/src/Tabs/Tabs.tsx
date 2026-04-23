import React, { createContext, useContext, useState } from 'react';
import styles from '../css/tabs.module.scss';

interface TabsContextType {
  active: string;
  setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

const useTabsCtx = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tab components must be used within EvoTabs');
  return ctx;
};

interface EvoTabsProps {
  children: React.ReactNode;
  defaultTab?: string;
  className?: string;
}

interface EvoTabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface EvoTabProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

interface EvoTabsPanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

const EvoTabsList = ({ children, className = '' }: EvoTabsListProps) => (
  <div className={`${styles.tabList} ${className}`} role="tablist">
    {children}
  </div>
);

const EvoTab = ({ id, children, disabled = false, className = '' }: EvoTabProps) => {
  const { active, setActive } = useTabsCtx();
  return (
    <button
      role="tab"
      aria-selected={active === id}
      disabled={disabled}
      className={[
        styles.tab,
        active === id ? styles.active : '',
        disabled ? styles.disabled : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => setActive(id)}
    >
      {children}
    </button>
  );
};

const EvoTabsPanel = ({ id, children, className = '' }: EvoTabsPanelProps) => {
  const { active } = useTabsCtx();
  if (active !== id) return null;
  return (
    <div role="tabpanel" className={`${styles.tabPanel} ${className}`}>
      {children}
    </div>
  );
};

export const EvoTabs = ({ children, defaultTab = '', className = '' }: EvoTabsProps) => {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={`${styles.tabs} ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

EvoTabs.List = EvoTabsList;
EvoTabs.Tab = EvoTab;
EvoTabs.Panel = EvoTabsPanel;
