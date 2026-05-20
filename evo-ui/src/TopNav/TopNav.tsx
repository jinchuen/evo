// EvoTopNav — compose-based top navigation with a mobile drawer, polymorphic
// items, and dropdown sub-menus.
//
// Research notes (CLAUDE.md §2):
//  - Radix Navigation Menu — adopted the compose + `asChild` slot pattern.
//  - Mantine AppShell.Header — kept Burger / drawer as a separate sub-component
//    so the header itself stays a thin layout primitive.
//  - shadcn Navigation Menu — confirmed the same compose shape works without
//    any runtime dependency.

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '../css/topnav.module.scss';

// ============================================================================
// Types
// ============================================================================

export interface EvoTopNavProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Width in px below which Menu collapses into the drawer. @default 768 */
  collapseBelow?: number;
  className?: string;
}

export interface EvoTopNavBrandProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface EvoTopNavMenuProps
  extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
  className?: string;
}

export interface EvoTopNavItemProps {
  children: React.ReactNode;
  active?: boolean;
  icon?: React.ReactNode;
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
  onClick?: (e: React.MouseEvent) => void;
  asChild?: boolean;
  className?: string;
}

export interface EvoTopNavActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface EvoTopNavToggleProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'aria-expanded' | 'aria-controls'
  > {
  icon?: React.ReactNode;
  className?: string;
}

export interface EvoTopNavDropdownProps {
  label: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  hoverable?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export interface EvoTopNavDropdownItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
  onClick?: (e: React.MouseEvent) => void;
  asChild?: boolean;
  className?: string;
}

// ============================================================================
// Internal helpers
// ============================================================================

const cn = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(' ');

function composeHandlers<E extends React.SyntheticEvent>(
  ours?: (e: E) => void,
  theirs?: (e: E) => void,
) {
  return (e: E) => {
    ours?.(e);
    if (!e.defaultPrevented) theirs?.(e);
  };
}

function useControllableState<T>(opts: {
  value?: T;
  defaultValue: T;
  onChange?: (v: T) => void;
}) {
  const { value, defaultValue, onChange } = opts;
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [current, setValue] as const;
}

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function useMediaQuery(query: string, fallback = false) {
  const [matches, setMatches] = useState(fallback);
  useIsoLayoutEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener?.('change', update);
    return () => mql.removeEventListener?.('change', update);
  }, [query]);
  return matches;
}

const useIsCollapsed = (breakpoint: number) =>
  useMediaQuery(`(max-width: ${breakpoint - 1}px)`);

const useHoverCapable = () =>
  useMediaQuery('(hover: hover) and (pointer: fine)', true);

const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');

function getFocusable(root: HTMLElement | null) {
  if (!root) return [] as HTMLElement[];
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
    ),
  ).filter(
    (el) =>
      !el.hasAttribute('aria-hidden') &&
      el.offsetParent !== null,
  );
}

// ============================================================================
// Slot — minimal Radix-style asChild implementation (single child)
// ============================================================================

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  _ref,
) {
  const child = React.Children.only(children) as React.ReactElement<
    Record<string, unknown>
  >;
  const childProps = (child.props ?? {}) as Record<string, unknown>;

  const merged: Record<string, unknown> = { ...slotProps, ...childProps };

  // className: parent first, child appended
  merged.className = cn(
    slotProps.className as string | undefined,
    childProps.className as string | undefined,
  );

  // style: shallow merge — child wins on key collisions
  if (slotProps.style || childProps.style) {
    merged.style = {
      ...(slotProps.style as React.CSSProperties),
      ...(childProps.style as React.CSSProperties),
    };
  }

  // Compose event handlers (every on* prop on the slot)
  for (const key of Object.keys(slotProps)) {
    if (
      key.startsWith('on') &&
      typeof (slotProps as Record<string, unknown>)[key] === 'function'
    ) {
      const ours = (slotProps as Record<string, unknown>)[key] as (
        e: React.SyntheticEvent,
      ) => void;
      const theirs = childProps[key] as
        | ((e: React.SyntheticEvent) => void)
        | undefined;
      merged[key] = composeHandlers(ours, theirs);
    }
  }

  return React.cloneElement(child, merged);
});

// ============================================================================
// Context
// ============================================================================

interface TopNavContextValue {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  isCollapsed: boolean;
  menuId: string;
  toggleId: string;
  registerToggle: () => () => void;
  toggleCount: number;
  menuRef: React.RefObject<HTMLUListElement | null>;
  toggleRef: React.RefObject<HTMLButtonElement | null>;
}

const TopNavContext = React.createContext<TopNavContextValue | null>(null);

function useTopNavContext(component: string) {
  const ctx = React.useContext(TopNavContext);
  if (!ctx) {
    throw new Error(
      `EvoTopNav.${component} must be rendered inside <EvoTopNav>.`,
    );
  }
  return ctx;
}

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLUListElement | null>;
  contentId: string;
  focusItem: (delta: 1 | -1 | 'first' | 'last') => void;
  inDrawer: boolean;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

// ============================================================================
// Default icons
// ============================================================================

const HamburgerIcon = ({ open }: { open: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    className={styles.toggleIcon}
  >
    {open ? (
      <>
        <path
          d="M4 4l10 10M14 4L4 14"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </>
    ) : (
      <>
        <path
          d="M3 5h12M3 9h12M3 13h12"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </>
    )}
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 12 12"
    width="10"
    height="10"
    fill="none"
    aria-hidden="true"
    className={cn(styles.dropdownChevron, open && styles.dropdownChevronOpen)}
  >
    <path
      d="M3 4.5l3 3 3-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ============================================================================
// EvoTopNav.Brand
// ============================================================================

const EvoTopNavBrand = forwardRef<HTMLDivElement, EvoTopNavBrandProps>(
  function EvoTopNavBrand({ children, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(styles.topNavBrand, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

// ============================================================================
// EvoTopNav.Menu
// ============================================================================

const EvoTopNavMenu = forwardRef<HTMLUListElement, EvoTopNavMenuProps>(
  function EvoTopNavMenu({ children, className, ...rest }, forwardedRef) {
    const ctx = useTopNavContext('Menu');
    const localRef = useRef<HTMLUListElement | null>(null);

    const setRef = (node: HTMLUListElement | null) => {
      localRef.current = node;
      ctx.menuRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef)
        (forwardedRef as React.RefObject<HTMLUListElement | null>).current = node;
    };

    const hasToggle = ctx.toggleCount > 0;
    const inDrawer = ctx.isCollapsed && hasToggle;
    const drawerClosed = inDrawer && !ctx.drawerOpen;

    return (
      <ul
        ref={setRef}
        id={ctx.menuId}
        className={cn(
          styles.topNavMenu,
          inDrawer && styles.topNavMenuDrawer,
          drawerClosed && styles.topNavMenuDrawerClosed,
          ctx.isCollapsed && !hasToggle && styles.topNavMenuScroll,
          className,
        )}
        data-state={inDrawer ? (ctx.drawerOpen ? 'open' : 'closed') : 'inline'}
        aria-hidden={drawerClosed || undefined}
        {...rest}
      >
        {children}
      </ul>
    );
  },
);

// ============================================================================
// EvoTopNav.Item — polymorphic
// ============================================================================

const EvoTopNavItem = forwardRef<HTMLElement, EvoTopNavItemProps>(
  function EvoTopNavItem(
    { children, active, icon, href, target, rel, onClick, asChild, className },
    ref,
  ) {
    const ctx = React.useContext(TopNavContext);
    const inDrawerCtx = !!ctx && ctx.isCollapsed && ctx.drawerOpen;

    // Auto-close drawer on activation (SPA route nav heuristic).
    const handleActivation = (e: React.MouseEvent) => {
      onClick?.(e);
      if (!e.defaultPrevented && inDrawerCtx) ctx.setDrawerOpen(false);
    };

    const shared = {
      className: cn(styles.topNavItem, active && styles.topNavItemActive, className),
      'aria-current': active ? ('page' as const) : undefined,
      'data-active': active || undefined,
    };

    const content = (
      <>
        {icon && (
          <span className={styles.topNavIcon} aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={styles.topNavItemLabel}>{children}</span>
      </>
    );

    let element: React.ReactElement;

    if (asChild) {
      element = (
        <Slot
          {...shared}
          onClick={handleActivation}
          ref={ref as React.Ref<HTMLElement>}
        >
          {children}
        </Slot>
      );
    } else if (href) {
      element = (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={
            rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)
          }
          onClick={handleActivation}
          {...shared}
        >
          {content}
        </a>
      );
    } else {
      element = (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={handleActivation}
          {...shared}
        >
          {content}
        </button>
      );
    }

    return <li className={styles.topNavItemRow}>{element}</li>;
  },
);

// ============================================================================
// EvoTopNav.Actions
// ============================================================================

const EvoTopNavActions = forwardRef<HTMLDivElement, EvoTopNavActionsProps>(
  function EvoTopNavActions({ children, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(styles.topNavActions, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

// ============================================================================
// EvoTopNav.Toggle — hamburger
// ============================================================================

const EvoTopNavToggle = forwardRef<HTMLButtonElement, EvoTopNavToggleProps>(
  function EvoTopNavToggle(
    { icon, className, onClick, 'aria-label': ariaLabel, ...rest },
    forwardedRef,
  ) {
    const ctx = useTopNavContext('Toggle');
    const localRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => ctx.registerToggle(), [ctx]);

    const setRef = (node: HTMLButtonElement | null) => {
      localRef.current = node;
      ctx.toggleRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef)
        (forwardedRef as React.RefObject<HTMLButtonElement | null>).current = node;
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) ctx.setDrawerOpen(!ctx.drawerOpen);
    };

    return (
      <button
        ref={setRef}
        id={ctx.toggleId}
        type="button"
        className={cn(styles.topNavToggle, className)}
        aria-expanded={ctx.drawerOpen}
        aria-controls={ctx.menuId}
        aria-label={
          ariaLabel ?? (ctx.drawerOpen ? 'Close menu' : 'Open menu')
        }
        onClick={handleClick}
        {...rest}
      >
        {icon ?? <HamburgerIcon open={ctx.drawerOpen} />}
      </button>
    );
  },
);

// ============================================================================
// EvoTopNav.Dropdown
// ============================================================================

const EvoTopNavDropdown: React.FC<EvoTopNavDropdownProps> = ({
  label,
  icon,
  active,
  hoverable = true,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}) => {
  const ctx = React.useContext(TopNavContext);
  const inDrawer = !!ctx && ctx.isCollapsed && ctx.toggleCount > 0;

  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const hoverCapable = useHoverCapable();
  const allowHover = hoverable && hoverCapable && !inDrawer;

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLUListElement | null>(null);
  const rootRef = useRef<HTMLLIElement | null>(null);
  const contentId = useId();
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeAndRestore = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, [setOpen]);

  // Click outside
  useEffect(() => {
    if (!isOpen || inDrawer) return;
    const onDocDown = (e: MouseEvent) => {
      const root = rootRef.current;
      if (root && e.target instanceof Node && !root.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [isOpen, inDrawer, setOpen]);

  // Escape to close (only desktop dropdown — drawer handles its own Esc)
  useEffect(() => {
    if (!isOpen || inDrawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeAndRestore();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, inDrawer, closeAndRestore]);

  const focusItem = useCallback(
    (delta: 1 | -1 | 'first' | 'last') => {
      const items = getFocusable(contentRef.current);
      if (items.length === 0) return;
      const activeEl = document.activeElement as HTMLElement | null;
      const idx = activeEl ? items.indexOf(activeEl) : -1;
      let next = 0;
      if (delta === 'first') next = 0;
      else if (delta === 'last') next = items.length - 1;
      else if (delta === 1) next = idx < 0 ? 0 : (idx + 1) % items.length;
      else next = idx < 0 ? items.length - 1 : (idx - 1 + items.length) % items.length;
      items[next]?.focus();
    },
    [],
  );

  const handleTriggerKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem('first'));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem('last'));
    }
  };

  const handleContentKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusItem(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusItem(-1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusItem('first');
    } else if (e.key === 'End') {
      e.preventDefault();
      focusItem('last');
    } else if (e.key === 'Tab') {
      // Allow Tab to leave the dropdown; close it.
      setOpen(false);
    }
  };

  const onMouseEnter = () => {
    if (!allowHover) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpen(true);
  };
  const onMouseLeave = () => {
    if (!allowHover) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const dropdownCtx = useMemo<DropdownContextValue>(
    () => ({
      open: isOpen,
      setOpen,
      triggerRef,
      contentRef,
      contentId,
      focusItem,
      inDrawer,
    }),
    [isOpen, setOpen, contentId, focusItem, inDrawer],
  );

  return (
    <DropdownContext.Provider value={dropdownCtx}>
      <li
        ref={rootRef}
        className={cn(
          styles.topNavDropdown,
          inDrawer && styles.topNavDropdownInDrawer,
          isOpen && styles.topNavDropdownOpen,
          className,
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            styles.topNavItem,
            styles.topNavDropdownTrigger,
            active && styles.topNavItemActive,
          )}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={contentId}
          aria-current={active ? 'page' : undefined}
          onClick={() => setOpen(!isOpen)}
          onKeyDown={handleTriggerKey}
        >
          {icon && (
            <span className={styles.topNavIcon} aria-hidden="true">
              {icon}
            </span>
          )}
          <span className={styles.topNavItemLabel}>{label}</span>
          <ChevronIcon open={isOpen} />
        </button>
        <ul
          ref={contentRef}
          id={contentId}
          role="menu"
          className={cn(
            styles.topNavDropdownContent,
            isOpen && styles.topNavDropdownContentOpen,
          )}
          // Note: visibility is driven by the .topNavDropdownContentOpen class
          // (display: none → flex). Avoid the `hidden` attribute because
          // `[hidden] { display: none }` is overridden by class-level `display`
          // rules — the two-source-of-truth setup leaked an empty panel onto
          // the page in v1.
          aria-hidden={!isOpen || undefined}
          onKeyDown={handleContentKey}
        >
          {children}
        </ul>
      </li>
    </DropdownContext.Provider>
  );
};

// ============================================================================
// EvoTopNav.DropdownItem
// ============================================================================

const EvoTopNavDropdownItem = forwardRef<HTMLElement, EvoTopNavDropdownItemProps>(
  function EvoTopNavDropdownItem(
    { children, icon, active, href, target, rel, onClick, asChild, className },
    ref,
  ) {
    const dropdown = React.useContext(DropdownContext);
    const top = React.useContext(TopNavContext);

    const handleActivation = (e: React.MouseEvent) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        dropdown?.setOpen(false);
        // Also close the drawer if we're inside it.
        if (top && top.isCollapsed && top.drawerOpen) top.setDrawerOpen(false);
      }
    };

    const shared = {
      className: cn(
        styles.topNavDropdownItem,
        active && styles.topNavItemActive,
        className,
      ),
      role: 'menuitem' as const,
      'aria-current': active ? ('page' as const) : undefined,
    };

    const content = (
      <>
        {icon && (
          <span className={styles.topNavIcon} aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={styles.topNavItemLabel}>{children}</span>
      </>
    );

    let element: React.ReactElement;

    if (asChild) {
      element = (
        <Slot
          {...shared}
          onClick={handleActivation}
          ref={ref as React.Ref<HTMLElement>}
        >
          {children}
        </Slot>
      );
    } else if (href) {
      element = (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
          onClick={handleActivation}
          {...shared}
        >
          {content}
        </a>
      );
    } else {
      element = (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={handleActivation}
          {...shared}
        >
          {content}
        </button>
      );
    }

    return <li>{element}</li>;
  },
);

// ============================================================================
// EvoTopNav — root
// ============================================================================

export const EvoTopNav = forwardRef<HTMLElement, EvoTopNavProps>(
  function EvoTopNav(
    {
      children,
      open,
      defaultOpen = false,
      onOpenChange,
      collapseBelow = 768,
      className,
      ...rest
    },
    ref,
  ) {
    const [drawerOpen, setDrawerOpen] = useControllableState({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const isCollapsed = useIsCollapsed(collapseBelow);
    const reducedMotion = usePrefersReducedMotion();

    const [toggleCount, setToggleCount] = useState(0);
    const registerToggle = useCallback(() => {
      setToggleCount((c) => c + 1);
      return () => setToggleCount((c) => Math.max(0, c - 1));
    }, []);

    const menuId = useId();
    const toggleId = useId();
    const menuRef = useRef<HTMLUListElement | null>(null);
    const toggleRef = useRef<HTMLButtonElement | null>(null);
    const restoreFocusRef = useRef<HTMLElement | null>(null);

    const drawerActive = isCollapsed && drawerOpen && toggleCount > 0;

    // Close drawer when leaving the collapsed breakpoint.
    useEffect(() => {
      if (!isCollapsed && drawerOpen) setDrawerOpen(false);
    }, [isCollapsed, drawerOpen, setDrawerOpen]);

    // Body scroll lock while drawer is open.
    useEffect(() => {
      if (!drawerActive) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }, [drawerActive]);

    // Esc to close + focus trap inside Menu while drawer is open.
    useEffect(() => {
      if (!drawerActive) return;
      restoreFocusRef.current =
        (document.activeElement as HTMLElement | null) ?? null;

      const focusFirst = () => {
        const items = getFocusable(menuRef.current);
        items[0]?.focus();
      };
      const id = requestAnimationFrame(focusFirst);

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setDrawerOpen(false);
          return;
        }
        if (e.key !== 'Tab' || !menuRef.current) return;
        const items = getFocusable(menuRef.current);
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;
        if (e.shiftKey && activeEl === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && activeEl === last) {
          e.preventDefault();
          first.focus();
        } else if (activeEl && !menuRef.current.contains(activeEl)) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener('keydown', onKey);
      return () => {
        cancelAnimationFrame(id);
        document.removeEventListener('keydown', onKey);
      };
    }, [drawerActive, setDrawerOpen]);

    // Restore focus when drawer closes.
    useEffect(() => {
      if (drawerActive) return;
      const target = restoreFocusRef.current;
      if (target && typeof target.focus === 'function') {
        // Only restore if focus is currently inside the menu (or nowhere).
        const active = document.activeElement;
        if (
          !active ||
          active === document.body ||
          (menuRef.current && menuRef.current.contains(active))
        ) {
          target.focus();
        }
        restoreFocusRef.current = null;
      }
    }, [drawerActive]);

    const ctxValue = useMemo<TopNavContextValue>(
      () => ({
        drawerOpen,
        setDrawerOpen,
        isCollapsed,
        menuId,
        toggleId,
        registerToggle,
        toggleCount,
        menuRef,
        toggleRef,
      }),
      [
        drawerOpen,
        setDrawerOpen,
        isCollapsed,
        menuId,
        toggleId,
        registerToggle,
        toggleCount,
      ],
    );

    return (
      <TopNavContext.Provider value={ctxValue}>
        <nav
          ref={ref}
          className={cn(
            styles.topNav,
            drawerActive && styles.topNavDrawerOpen,
            reducedMotion && styles.topNavReducedMotion,
            className,
          )}
          data-collapsed={isCollapsed || undefined}
          data-drawer-open={drawerActive || undefined}
          {...rest}
        >
          <div className={styles.topNavInner}>{children}</div>
          {drawerActive && (
            <div
              className={styles.topNavBackdrop}
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
          )}
        </nav>
      </TopNavContext.Provider>
    );
  },
) as React.ForwardRefExoticComponent<
  EvoTopNavProps & React.RefAttributes<HTMLElement>
> & {
  Brand: typeof EvoTopNavBrand;
  Menu: typeof EvoTopNavMenu;
  Item: typeof EvoTopNavItem;
  Actions: typeof EvoTopNavActions;
  Toggle: typeof EvoTopNavToggle;
  Dropdown: typeof EvoTopNavDropdown;
  DropdownItem: typeof EvoTopNavDropdownItem;
};

EvoTopNavBrand.displayName = 'EvoTopNav.Brand';
EvoTopNavMenu.displayName = 'EvoTopNav.Menu';
EvoTopNavItem.displayName = 'EvoTopNav.Item';
EvoTopNavActions.displayName = 'EvoTopNav.Actions';
EvoTopNavToggle.displayName = 'EvoTopNav.Toggle';
EvoTopNavDropdown.displayName = 'EvoTopNav.Dropdown';
EvoTopNavDropdownItem.displayName = 'EvoTopNav.DropdownItem';
(EvoTopNav as { displayName?: string }).displayName = 'EvoTopNav';

EvoTopNav.Brand = EvoTopNavBrand;
EvoTopNav.Menu = EvoTopNavMenu;
EvoTopNav.Item = EvoTopNavItem;
EvoTopNav.Actions = EvoTopNavActions;
EvoTopNav.Toggle = EvoTopNavToggle;
EvoTopNav.Dropdown = EvoTopNavDropdown;
EvoTopNav.DropdownItem = EvoTopNavDropdownItem;
