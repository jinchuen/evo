import type { ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────
// Docs sidebar icons — inline, zero-dependency line icons, one per nav row.
//
// Why these live here (not in evo-ui): @justin_evo/evo-ui is a zero runtime
// dependency package (CLAUDE.md §7). Icons are *docs data*, passed into the
// already-existing `icon` prop on EvoNav.Item, so the library ships no icon
// set and gains no dependency. Strokes use `currentColor`, so EvoNav's own
// idle / hover / active colors drive the icon — no per-state styling needed.
//
// Keyed by route path so Layout can look up `navIcons[item.path]`.
// ─────────────────────────────────────────────────────────────────────

const I = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

export const navIcons: Record<string, ReactNode> = {
  // ── Getting Started ──
  '/': (
    <I>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    </I>
  ),
  '/changelog': (
    <I>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3 8" />
      <path d="M3 4v4h4" />
      <path d="M12 8v4l3 1.8" />
    </I>
  ),

  // ── Foundations ──
  '/theming': (
    <I>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" stroke="none" />
    </I>
  ),
  '/utilities': (
    <I>
      <path d="M4 7h9" />
      <path d="M17 7h3" />
      <circle cx="15" cy="7" r="2" />
      <path d="M4 17h3" />
      <path d="M11 17h9" />
      <circle cx="9" cy="17" r="2" />
    </I>
  ),

  // ── For AI ──
  '/ai': (
    <I>
      <path d="M12 3.5 13.6 8 18 9.6 13.6 11.2 12 15.6 10.4 11.2 6 9.6 10.4 8Z" />
      <path d="M18 14l.7 1.9 1.9.7-1.9.7L18 19.9l-.7-1.9-1.9-.7 1.9-.7Z" />
    </I>
  ),

  // ── Forms ──
  '/components/button': (
    <I>
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <path d="M8.5 12h7" />
    </I>
  ),
  '/components/input': (
    <I>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 10v4" />
      <path d="M10 12h6" />
    </I>
  ),
  '/components/rich-text-area': (
    <I>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9h10" />
      <path d="M7 13h7" />
      <path d="M7 17h4" />
    </I>
  ),
  '/components/checkbox': (
    <I>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <path d="M8.5 12.3l2.4 2.4 4.6-5" />
    </I>
  ),
  '/components/radio': (
    <I>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
    </I>
  ),
  '/components/select': (
    <I>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M9 11l3 3 3-3" />
    </I>
  ),
  '/components/tree-select': (
    <I>
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <rect x="3" y="15" width="6" height="4" rx="1" />
      <rect x="15" y="15" width="6" height="4" rx="1" />
      <path d="M12 7v3.5M6 15v-2.5h12V15" />
    </I>
  ),
  '/components/autocomplete': (
    <I>
      <path d="M4 7.5h11" />
      <path d="M4 12h7" />
      <circle cx="15.5" cy="14.5" r="3.5" />
      <path d="m18.2 17.2 2.3 2.3" />
    </I>
  ),
  '/components/toggle': (
    <I>
      <rect x="3" y="7" width="18" height="10" rx="5" />
      <circle cx="16" cy="12" r="3" fill="currentColor" stroke="none" />
    </I>
  ),
  '/components/form': (
    <I>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M9 3h6v3.5H9z" />
      <path d="M8 12h8M8 16h5" />
    </I>
  ),

  // ── Layout ──
  '/components/stack': (
    <I>
      <rect x="3" y="4" width="18" height="4" rx="1.2" />
      <rect x="3" y="10" width="18" height="4" rx="1.2" />
      <rect x="3" y="16" width="18" height="4" rx="1.2" />
    </I>
  ),
  '/components/grid': (
    <I>
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </I>
  ),
  '/components/container': (
    <I>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <rect x="7" y="9" width="10" height="6" rx="1" />
    </I>
  ),
  '/components/divider': (
    <I>
      <path d="M4 12h4" />
      <path d="M11 12h2" />
      <path d="M16 12h4" />
    </I>
  ),

  // ── Navigation ──
  '/components/nav': (
    <I>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d="M5.5 9h1.5M5.5 12h1.5" />
    </I>
  ),
  '/components/topnav': (
    <I>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M6.5 6.5h.01M9 6.5h.01" />
    </I>
  ),
  '/components/breadcrumb': (
    <I>
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <path d="M9 9l3 3-3 3" />
      <path d="M14.5 9l3 3-3 3" />
    </I>
  ),
  '/components/tabs': (
    <I>
      <rect x="3" y="8" width="18" height="11" rx="2" />
      <path d="M7.5 8V6a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
    </I>
  ),
  '/components/pagination': (
    <I>
      <path d="M4.5 9 2 12l2.5 3" />
      <circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="13" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <path d="M19.5 9 22 12l-2.5 3" />
    </I>
  ),
  '/components/command-palette': (
    <I>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M8 9.5 10.5 12 8 14.5" />
      <path d="M12.5 15H16" />
    </I>
  ),

  // ── Data Display ──
  '/components/card': (
    <I>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </I>
  ),
  '/components/table': (
    <I>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M3 14.5h18M9 5v14M15 5v14" />
    </I>
  ),
  '/components/badge': (
    <I>
      <path d="M3.5 8.5a2 2 0 0 1 2-2H13l7.5 5.5L13 17.5H5.5a2 2 0 0 1-2-2Z" />
      <circle cx="8" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </I>
  ),
  '/components/skeleton': (
    <I>
      <path d="M4 6.5h16" />
      <path d="M4 11.5h10" />
      <path d="M4 16.5h13" />
    </I>
  ),

  // ── Feedback ──
  '/components/alert': (
    <I>
      <path d="M12 4 3 19.5h18L12 4Z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </I>
  ),
  '/components/modal': (
    <I>
      <rect x="3" y="5" width="18" height="14" rx="2" opacity="0.45" />
      <rect x="7" y="8.5" width="10" height="8" rx="1.5" />
    </I>
  ),
  '/components/tooltip': (
    <I>
      <path d="M5 5h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-5l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    </I>
  ),
  '/components/notification': (
    <I>
      <path d="M6 9.5a6 6 0 0 1 12 0c0 4.5 2 5.5 2 5.5H4s2-1 2-5.5Z" />
      <path d="M10.3 19a1.8 1.8 0 0 0 3.4 0" />
    </I>
  ),

  // ── Media ──
  '/components/image-cropper': (
    <I>
      <path d="M7 2v14a1 1 0 0 0 1 1h14" />
      <path d="M2 7h14a1 1 0 0 1 1 1v14" />
    </I>
  ),
}

// Fallback for any future row added before its icon — keeps the rhythm intact.
export const navIconFallback: ReactNode = (
  <I>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8.2h.01" />
    <path d="M12 11.5v4.3" />
  </I>
)
