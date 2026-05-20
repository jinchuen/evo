// EvoNav — compose-based sidebar navigation.
//
// API decisions (see Radix Navigation Menu, Mantine NavLink, shadcn Sidebar):
// - Compose over config: nesting is always children, never an `items` array.
// - Disclosure state is controlled (`open` + `onOpenChange`) or uncontrolled
//   (`defaultOpen`), matching the Evo naming rule from CLAUDE.md §0.1.
// - `active` keeps its name (React community convention) but now always
//   forwards `aria-current="page"` — fixes the a11y gap called out in §9.
// - Rows render as `<a href>` when `href` is set, `<button type="button">`
//   otherwise. This preserves right-click / middle-click / drag semantics
//   without forcing every consumer onto a router.
// - At viewport widths below `breakpoint` (default 768px), the nav collapses
//   to an off-canvas drawer with a built-in hamburger trigger. Trigger can
//   be lifted with `hideTrigger` + controlled `drawerOpen`.
// - Keyboard model is a "disclosure tree" (Mantine-style), not Radix's
//   roving-tabindex menu: every row is in the natural tab order, arrow keys
//   move focus within the nav, ←/→ collapse/expand.

import {
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import styles from '../css/nav.module.scss';

// ─── Public types ──────────────────────────────────────────────────────────

export interface EvoNavProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  children: ReactNode;
  /** Below this viewport width (px), nav collapses to a drawer. @default 768 */
  breakpoint?: number;
  /** Controlled drawer open state (mobile only). */
  drawerOpen?: boolean;
  /** Uncontrolled initial drawer state. @default false */
  defaultDrawerOpen?: boolean;
  /** Called when the drawer opens or closes. */
  onDrawerOpenChange?: (open: boolean) => void;
  /** Hide the built-in hamburger trigger (use when wiring a trigger yourself). */
  hideTrigger?: boolean;
  /** Accessible label for the <nav> landmark. @default 'Main navigation' */
  'aria-label'?: string;
}

export interface EvoNavGroupProps {
  label: string;
  children: ReactNode;
  className?: string;
}

interface EvoNavRowProps {
  children: ReactNode;
  icon?: ReactNode;
  /** Marks this row as the current page (sets aria-current="page"). */
  active?: boolean;
  /** Render as <a href> instead of <button>. */
  href?: string;
  onClick?: (event: ReactMouseEvent | ReactKeyboardEvent) => void;
  /** Controlled expand state (only when row has SubItem children). */
  open?: boolean;
  /** Uncontrolled initial expand state. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export interface EvoNavItemProps extends EvoNavRowProps {}
export interface EvoNavSubItemProps extends EvoNavRowProps {}

export interface EvoNavSkeletonProps {
  /** @default 4 */
  count?: number;
}

export interface EvoNavQuickActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default 'Create New' */
  label?: string;
  icon?: ReactNode;
}

// ─── Internal context ──────────────────────────────────────────────────────

interface NavRootContextValue {
  /** Whether the viewport is below `breakpoint`. */
  isMobile: boolean;
  /** Drawer open state (only meaningful when isMobile). */
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  /** Closes the drawer; safe to call regardless of mobile state. */
  closeDrawer: () => void;
  /** Root id used by the hamburger button's aria-controls. */
  rootId: string;
}

const NavRootContext = createContext<NavRootContextValue | null>(null);

interface NavDepthContextValue {
  depth: number;
}

const NavDepthContext = createContext<NavDepthContextValue>({ depth: 0 });

// ─── Hooks ────────────────────────────────────────────────────────────────

function useIsBelowWidth(maxWidth: number): boolean {
  const [isBelow, setIsBelow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(`(max-width: ${maxWidth - 1}px)`);
    const update = () => setIsBelow(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [maxWidth]);

  return isBelow;
}

/** Resolve controlled vs. uncontrolled state. */
function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : uncontrolled;
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [value, setValue];
}

// ─── Keyboard navigation ──────────────────────────────────────────────────

const ROW_ATTR = 'data-evo-nav-row';

function focusableRows(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll<HTMLElement>(`[${ROW_ATTR}]:not([data-disabled="true"])`),
  ).filter((el) => el.offsetParent !== null);
}

function moveFocus(root: HTMLElement | null, from: HTMLElement, delta: 1 | -1 | 'first' | 'last') {
  const rows = focusableRows(root);
  if (rows.length === 0) return;
  const idx = rows.indexOf(from);
  let nextIdx: number;
  if (delta === 'first') nextIdx = 0;
  else if (delta === 'last') nextIdx = rows.length - 1;
  else nextIdx = Math.max(0, Math.min(rows.length - 1, idx + delta));
  rows[nextIdx]?.focus();
}

// ─── Chevron / plus icons ─────────────────────────────────────────────────

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    width="12"
    height="12"
    aria-hidden="true"
    className={[styles.chevron, open ? styles.chevronOpen : ''].filter(Boolean).join(' ')}
  >
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const HamburgerIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" width="18" height="18" aria-hidden="true">
    <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" width="18" height="18" aria-hidden="true">
    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

// ─── Row (Item / SubItem shared implementation) ───────────────────────────

interface RowInternalProps extends EvoNavRowProps {
  /** Visual tier — affects font weight and density. */
  tier: 'item' | 'subitem';
}

function splitSubItemChildren(children: ReactNode): { label: ReactNode[]; subs: ReactNode[] } {
  const label: ReactNode[] = [];
  const subs: ReactNode[] = [];
  const walk = (node: ReactNode) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (isValidElement(node)) {
      const type = node.type as { displayName?: string } | string;
      if (typeof type !== 'string' && type?.displayName === 'EvoNavSubItem') {
        subs.push(node);
        return;
      }
    }
    label.push(node);
  };
  walk(children);
  return { label, subs };
}

const NavRow = forwardRef<HTMLLIElement, RowInternalProps>(function NavRow(
  {
    children,
    icon,
    active = false,
    href,
    onClick,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    className,
    tier,
  },
  liRef,
) {
  const rootCtx = useContext(NavRootContext);
  const { depth } = useContext(NavDepthContext);
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const rowId = useId();
  const subListId = `${rowId}-sub`;

  const { label, subs } = useMemo(() => splitSubItemChildren(children), [children]);
  const expandable = subs.length > 0;
  const [open, setOpen] = useControllableState(
    expandable ? openProp : false,
    expandable ? defaultOpen : false,
    onOpenChange,
  );

  const toggle = useCallback(() => {
    if (!expandable) return;
    setOpen(!open);
  }, [expandable, open, setOpen]);

  const handleActivate = useCallback(
    (event: ReactMouseEvent | ReactKeyboardEvent) => {
      if (disabled) return;
      if (expandable && !href) {
        // No real navigation target — primary click toggles disclosure.
        toggle();
      }
      onClick?.(event);
      // On mobile, navigating closes the drawer so the user lands on the page.
      if (rootCtx?.isMobile && href && !expandable) {
        rootCtx.closeDrawer();
      }
    },
    [disabled, expandable, href, onClick, rootCtx, toggle],
  );

  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (disabled) return;
    const self = event.currentTarget as HTMLElement;
    const navRoot = self.closest<HTMLElement>(`.${styles.navContainer}`);
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveFocus(navRoot, self, 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveFocus(navRoot, self, -1);
        break;
      case 'ArrowRight':
        if (expandable) {
          event.preventDefault();
          if (!open) {
            setOpen(true);
          } else {
            // Focus first child row.
            const li = self.closest('li');
            const firstChild = li?.querySelector<HTMLElement>(`ul [${ROW_ATTR}]`);
            firstChild?.focus();
          }
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (expandable && open) {
          setOpen(false);
        } else if (depth > 0) {
          // Walk up to the nearest ancestor row.
          const parentLi = self.closest('li')?.parentElement?.closest('li');
          parentLi?.querySelector<HTMLElement>(`[${ROW_ATTR}]`)?.focus();
        }
        break;
      case 'Home':
        event.preventDefault();
        moveFocus(navRoot, self, 'first');
        break;
      case 'End':
        event.preventDefault();
        moveFocus(navRoot, self, 'last');
        break;
      case 'Enter':
      case ' ': {
        // <a> already activates on Enter; let it through but capture Space.
        if (event.key === ' ' || href === undefined) {
          event.preventDefault();
          handleActivate(event);
        }
        break;
      }
      default:
        break;
    }
  };

  const rowClasses = [
    styles.navRow,
    tier === 'subitem' ? styles.navRowSub : styles.navRowTop,
    active ? styles.active : '',
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const rowStyle =
    tier === 'subitem' && depth > 0
      ? ({ ['--evo-nav-indent' as string]: `${depth * 0.875}rem` } as CSSProperties)
      : undefined;

  const commonRowProps = {
    'data-evo-nav-row': '',
    id: rowId,
    className: rowClasses,
    style: rowStyle,
    'aria-current': active ? ('page' as const) : undefined,
    'aria-expanded': expandable ? open : undefined,
    'aria-controls': expandable ? subListId : undefined,
    'aria-disabled': disabled || undefined,
    'data-disabled': disabled ? 'true' : undefined,
    'data-active': active ? 'true' : undefined,
    tabIndex: disabled ? -1 : 0,
    onKeyDown: handleKeyDown,
  };

  const rowInner = (
    <>
      {icon && <span className={styles.navIcon}>{icon}</span>}
      <span className={styles.navLabel}>{label}</span>
      {expandable && <ChevronIcon open={open} />}
    </>
  );

  let rowEl: ReactNode;
  if (href && !disabled) {
    const anchorRest: AnchorHTMLAttributes<HTMLAnchorElement> = {
      href,
      onClick: handleActivate as unknown as AnchorHTMLAttributes<HTMLAnchorElement>['onClick'],
    };
    rowEl = (
      <a
        ref={buttonRef as RefObject<HTMLAnchorElement>}
        {...commonRowProps}
        {...anchorRest}
      >
        {rowInner}
      </a>
    );
  } else {
    rowEl = (
      <button
        ref={buttonRef as RefObject<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        onClick={handleActivate}
        {...commonRowProps}
      >
        {rowInner}
      </button>
    );
  }

  return (
    <li ref={liRef} className={styles.navLi}>
      {rowEl}
      {expandable && (
        <NavDepthContext.Provider value={{ depth: depth + 1 }}>
          <ul
            id={subListId}
            role="group"
            aria-labelledby={rowId}
            hidden={!open}
            className={styles.navSubList}
          >
            {subs}
          </ul>
        </NavDepthContext.Provider>
      )}
    </li>
  );
});

// ─── Public sub-components ────────────────────────────────────────────────

export const EvoNavItem = forwardRef<HTMLLIElement, EvoNavItemProps>(function EvoNavItem(
  props,
  ref,
) {
  return <NavRow ref={ref} tier="item" {...props} />;
});
EvoNavItem.displayName = 'EvoNavItem';

export const EvoNavSubItem = forwardRef<HTMLLIElement, EvoNavSubItemProps>(function EvoNavSubItem(
  props,
  ref,
) {
  return <NavRow ref={ref} tier="subitem" {...props} />;
});
EvoNavSubItem.displayName = 'EvoNavSubItem';

export const EvoNavGroup = forwardRef<HTMLLIElement, EvoNavGroupProps>(function EvoNavGroup(
  { label, children, className },
  ref,
) {
  const headingId = useId();
  return (
    <li
      ref={ref}
      className={[styles.navGroup, className].filter(Boolean).join(' ')}
    >
      <div id={headingId} role="heading" aria-level={3} className={styles.navGroupLabel}>
        {label}
      </div>
      <ul role="group" aria-labelledby={headingId} className={styles.navList}>
        {children}
      </ul>
    </li>
  );
});
EvoNavGroup.displayName = 'EvoNavGroup';

export const EvoNavSkeleton = ({ count = 4 }: EvoNavSkeletonProps) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <li
        key={i}
        aria-hidden="true"
        className={styles.navSkeletonItem}
      >
        <span className={styles.navSkeletonIcon} />
        <span
          className={styles.navSkeletonText}
          style={{ width: `${45 + (i % 4) * 12}%` }}
        />
      </li>
    ))}
  </>
);

export const EvoNavQuickAction = forwardRef<HTMLButtonElement, EvoNavQuickActionProps>(
  function EvoNavQuickAction({ label = 'Create New', icon, className, type = 'button', ...rest }, ref) {
    return (
      <li className={styles.navLi}>
        <button
          ref={ref}
          type={type}
          className={[styles.navQuickAction, className].filter(Boolean).join(' ')}
          {...rest}
        >
          <span className={styles.navIcon}>{icon ?? <PlusIcon />}</span>
          <span className={styles.navLabel}>{label}</span>
        </button>
      </li>
    );
  },
);
EvoNavQuickAction.displayName = 'EvoNavQuickAction';

// ─── Root ─────────────────────────────────────────────────────────────────

const EvoNavRoot = forwardRef<HTMLElement, EvoNavProps>(function EvoNav(
  {
    children,
    breakpoint = 768,
    drawerOpen: drawerOpenProp,
    defaultDrawerOpen = false,
    onDrawerOpenChange,
    hideTrigger = false,
    className,
    'aria-label': ariaLabel = 'Main navigation',
    ...rest
  },
  ref,
) {
  const isMobile = useIsBelowWidth(breakpoint);
  const [drawerOpen, setDrawerOpen] = useControllableState(
    drawerOpenProp,
    defaultDrawerOpen,
    onDrawerOpenChange,
  );
  const closeDrawer = useCallback(() => setDrawerOpen(false), [setDrawerOpen]);
  const rootId = useId();
  const navRef = useRef<HTMLElement>(null);

  // Close drawer on Escape when on mobile.
  useEffect(() => {
    if (!isMobile || !drawerOpen) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isMobile, drawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open.
  useEffect(() => {
    if (!isMobile || !drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobile, drawerOpen]);

  // When transitioning back to desktop width, ensure drawer is closed so
  // subsequent shrinks reopen the sidebar cleanly.
  useEffect(() => {
    if (!isMobile && drawerOpen) closeDrawer();
  }, [isMobile, drawerOpen, closeDrawer]);

  const ctxValue = useMemo<NavRootContextValue>(
    () => ({ isMobile, drawerOpen, setDrawerOpen, closeDrawer, rootId }),
    [isMobile, drawerOpen, setDrawerOpen, closeDrawer, rootId],
  );

  const navClasses = [
    styles.navContainer,
    isMobile ? styles.navMobile : styles.navDesktop,
    isMobile && drawerOpen ? styles.navDrawerOpen : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const setRefs = (el: HTMLElement | null) => {
    (navRef as RefObject<HTMLElement | null>).current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as RefObject<HTMLElement | null>).current = el;
  };

  return (
    <NavRootContext.Provider value={ctxValue}>
      {isMobile && !hideTrigger && (
        <button
          type="button"
          className={styles.navTrigger}
          aria-expanded={drawerOpen}
          aria-controls={rootId}
          aria-label={drawerOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          {drawerOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>
      )}
      {isMobile && drawerOpen && (
        <div
          className={styles.navBackdrop}
          aria-hidden="true"
          onClick={closeDrawer}
        />
      )}
      <nav
        ref={setRefs}
        id={rootId}
        role="navigation"
        aria-label={ariaLabel}
        aria-hidden={isMobile && !drawerOpen ? true : undefined}
        className={navClasses}
        {...rest}
      >
        <ul className={styles.navList}>{children}</ul>
      </nav>
    </NavRootContext.Provider>
  );
});

EvoNavRoot.displayName = 'EvoNav';

export const EvoNav = Object.assign(EvoNavRoot, {
  Group: EvoNavGroup,
  Item: EvoNavItem,
  SubItem: EvoNavSubItem,
  Skeleton: EvoNavSkeleton,
  QuickAction: EvoNavQuickAction,
});
