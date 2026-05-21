import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import ReactDOM from 'react-dom';
import styles from '../css/notification.module.scss';

// ============================================================
// EvoNotification — unified toast + notification-center system
// ------------------------------------------------------------
// Design notes (see CLAUDE.md §2 research stanza):
//   • API shape borrowed from Sonner — module-level singleton
//     so any file can `import { evoNotify }` and call it
//     without a hook or being inside the React tree.
//   • a11y model borrowed from Radix Toast — error → assertive,
//     everything else → polite. Hover/focus pauses timers.
//   • queue/limit/overflow-fold borrowed from Mantine — past
//     `maxVisible` toasts collapse into a "+N more" pill.
//   • inbox/bell/panel shape borrowed from MagicBell + Knock —
//     read/unread, mark-all-read, empty/loading/error slots.
//   • Animations are hand-rolled (zero deps): CSS keyframes for
//     enter/exit and a CSS transition on the stacking transform
//     for reorder; one global opt-out via `prefers-reduced-motion`.
//   • Evo-specific extras: `groupKey` coalesces repeat toasts into
//     a single counted card; `toast.progress()` drives a
//     determinate progress bar to a success/error end state.
// ============================================================

// ─── Types ───────────────────────────────────────────────────

export type EvoNotificationSeverity = 'success' | 'error' | 'warning' | 'info';

export type EvoNotificationAnchor =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface EvoNotificationAction {
  label: string;
  onClick: (e: React.MouseEvent) => void;
}

export interface EvoToastOptions {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  severity?: EvoNotificationSeverity;
  icon?: ReactNode;
  duration?: number;
  persistent?: boolean;
  anchor?: EvoNotificationAnchor;
  action?: EvoNotificationAction;
  dismissible?: boolean;
  onDismiss?: (id: string) => void;
  onAutoClose?: (id: string) => void;
  className?: string;
  inbox?: boolean | Partial<EvoInboxItemInput>;
  /**
   * Coalescing key. Toasts pushed with the same `groupKey` while an earlier
   * one is still on screen fold into it — the card refreshes in place and
   * shows an incremented count badge instead of stacking a duplicate.
   * Ignored when an explicit `id` is supplied (id matching takes priority).
   */
  groupKey?: string;
  /**
   * Determinate progress, 0–1. When set, the toast renders a progress bar.
   * Values outside the range are clamped. Usually driven via
   * `evoNotify.toast.progress()`, but valid on any toast.
   */
  progress?: number;
}

export interface EvoPromiseMessages<T> {
  loading: ReactNode | EvoToastOptions;
  success: ReactNode | ((value: T) => ReactNode | EvoToastOptions);
  error: ReactNode | ((err: unknown) => ReactNode | EvoToastOptions);
}

/**
 * Handle returned by `evoNotify.toast.progress()`. Drives a determinate
 * progress bar and resolves the toast to a success or error end state.
 */
export interface EvoToastProgressHandle {
  /** The underlying toast id — usable with `evoNotify.toast.dismiss`. */
  readonly id: string;
  /** Set the bar fill, 0–1 (values outside the range are clamped). */
  setProgress: (value: number) => void;
  /** Patch any toast option (title, description, severity, …). */
  update: (options: EvoToastOptions) => void;
  /** Resolve as success: bar fills to 100%, the toast then auto-dismisses. */
  done: (options?: EvoToastOptions) => void;
  /** Resolve as error: the toast becomes dismissible and auto-dismisses. */
  fail: (options?: EvoToastOptions) => void;
  /** Dismiss the toast immediately. */
  dismiss: () => void;
}

export interface EvoInboxItemInput {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  severity?: EvoNotificationSeverity;
  icon?: ReactNode;
  avatarUrl?: string;
  timestamp?: number | Date;
  read?: boolean;
  action?: EvoNotificationAction;
  onClick?: (item: EvoInboxItem) => void;
  meta?: Record<string, unknown>;
  toast?: boolean | Partial<EvoToastOptions>;
}

export interface EvoInboxItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  severity: EvoNotificationSeverity;
  icon?: ReactNode;
  avatarUrl?: string;
  timestamp: number;
  read: boolean;
  action?: EvoNotificationAction;
  onClick?: (item: EvoInboxItem) => void;
  meta?: Record<string, unknown>;
}

interface InternalToast extends EvoToastOptions {
  id: string;
  severity: EvoNotificationSeverity;
  createdAt: number;
  message: ReactNode;
  /** How many times this toast has been (re)pushed under its `groupKey`. */
  count: number;
  /** Bumped on every re-push / update so the row can restart its timer. */
  restartKey: number;
  /** True while the exit animation plays, before the store drops it. */
  exiting?: boolean;
}

// ─── Module-level store ──────────────────────────────────────
// Singleton so `evoNotify.toast(...)` works from any file
// without requiring a hook or React context.

type ToastListener = (toasts: InternalToast[]) => void;
type InboxListener = (state: { items: EvoInboxItem[]; unread: number }) => void;

interface ProviderConfig {
  defaultAnchor: EvoNotificationAnchor;
  defaultDuration: number;
  maxVisible: number;
  pauseOnFocusLoss: boolean;
  persistErrors: boolean;
}

const DEFAULT_CONFIG: ProviderConfig = {
  defaultAnchor: 'top-right',
  defaultDuration: 4000,
  maxVisible: 3,
  pauseOnFocusLoss: true,
  persistErrors: false,
};

// Exit-animation duration. Must stay in sync with the `evoToastExit`
// keyframe length in notification.module.scss.
const EXIT_MS = 180;

// Stable empty references for `useSyncExternalStore` server/initial snapshots.
// Returning a fresh array/object from getServerSnapshot triggers an infinite
// render loop, so these MUST be the same identity on every read.
const EMPTY_TOASTS: ReadonlyArray<InternalToast> = Object.freeze([]) as ReadonlyArray<InternalToast>;
const EMPTY_INBOX_STATE: { items: EvoInboxItem[]; unread: number } = Object.freeze({
  items: Object.freeze([]) as unknown as EvoInboxItem[],
  unread: 0,
}) as { items: EvoInboxItem[]; unread: number };

class NotificationStore {
  private toasts: InternalToast[] = [];
  private inboxItems: EvoInboxItem[] = [];
  // Cached inbox snapshot — same reference until inboxItems mutates.
  private inboxSnapshot: { items: EvoInboxItem[]; unread: number } = {
    items: [],
    unread: 0,
  };
  private inboxOwnedExternally = false;
  private inboxOnChange: ((items: EvoInboxItem[]) => void) | null = null;
  private toastListeners = new Set<ToastListener>();
  private inboxListeners = new Set<InboxListener>();
  private configListeners = new Set<() => void>();
  private config: ProviderConfig = DEFAULT_CONFIG;
  private counter = 0;

  setConfig(next: Partial<ProviderConfig>) {
    const merged = { ...this.config, ...next };
    const changed = (Object.keys(merged) as Array<keyof ProviderConfig>)
      .some((k) => merged[k] !== this.config[k]);
    if (!changed) return;
    this.config = merged;
    this.notifyConfig();
  }

  getConfig() {
    return this.config;
  }

  subscribeConfig(fn: () => void) {
    this.configListeners.add(fn);
    return () => {
      this.configListeners.delete(fn);
    };
  }

  private notifyConfig() {
    this.configListeners.forEach((fn) => fn());
  }

  // Resolves a toast's lifetime. `persistent` wins, then an explicit
  // `duration`, then the `persistErrors` config (errors stay until the
  // user dismisses them), then the global default.
  private resolveDuration(
    options: EvoToastOptions,
    severity: EvoNotificationSeverity,
  ): number {
    if (options.persistent === true) return Infinity;
    if (options.duration != null) return options.duration;
    if (
      severity === 'error' &&
      this.config.persistErrors &&
      options.persistent !== false
    ) {
      return Infinity;
    }
    return this.config.defaultDuration;
  }

  bindExternalInbox(items: EvoInboxItem[] | undefined, onChange: ((items: EvoInboxItem[]) => void) | undefined) {
    if (items !== undefined) {
      this.inboxOwnedExternally = true;
      this.inboxItems = items;
      this.inboxOnChange = onChange ?? null;
      this.refreshInboxSnapshot();
      this.notifyInbox();
    } else {
      this.inboxOwnedExternally = false;
      this.inboxOnChange = null;
    }
  }

  private refreshInboxSnapshot() {
    let unread = 0;
    for (const i of this.inboxItems) if (!i.read) unread += 1;
    this.inboxSnapshot = { items: this.inboxItems, unread };
  }

  private nextId() {
    this.counter += 1;
    return `evo-${Date.now().toString(36)}-${this.counter}`;
  }

  // ----- Toast methods -----

  pushToast(message: ReactNode, options: EvoToastOptions = {}): string {
    const severity = options.severity ?? 'info';

    // Coalescing: a toast carrying a `groupKey` (and no explicit id) folds
    // into any still-active toast sharing that key — the card refreshes in
    // place with an incremented count instead of stacking a duplicate.
    if (options.groupKey != null && options.id == null) {
      const group = this.toasts.find(
        (t) => t.groupKey === options.groupKey && !t.exiting,
      );
      if (group) {
        this.toasts = this.toasts.map((t): InternalToast =>
          t.id === group.id
            ? {
                ...t,
                ...options,
                id: group.id,
                severity,
                duration: this.resolveDuration(options, severity),
                message,
                count: t.count + 1,
                restartKey: t.restartKey + 1,
              }
            : t,
        );
        this.applyInboxSideEffect(group.id, message, options);
        this.notifyToasts();
        return group.id;
      }
    }

    const id = options.id ?? this.nextId();
    const duration = this.resolveDuration(options, severity);

    const existing = this.toasts.find((t) => t.id === id);
    if (existing) {
      // Re-pushing under an existing id refreshes it, restarts its timer,
      // and revives it if it happened to be mid-exit.
      this.toasts = this.toasts.map((t): InternalToast =>
        t.id === id
          ? {
              ...t,
              ...options,
              id,
              severity,
              duration,
              message,
              restartKey: t.restartKey + 1,
              exiting: false,
            }
          : t,
      );
    } else {
      const toast: InternalToast = {
        ...options,
        id,
        severity,
        duration,
        message,
        createdAt: Date.now(),
        count: 1,
        restartKey: 0,
      };
      this.toasts = [...this.toasts, toast];
    }

    this.applyInboxSideEffect(id, message, options);
    this.notifyToasts();
    return id;
  }

  private applyInboxSideEffect(
    id: string,
    message: ReactNode,
    options: EvoToastOptions,
  ) {
    if (!options.inbox) return;
    const inboxInput: EvoInboxItemInput = {
      id: `${id}-inbox`,
      title: options.title ?? message,
      description: options.description,
      severity: options.severity ?? 'info',
      icon: options.icon,
      action: options.action,
      ...(typeof options.inbox === 'object' ? options.inbox : {}),
    };
    this.pushInbox(inboxInput);
  }

  updateToast(id: string, options: EvoToastOptions) {
    const idx = this.toasts.findIndex((t) => t.id === id);
    if (idx === -1) return;
    const prev = this.toasts[idx];
    const next: InternalToast = {
      ...prev,
      ...options,
      id,
      severity: options.severity ?? prev.severity,
      message: 'title' in options && options.title != null ? options.title : prev.message,
      // Bumped so the row resets its auto-dismiss countdown for the
      // refreshed content (e.g. a resolved promise toast).
      restartKey: prev.restartKey + 1,
    };
    // Re-resolve the lifetime. Without the `persistent === false` branch a
    // toast that was persistent (a loading/progress toast) would keep its
    // `Infinity` duration and never auto-dismiss after resolving.
    if (options.persistent === true) {
      next.duration = Infinity;
    } else if (options.duration != null) {
      next.duration = options.duration;
    } else if (options.persistent === false) {
      next.duration = this.resolveDuration(
        { ...options, persistent: false },
        next.severity,
      );
    }
    this.toasts = this.toasts.map((t) => (t.id === id ? next : t));
    this.notifyToasts();
  }

  // Phase 1 of removal: flag the toast(s) as exiting and fire the close
  // callback. The row plays the exit animation, then calls `removeToast`.
  // Every removal path — close button, action, auto-close, dismissAll —
  // funnels through here, so exit animation is always consistent.
  dismissToast(id?: string, reason: 'dismiss' | 'auto' = 'dismiss') {
    if (id == null) {
      const active = this.toasts.filter((t) => !t.exiting);
      if (active.length === 0) return;
      active.forEach((t) => t.onDismiss?.(t.id));
      this.toasts = this.toasts.map((t): InternalToast =>
        t.exiting ? t : { ...t, exiting: true },
      );
      this.notifyToasts();
      return;
    }
    const target = this.toasts.find((t) => t.id === id);
    if (!target || target.exiting) return;
    if (reason === 'auto') target.onAutoClose?.(id);
    else target.onDismiss?.(id);
    this.toasts = this.toasts.map((t): InternalToast =>
      t.id === id ? { ...t, exiting: true } : t,
    );
    this.notifyToasts();
  }

  // Phase 2: drop the toast once its exit animation has finished.
  removeToast(id: string) {
    const before = this.toasts.length;
    this.toasts = this.toasts.filter((t) => t.id !== id);
    if (this.toasts.length !== before) this.notifyToasts();
  }

  getToasts() {
    return this.toasts;
  }

  subscribeToasts(fn: ToastListener) {
    this.toastListeners.add(fn);
    return () => {
      this.toastListeners.delete(fn);
    };
  }

  private notifyToasts() {
    this.toastListeners.forEach((fn) => fn(this.toasts));
  }

  // ----- Inbox methods -----

  pushInbox(input: EvoInboxItemInput): string {
    const id = input.id ?? this.nextId();
    const ts = input.timestamp instanceof Date
      ? input.timestamp.getTime()
      : input.timestamp ?? Date.now();

    const item: EvoInboxItem = {
      id,
      title: input.title,
      description: input.description,
      severity: input.severity ?? 'info',
      icon: input.icon,
      avatarUrl: input.avatarUrl,
      timestamp: ts,
      read: input.read ?? false,
      action: input.action,
      onClick: input.onClick,
      meta: input.meta,
    };

    const idx = this.inboxItems.findIndex((i) => i.id === id);
    const next = idx === -1
      ? [item, ...this.inboxItems]
      : this.inboxItems.map((i) => (i.id === id ? item : i));
    this.commitInbox(next);

    if (input.toast) {
      const toastInput: EvoToastOptions = {
        id: `${id}-toast`,
        title: item.title,
        description: item.description,
        severity: item.severity,
        icon: item.icon,
        action: item.action,
        ...(typeof input.toast === 'object' ? input.toast : {}),
      };
      this.pushToast(item.title, toastInput);
    }

    return id;
  }

  markRead(id: string) {
    this.commitInbox(this.inboxItems.map((i) => (i.id === id ? { ...i, read: true } : i)));
  }

  markUnread(id: string) {
    this.commitInbox(this.inboxItems.map((i) => (i.id === id ? { ...i, read: false } : i)));
  }

  markAllRead() {
    this.commitInbox(this.inboxItems.map((i) => (i.read ? i : { ...i, read: true })));
  }

  removeInbox(id: string) {
    this.commitInbox(this.inboxItems.filter((i) => i.id !== id));
  }

  clearInbox() {
    this.commitInbox([]);
  }

  setInboxItems(items: EvoInboxItem[]) {
    this.commitInbox(items);
  }

  getInboxState() {
    return this.inboxSnapshot;
  }

  subscribeInbox(fn: InboxListener) {
    this.inboxListeners.add(fn);
    return () => {
      this.inboxListeners.delete(fn);
    };
  }

  private commitInbox(next: EvoInboxItem[]) {
    this.inboxItems = next;
    this.refreshInboxSnapshot();
    if (this.inboxOwnedExternally) {
      this.inboxOnChange?.(next);
    }
    this.notifyInbox();
  }

  private notifyInbox() {
    const state = this.inboxSnapshot;
    this.inboxListeners.forEach((fn) => fn(state));
  }
}

const store = new NotificationStore();

// ─── Public singleton API ────────────────────────────────────

export interface EvoNotifyAPI {
  toast: {
    (message: ReactNode, options?: EvoToastOptions): string;
    success: (message: ReactNode, options?: EvoToastOptions) => string;
    error: (message: ReactNode, options?: EvoToastOptions) => string;
    warning: (message: ReactNode, options?: EvoToastOptions) => string;
    info: (message: ReactNode, options?: EvoToastOptions) => string;
    loading: (message: ReactNode, options?: EvoToastOptions) => string;
    promise: <T>(p: Promise<T> | (() => Promise<T>), msgs: EvoPromiseMessages<T>) => string;
    progress: (message: ReactNode, options?: EvoToastOptions) => EvoToastProgressHandle;
    update: (id: string, options: EvoToastOptions) => void;
    dismiss: (id?: string) => void;
  };
  push: (item: EvoInboxItemInput) => string;
  inbox: {
    markRead: (id: string) => void;
    markUnread: (id: string) => void;
    markAllRead: () => void;
    remove: (id: string) => void;
    clear: () => void;
    setItems: (items: EvoInboxItem[]) => void;
    getState: () => { items: EvoInboxItem[]; unread: number };
    subscribe: (fn: (s: { items: EvoInboxItem[]; unread: number }) => void) => () => void;
  };
  dismissAll: () => void;
}

const baseToast = (message: ReactNode, options?: EvoToastOptions) =>
  store.pushToast(message, options);

const toastApi = baseToast as EvoNotifyAPI['toast'];

toastApi.success = (m, o) => store.pushToast(m, { ...o, severity: 'success' });
toastApi.error = (m, o) => store.pushToast(m, { ...o, severity: 'error' });
toastApi.warning = (m, o) => store.pushToast(m, { ...o, severity: 'warning' });
toastApi.info = (m, o) => store.pushToast(m, { ...o, severity: 'info' });
toastApi.loading = (m, o) =>
  store.pushToast(m, { ...o, severity: 'info', persistent: true, dismissible: false });
toastApi.update = (id, o) => store.updateToast(id, o);
toastApi.dismiss = (id) => store.dismissToast(id);
toastApi.promise = <T,>(
  p: Promise<T> | (() => Promise<T>),
  msgs: EvoPromiseMessages<T>,
) => {
  const id = store.pushToast(
    typeof msgs.loading === 'object' && msgs.loading !== null && !isReactNode(msgs.loading)
      ? (msgs.loading as EvoToastOptions).title ?? ''
      : (msgs.loading as ReactNode),
    {
      ...(typeof msgs.loading === 'object' && !isReactNode(msgs.loading)
        ? (msgs.loading as EvoToastOptions)
        : {}),
      severity: 'info',
      persistent: true,
      dismissible: false,
    },
  );

  const promise = typeof p === 'function' ? p() : p;

  promise.then(
    (value) => {
      const resolved = typeof msgs.success === 'function'
        ? (msgs.success as (v: T) => ReactNode | EvoToastOptions)(value)
        : msgs.success;
      const isOpts = resolved !== null && typeof resolved === 'object' && !isReactNode(resolved);
      const opts = isOpts ? (resolved as EvoToastOptions) : {};
      const msg = isOpts ? opts.title ?? '' : (resolved as ReactNode);
      store.updateToast(id, {
        ...opts,
        severity: 'success',
        persistent: false,
        dismissible: true,
        title: msg,
      });
    },
    (err) => {
      const resolved = typeof msgs.error === 'function'
        ? (msgs.error as (e: unknown) => ReactNode | EvoToastOptions)(err)
        : msgs.error;
      const isOpts = resolved !== null && typeof resolved === 'object' && !isReactNode(resolved);
      const opts = isOpts ? (resolved as EvoToastOptions) : {};
      const msg = isOpts ? opts.title ?? '' : (resolved as ReactNode);
      store.updateToast(id, {
        ...opts,
        severity: 'error',
        persistent: false,
        dismissible: true,
        title: msg,
      });
    },
  );

  return id;
};

toastApi.progress = (message, options) => {
  const id = store.pushToast(message, {
    ...options,
    severity: options?.severity ?? 'info',
    persistent: true,
    dismissible: options?.dismissible ?? false,
    progress: clamp01(options?.progress ?? 0),
  });
  return {
    id,
    setProgress: (value) => store.updateToast(id, { progress: clamp01(value) }),
    update: (opts) => store.updateToast(id, opts),
    done: (opts) =>
      store.updateToast(id, {
        ...opts,
        severity: opts?.severity ?? 'success',
        progress: 1,
        persistent: false,
        dismissible: true,
      }),
    fail: (opts) =>
      store.updateToast(id, {
        ...opts,
        severity: opts?.severity ?? 'error',
        persistent: false,
        dismissible: true,
      }),
    dismiss: () => store.dismissToast(id),
  };
};

function isReactNode(v: unknown): boolean {
  if (v == null) return true;
  const t = typeof v;
  if (t === 'string' || t === 'number' || t === 'boolean') return true;
  if (Array.isArray(v)) return true;
  if (t === 'object' && v !== null && '$$typeof' in (v as object)) return true;
  return false;
}

/** Clamps a number into the 0–1 range; non-numbers and NaN fall back to 0. */
function clamp01(n: number): number {
  if (typeof n !== 'number' || Number.isNaN(n)) return 0;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export const evoNotify: EvoNotifyAPI = {
  toast: toastApi,
  push: (item) => store.pushInbox(item),
  inbox: {
    markRead: (id) => store.markRead(id),
    markUnread: (id) => store.markUnread(id),
    markAllRead: () => store.markAllRead(),
    remove: (id) => store.removeInbox(id),
    clear: () => store.clearInbox(),
    setItems: (items) => store.setInboxItems(items),
    getState: () => store.getInboxState(),
    subscribe: (fn) => store.subscribeInbox(fn),
  },
  dismissAll: () => store.dismissToast(),
};

// ─── Helpers ─────────────────────────────────────────────────

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(' ');
}

const ICON_GLYPHS: Record<EvoNotificationSeverity, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
};

function formatRelative(ts: number, now: number): string {
  const d = Math.max(0, now - ts);
  const s = Math.floor(d / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

// Extracts plain text from a toast for the screen-reader live region and the
// row's `aria-label`. JSX titles/descriptions yield '' (announced silently).
function toastText(t: InternalToast): string {
  const parts: string[] = [];
  const title = t.title ?? t.message;
  if (typeof title === 'string' || typeof title === 'number') {
    parts.push(String(title));
  }
  if (typeof t.description === 'string' || typeof t.description === 'number') {
    parts.push(String(t.description));
  }
  return parts.join('. ');
}

function useToasts() {
  return useSyncExternalStore(
    (cb) => store.subscribeToasts(() => cb()),
    () => store.getToasts(),
    () => EMPTY_TOASTS as InternalToast[],
  );
}

function useInbox() {
  return useSyncExternalStore(
    (cb) => store.subscribeInbox(() => cb()),
    () => store.getInboxState(),
    () => EMPTY_INBOX_STATE,
  );
}

// Subscribes to provider config so the Toaster reacts to live changes of
// `maxVisible` / `pauseOnFocusLoss` / etc. instead of reading a stale value.
function useConfig() {
  return useSyncExternalStore(
    (cb) => store.subscribeConfig(cb),
    () => store.getConfig(),
    () => DEFAULT_CONFIG,
  );
}

// ─── Provider ────────────────────────────────────────────────

export interface EvoNotificationProviderProps {
  children: ReactNode;
  defaultAnchor?: EvoNotificationAnchor;
  maxVisible?: number;
  defaultDuration?: number;
  pauseOnFocusLoss?: boolean;
  /**
   * When true, `error` toasts stay until dismissed instead of auto-closing.
   * Recommended for accessibility — errors should not vanish on a timer.
   * A per-toast `duration` or `persistent` still overrides this.
   */
  persistErrors?: boolean;
  inboxItems?: EvoInboxItem[];
  onInboxChange?: (items: EvoInboxItem[]) => void;
}

export const EvoNotificationProvider = ({
  children,
  defaultAnchor = 'top-right',
  maxVisible = 3,
  defaultDuration = 4000,
  pauseOnFocusLoss = true,
  persistErrors = false,
  inboxItems,
  onInboxChange,
}: EvoNotificationProviderProps) => {
  // Push config into the store on every render where it changes.
  useLayoutEffect(() => {
    store.setConfig({ defaultAnchor, maxVisible, defaultDuration, pauseOnFocusLoss, persistErrors });
  }, [defaultAnchor, maxVisible, defaultDuration, pauseOnFocusLoss, persistErrors]);

  useLayoutEffect(() => {
    store.bindExternalInbox(inboxItems, onInboxChange);
  }, [inboxItems, onInboxChange]);

  return <>{children}</>;
};
EvoNotificationProvider.displayName = 'EvoNotificationProvider';

// ─── Toaster ─────────────────────────────────────────────────

export interface EvoNotificationToasterProps {
  anchor?: EvoNotificationAnchor;
  className?: string;
}

interface ToastRowProps {
  toast: InternalToast;
  // Effective anchor for this toast (per-toast override resolved against the
  // toaster default). Drives which way the depth offset leans.
  anchor: EvoNotificationAnchor;
  index: number;
  total: number;
  hovered: boolean;
  pausedExternally: boolean;
  reducedMotion: boolean;
}

const ToastRow = ({ toast, anchor, index, total, hovered, pausedExternally, reducedMotion }: ToastRowProps) => {
  const elapsedRef = useRef(0);
  const timerStartRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const restartRef = useRef(toast.restartKey);

  const exiting = toast.exiting ?? false;
  const paused = hovered || pausedExternally;
  const finite = Number.isFinite(toast.duration);

  // Phase 2 of removal: once the store flags this toast `exiting`, let the
  // CSS exit animation play, then drop it from the store. Close button,
  // action, auto-close and dismissAll all reach this path, so every removal
  // animates identically — and the timeout is cleaned up on unmount.
  useEffect(() => {
    if (!exiting) return;
    const t = window.setTimeout(
      () => store.removeToast(toast.id),
      reducedMotion ? 0 : EXIT_MS,
    );
    return () => window.clearTimeout(t);
  }, [exiting, reducedMotion, toast.id]);

  // Auto-dismiss countdown. Pauses on hover / window blur, resets when the
  // toast is re-pushed or updated (restartKey bump), and stops once exiting.
  useEffect(() => {
    if (restartRef.current !== toast.restartKey) {
      restartRef.current = toast.restartKey;
      elapsedRef.current = 0;
    }
    if (!finite || exiting) return;
    if (paused) {
      if (timerStartRef.current != null) {
        elapsedRef.current += Date.now() - timerStartRef.current;
        timerStartRef.current = null;
      }
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const remaining = Math.max(0, (toast.duration as number) - elapsedRef.current);
    timerStartRef.current = Date.now();
    timeoutRef.current = window.setTimeout(
      () => store.dismissToast(toast.id, 'auto'),
      remaining,
    );

    return () => {
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (timerStartRef.current != null) {
        elapsedRef.current += Date.now() - timerStartRef.current;
        timerStartRef.current = null;
      }
    };
  }, [paused, finite, exiting, toast.duration, toast.restartKey, toast.id]);

  // Stacked appearance: items behind the front fade and scale slightly,
  // expand on hover (Sonner-style).
  const depth = total - 1 - index;
  const baseScale = hovered ? 1 : Math.max(0.94, 1 - depth * 0.04);
  const baseTranslate = hovered ? depth * 8 : depth * 6;
  const baseOpacity = hovered ? 1 : Math.max(0.7, 1 - depth * 0.15);

  // Older cards sit behind the newest one and peek out *away* from the
  // anchored edge: downward (+Y) for top anchors, upward (-Y) for bottom
  // anchors. This must agree with the per-anchor flex-direction in the SCSS —
  // together they keep the newest toast flush against the anchored edge.
  const offsetSign = anchor.startsWith('bottom') ? 1 : -1;
  const style: CSSProperties = {
    transform: `translateY(${baseTranslate * offsetSign}px) scale(${baseScale})`,
    opacity: baseOpacity,
    zIndex: 1000 + index,
  };

  const dismissible = toast.dismissible ?? true;
  const icon = toast.icon ?? ICON_GLYPHS[toast.severity];
  const titleNode = toast.title ?? toast.message;
  const label = toastText(toast);
  const hasProgress = typeof toast.progress === 'number';
  const progressValue = hasProgress ? clamp01(toast.progress as number) : 0;

  // When the toast has plain-text content the Toaster's persistent live
  // region announces it, so the card itself is just a navigable `group`.
  // A JSX-only toast (no extractable text) keeps an in-place live role as
  // a fallback. The two paths are mutually exclusive — never double-announced.
  const announced = label !== '';

  return (
    <div
      className={cx(
        styles.toast,
        styles[`sev-${toast.severity}`],
        exiting && styles.exiting,
        reducedMotion && styles.noMotion,
        toast.className,
      )}
      style={style}
      role={announced ? 'group' : toast.severity === 'error' ? 'alert' : 'status'}
      aria-label={announced ? label : undefined}
    >
      <span className={styles.toastIcon} aria-hidden="true">{icon}</span>
      <div className={styles.toastBody}>
        {titleNode != null && (
          <div className={styles.toastTitle}>
            {titleNode}
            {toast.count > 1 && (
              <span className={styles.toastCount} aria-label={`repeated ${toast.count} times`}>
                ×{toast.count}
              </span>
            )}
          </div>
        )}
        {toast.description != null && (
          <div className={styles.toastDescription}>{toast.description}</div>
        )}
      </div>
      {toast.action && (
        <button
          type="button"
          className={styles.toastAction}
          onClick={(e) => {
            toast.action!.onClick(e);
            store.dismissToast(toast.id);
          }}
        >
          {toast.action.label}
        </button>
      )}
      {dismissible && (
        <button
          type="button"
          className={styles.toastClose}
          onClick={() => {
            store.dismissToast(toast.id);
          }}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      )}
      {hasProgress && (
        <div
          className={styles.toastProgressTrack}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={progressValue}
        >
          <div
            className={styles.toastProgressFill}
            style={{ transform: `scaleX(${progressValue})` }}
          />
        </div>
      )}
    </div>
  );
};

const ANCHORS: EvoNotificationAnchor[] = [
  'top-left', 'top-center', 'top-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];

// Identity of the Toaster currently allowed to render. Guards against two
// <EvoNotificationToaster> instances each drawing (and announcing) every
// toast — see B7.
let activeToasterOwner: symbol | null = null;

export const EvoNotificationToaster = ({ anchor, className }: EvoNotificationToasterProps) => {
  const all = useToasts();
  const { defaultAnchor, maxVisible, pauseOnFocusLoss } = useConfig();
  const fallback = anchor ?? defaultAnchor;

  const [hovered, setHovered] = useState<EvoNotificationAnchor | null>(null);
  const [windowFocused, setWindowFocused] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [primary, setPrimary] = useState(false);

  // Persistent screen-reader live region. A polite/assertive pair lives in
  // the portal at all times — injecting a fresh node that already carries
  // `aria-live` is announced unreliably across screen readers (B5).
  const [politeMsg, setPoliteMsg] = useState('');
  const [assertiveMsg, setAssertiveMsg] = useState('');
  const announcedRef = useRef<Set<string>>(new Set());

  const ownerRef = useRef<symbol | null>(null);
  if (!ownerRef.current) ownerRef.current = Symbol('evo-toaster');

  // Claim the single render slot; later instances render nothing.
  useEffect(() => {
    const me = ownerRef.current!;
    if (activeToasterOwner == null) {
      activeToasterOwner = me;
      setPrimary(true);
    } else if (activeToasterOwner !== me) {
      console.warn(
        '[EvoNotification] More than one <EvoNotificationToaster> is mounted; ' +
        'only the first renders. Remove the duplicate(s).',
      );
    }
    return () => {
      if (activeToasterOwner === me) activeToasterOwner = null;
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    if (!pauseOnFocusLoss) return;
    const onFocus = () => setWindowFocused(true);
    const onBlur = () => setWindowFocused(false);
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, [pauseOnFocusLoss]);

  // Announce newly-arrived toasts through the persistent live region.
  // Coalesced updates reuse an already-seen id, so they don't re-announce.
  useEffect(() => {
    const seen = announcedRef.current;
    const live = new Set<string>();
    for (const t of all) {
      live.add(t.id);
      if (seen.has(t.id) || t.exiting) continue;
      seen.add(t.id);
      const text = toastText(t);
      if (!text) continue;
      if (t.severity === 'error') setAssertiveMsg(text);
      else setPoliteMsg(text);
    }
    for (const id of seen) {
      if (!live.has(id)) seen.delete(id);
    }
  }, [all]);

  // Esc dismisses the newest live toast in the hovered/focused group.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && hovered != null) {
        const group = all.filter(
          (t) => !t.exiting && (t.anchor ?? fallback) === hovered,
        );
        if (group.length > 0) store.dismissToast(group[group.length - 1].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [all, fallback, hovered]);

  if (!mounted || typeof document === 'undefined') return null;
  if (!primary) return null;

  // Group by effective anchor.
  const grouped: Record<EvoNotificationAnchor, InternalToast[]> = {
    'top-left': [], 'top-center': [], 'top-right': [],
    'bottom-left': [], 'bottom-center': [], 'bottom-right': [],
  };
  for (const t of all) {
    const a = t.anchor ?? fallback;
    grouped[a].push(t);
  }

  return ReactDOM.createPortal(
    <div className={cx(styles.toasterRoot, className)} aria-label="Notifications">
      <div className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {politeMsg}
      </div>
      <div className={styles.srOnly} aria-live="assertive" aria-atomic="true">
        {assertiveMsg}
      </div>
      {ANCHORS.map((a) => {
        const group = grouped[a];
        if (group.length === 0) return null;
        const overflow = Math.max(0, group.length - maxVisible);
        // Clamp the start index: a bare `group.length - maxVisible` goes
        // negative when fewer than `maxVisible` toasts exist, and a negative
        // slice counts from the end — dropping the oldest toasts (B1).
        const visible = group.slice(Math.max(0, group.length - maxVisible));
        const isHovered = hovered === a;
        const pausedExt = !windowFocused;
        return (
          <div
            key={a}
            className={cx(styles.anchor, styles[`anchor-${a}`])}
            onMouseEnter={() => setHovered(a)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(a)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(null);
            }}
          >
            {overflow > 0 && (
              <div className={styles.overflowPill} aria-hidden="true">
                +{overflow} more
              </div>
            )}
            {visible.map((t, i) => (
              <ToastRow
                key={t.id}
                toast={t}
                anchor={a}
                index={i}
                total={visible.length}
                hovered={isHovered}
                pausedExternally={pausedExt}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        );
      })}
    </div>,
    document.body,
  );
};
EvoNotificationToaster.displayName = 'EvoNotificationToaster';

// ─── Bell ────────────────────────────────────────────────────

export interface EvoNotificationBellProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: 'solid' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  hideZero?: boolean;
  maxBadgeCount?: number;
  panelPlacement?: 'bottom-end' | 'bottom-start' | 'bottom' | 'top-end' | 'top-start';
  renderPanel?: 'popover' | 'none';
  panelTitle?: ReactNode;
  panelEmptyState?: ReactNode;
}

export const EvoNotificationBell = forwardRef<HTMLButtonElement, EvoNotificationBellProps>(
  function EvoNotificationBell(
    {
      variant = 'ghost',
      size = 'md',
      hideZero = true,
      maxBadgeCount = 99,
      panelPlacement = 'bottom-end',
      renderPanel = 'popover',
      panelTitle,
      panelEmptyState,
      className,
      onClick,
      ...rest
    },
    ref,
  ) {
    const { unread } = useInbox();
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const panelId = useId();

    useEffect(() => {
      if (!open || renderPanel !== 'popover') return;
      const onDocClick = (e: MouseEvent) => {
        if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('mousedown', onDocClick);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onDocClick);
        document.removeEventListener('keydown', onKey);
      };
    }, [open, renderPanel]);

    const badgeText = unread > maxBadgeCount ? `${maxBadgeCount}+` : String(unread);
    const showBadge = unread > 0 || !hideZero;

    return (
      <div ref={wrapperRef} className={styles.bellWrapper}>
        <button
          ref={ref}
          type="button"
          className={cx(
            styles.bell,
            styles[`bell-${variant}`],
            styles[`bell-${size}`],
            open && styles.bellOpen,
            className,
          )}
          aria-label={
            unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'
          }
          aria-haspopup={renderPanel === 'popover' ? 'dialog' : undefined}
          aria-expanded={renderPanel === 'popover' ? open : undefined}
          aria-controls={renderPanel === 'popover' ? panelId : undefined}
          onClick={(e) => {
            onClick?.(e);
            if (renderPanel === 'popover') setOpen((v) => !v);
          }}
          {...rest}
        >
          <BellGlyph />
          {showBadge && (
            <span className={cx(styles.bellBadge, unread === 0 && styles.bellBadgeZero)}>
              {badgeText}
            </span>
          )}
        </button>
        {renderPanel === 'popover' && open && (
          <div
            id={panelId}
            className={cx(styles.bellPanelHost, styles[`place-${panelPlacement}`])}
          >
            <EvoNotificationPanel
              open
              onClose={() => setOpen(false)}
              title={panelTitle}
              emptyState={panelEmptyState}
            />
          </div>
        )}
      </div>
    );
  },
);
EvoNotificationBell.displayName = 'EvoNotificationBell';

const BellGlyph = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

// ─── Panel ───────────────────────────────────────────────────

export interface EvoNotificationPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  emptyState?: ReactNode;
  loading?: boolean;
  error?: ReactNode;
  showMarkAllRead?: boolean;
  maxHeight?: number | string;
}

export const EvoNotificationPanel = forwardRef<HTMLDivElement, EvoNotificationPanelProps>(
  function EvoNotificationPanel(
    {
      open = true,
      onClose,
      title = 'Notifications',
      emptyState,
      loading = false,
      error,
      showMarkAllRead = true,
      maxHeight = 480,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const { items, unread } = useInbox();
    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cx(styles.panel, className)}
        role="dialog"
        aria-label={typeof title === 'string' ? title : 'Notifications'}
        style={style}
        {...rest}
      >
        <header className={styles.panelHeader}>
          <div className={styles.panelTitle}>{title}</div>
          <div className={styles.panelHeaderActions}>
            {showMarkAllRead && unread > 0 && (
              <button
                type="button"
                className={styles.panelMarkAll}
                onClick={() => store.markAllRead()}
              >
                Mark all read
              </button>
            )}
            {onClose && (
              <button
                type="button"
                className={styles.panelClose}
                onClick={onClose}
                aria-label="Close notifications"
              >
                ✕
              </button>
            )}
          </div>
        </header>
        <div
          className={styles.panelBody}
          style={{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }}
        >
          {loading ? (
            <div className={styles.panelState}>Loading…</div>
          ) : error ? (
            <div className={cx(styles.panelState, styles.panelStateError)}>
              {typeof error === 'string' ? error : error}
            </div>
          ) : items.length === 0 ? (
            <div className={styles.panelState}>
              {emptyState ?? <DefaultEmptyState />}
            </div>
          ) : (
            <ul className={styles.itemList}>
              {items.map((item) => (
                <li key={item.id}>
                  <EvoNotificationItem item={item} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  },
);
EvoNotificationPanel.displayName = 'EvoNotificationPanel';

const DefaultEmptyState = () => (
  <div className={styles.emptyState}>
    <div className={styles.emptyIcon} aria-hidden="true">
      <BellGlyph />
    </div>
    <div className={styles.emptyTitle}>You're all caught up</div>
    <div className={styles.emptyHint}>New notifications will appear here.</div>
  </div>
);

// ─── Item ────────────────────────────────────────────────────

export interface EvoNotificationItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  item: EvoInboxItem;
  onClick?: (item: EvoInboxItem) => void;
}

export const EvoNotificationItem = forwardRef<HTMLDivElement, EvoNotificationItemProps>(
  function EvoNotificationItem({ item, onClick, className, ...rest }, ref) {
    // Seed with the item's own timestamp (deterministic) so server and
    // client render identical relative text; switch to the real clock once
    // mounted. Seeding with `Date.now()` instead causes a hydration mismatch.
    const [now, setNow] = useState(item.timestamp);

    useEffect(() => {
      setNow(Date.now());
      const id = window.setInterval(() => setNow(Date.now()), 60_000);
      return () => window.clearInterval(id);
    }, []);

    const handleClick = useCallback(() => {
      (onClick ?? item.onClick)?.(item);
      if (!item.read) store.markRead(item.id);
    }, [item, onClick]);

    const handleKey = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      },
      [handleClick],
    );

    const interactive = Boolean(onClick ?? item.onClick);
    const icon = item.icon ?? ICON_GLYPHS[item.severity];

    return (
      <div
        ref={ref}
        className={cx(
          styles.item,
          !item.read && styles.itemUnread,
          interactive && styles.itemInteractive,
          className,
        )}
        role={interactive ? 'button' : 'group'}
        tabIndex={interactive ? 0 : undefined}
        onClick={interactive ? handleClick : undefined}
        onKeyDown={interactive ? handleKey : undefined}
        {...rest}
      >
        <span className={styles.itemUnreadDot} aria-hidden={item.read} />
        <div className={cx(styles.itemMedia, styles[`sev-${item.severity}`])} aria-hidden="true">
          {item.avatarUrl ? (
            <img src={item.avatarUrl} alt="" className={styles.itemAvatar} />
          ) : (
            <span className={styles.itemMediaGlyph}>{icon}</span>
          )}
        </div>
        <div className={styles.itemBody}>
          <div className={styles.itemTitle}>{item.title}</div>
          {item.description != null && (
            <div className={styles.itemDescription}>{item.description}</div>
          )}
          <div className={styles.itemMeta}>
            <span className={styles.itemTimestamp}>{formatRelative(item.timestamp, now)}</span>
            {item.action && (
              <button
                type="button"
                className={styles.itemAction}
                onClick={(e) => {
                  e.stopPropagation();
                  item.action!.onClick(e);
                }}
              >
                {item.action.label}
              </button>
            )}
          </div>
        </div>
        <button
          type="button"
          className={styles.itemDismiss}
          onClick={(e) => {
            e.stopPropagation();
            store.removeInbox(item.id);
          }}
          aria-label="Remove notification"
        >
          ✕
        </button>
      </div>
    );
  },
);
EvoNotificationItem.displayName = 'EvoNotificationItem';

// ─── Hook (optional convenience) ─────────────────────────────

export function useEvoInbox() {
  return useInbox();
}

// ─── Namespace export ────────────────────────────────────────

type EvoNotificationNS = {
  Provider: typeof EvoNotificationProvider;
  Toaster: typeof EvoNotificationToaster;
  Bell: typeof EvoNotificationBell;
  Panel: typeof EvoNotificationPanel;
  Item: typeof EvoNotificationItem;
};

export const EvoNotification: EvoNotificationNS = {
  Provider: EvoNotificationProvider,
  Toaster: EvoNotificationToaster,
  Bell: EvoNotificationBell,
  Panel: EvoNotificationPanel,
  Item: EvoNotificationItem,
};

