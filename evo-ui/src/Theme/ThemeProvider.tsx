import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/**
 * The three theme modes EvoUI supports.
 * - `'light'` / `'dark'` — force the theme regardless of OS preference.
 * - `'system'` — follow the user's OS-level color-scheme preference.
 */
export type EvoTheme = 'light' | 'dark' | 'system';

/**
 * The actually-applied theme after resolving `'system'` against
 * `window.matchMedia('(prefers-color-scheme: dark)')`. Always either
 * `'light'` or `'dark'` — never `'system'`.
 */
export type EvoResolvedTheme = 'light' | 'dark';

export interface EvoThemeContextValue {
  /** The user-selected mode (may be `'system'`). */
  theme: EvoTheme;
  /** The mode that is actually painted right now (`'light'` or `'dark'`). */
  resolvedTheme: EvoResolvedTheme;
  /** Switch to a specific mode. */
  setTheme: (theme: EvoTheme) => void;
  /** Convenience: flip between light and dark (treats `'system'` as its resolved value). */
  toggleTheme: () => void;
}

const ThemeContext = createContext<EvoThemeContextValue | null>(null);

export interface EvoThemeProviderProps {
  /** Subtree to provide the theme to. */
  children: ReactNode;
  /**
   * Initial theme used before any persisted value is read.
   * @default 'system'
   */
  defaultTheme?: EvoTheme;
  /**
   * localStorage key used to persist the user's choice across reloads.
   * Pass `null` to disable persistence entirely.
   * @default 'evo-ui-theme'
   */
  storageKey?: string | null;
  /**
   * HTML attribute written to the document root. Most apps want
   * `'data-theme'`; pass `'class'` to instead toggle `light` / `dark`
   * as className (useful if you're sharing tokens with Tailwind).
   * @default 'data-theme'
   */
  attribute?: 'data-theme' | 'class';
  /**
   * Animate color transitions when the theme flips.
   * Automatically disabled for users with `prefers-reduced-motion`.
   * @default true
   */
  enableTransitions?: boolean;
  /**
   * Element to apply the theme attribute to.
   * @default document.documentElement
   */
  target?: HTMLElement;
}

const STORAGE_KEY_DEFAULT = 'evo-ui-theme';

function getSystemTheme(): EvoResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredTheme(key: string | null): EvoTheme | null {
  if (!key || typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(key);
    if (value === 'light' || value === 'dark' || value === 'system') return value;
  } catch {
    // localStorage can throw in private mode / sandboxed iframes.
  }
  return null;
}

/**
 * Provides EvoUI theming context to descendant components.
 *
 * @example
 * ```tsx
 * import { EvoThemeProvider } from '@justin_evo/evo-ui';
 *
 * <EvoThemeProvider defaultTheme="system">
 *   <App />
 * </EvoThemeProvider>
 * ```
 */
export const EvoThemeProvider = ({
  children,
  defaultTheme = 'system',
  storageKey = STORAGE_KEY_DEFAULT,
  attribute = 'data-theme',
  enableTransitions = true,
  target,
}: EvoThemeProviderProps) => {
  const [theme, setThemeState] = useState<EvoTheme>(() => {
    return readStoredTheme(storageKey) ?? defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<EvoResolvedTheme>(() => {
    const initial = readStoredTheme(storageKey) ?? defaultTheme;
    return initial === 'system' ? getSystemTheme() : initial;
  });

  const isFirstApply = useRef(true);

  const applyToDOM = useCallback(
    (resolved: EvoResolvedTheme) => {
      if (typeof document === 'undefined') return;
      const el = target ?? document.documentElement;

      // Enable transitions only AFTER the first paint, so the page
      // doesn't fade in from the wrong colors on initial load.
      if (enableTransitions && !isFirstApply.current) {
        el.setAttribute('data-theme-transition', 'true');
        window.clearTimeout((el as any).__evoThemeTimer);
        (el as any).__evoThemeTimer = window.setTimeout(() => {
          el.removeAttribute('data-theme-transition');
        }, 250);
      }

      if (attribute === 'class') {
        el.classList.remove('light', 'dark');
        el.classList.add(resolved);
        // Always set data-theme too so our CSS variables resolve.
        el.setAttribute('data-theme', resolved);
      } else {
        el.setAttribute('data-theme', resolved);
      }

      isFirstApply.current = false;
    },
    [attribute, enableTransitions, target],
  );

  // Apply theme to DOM whenever resolvedTheme changes.
  useEffect(() => {
    applyToDOM(resolvedTheme);
  }, [resolvedTheme, applyToDOM]);

  // Recompute resolvedTheme when theme changes.
  useEffect(() => {
    setResolvedTheme(theme === 'system' ? getSystemTheme() : theme);
  }, [theme]);

  // When the user is on 'system', listen for OS-level changes.
  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback(
    (next: EvoTheme) => {
      setThemeState(next);
      if (storageKey && typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(storageKey, next);
        } catch {
          // Storage might be unavailable — fail silently.
        }
      }
    },
    [storageKey],
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  const value = useMemo<EvoThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Read and update the EvoUI theme.
 *
 * Must be called from a descendant of `<EvoThemeProvider>`. If used
 * outside the provider, returns a no-op object with `resolvedTheme`
 * set to whatever is currently on `document.documentElement`.
 *
 * @example
 * ```tsx
 * const { resolvedTheme, setTheme, toggleTheme } = useEvoTheme();
 * <button onClick={toggleTheme}>
 *   {resolvedTheme === 'dark' ? '☀️' : '🌙'}
 * </button>
 * ```
 */
export const useEvoTheme = (): EvoThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (ctx) return ctx;

  // Graceful fallback if hook is called without a provider —
  // common in standalone widgets where the host app sets theme manually.
  const fallbackResolved: EvoResolvedTheme =
    typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light';

  return {
    theme: fallbackResolved,
    resolvedTheme: fallbackResolved,
    setTheme: () => {
      if (typeof document !== 'undefined') {
        // eslint-disable-next-line no-console
        console.warn(
          '[evo-ui] useEvoTheme called without <EvoThemeProvider>. ' +
            'Wrap your app in <EvoThemeProvider> to enable setTheme().',
        );
      }
    },
    toggleTheme: () => {},
  };
};

/**
 * Inline script that applies the persisted theme before React hydrates,
 * preventing the white-flash on first paint in dark mode. Drop into your
 * `<head>` (or Next.js `<Script strategy="beforeInteractive">`):
 *
 * @example
 * ```html
 * <script dangerouslySetInnerHTML={{ __html: getEvoThemeScript() }} />
 * ```
 */
export const getEvoThemeScript = (storageKey: string = STORAGE_KEY_DEFAULT): string => {
  return `(function(){try{var s=localStorage.getItem('${storageKey}');var t=s||'system';var r=t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.setAttribute('data-theme',r);}catch(e){}})();`;
};
