import { useState } from 'react'
import {
  EvoButton,
  EvoInput,
  EvoCheckbox,
  EvoRadio,
  EvoSelect,
  EvoToggle,
  EvoBadge,
  EvoAlert,
  EvoSkeleton,
  EvoDivider,
  EvoStack,
  EvoBreadcrumb,
  EvoTabs,
  EvoPagination,
} from '@justin_evo/evo-ui'

/* =====================================================================
 * Compact previews shown on the homepage component grid.
 * Each preview must:
 *   - Render in ~80px of vertical space
 *   - Read theme tokens so it auto-themes
 *   - Be non-interactive (pointer-events disabled by the wrapper) so
 *     clicking the card navigates to the docs page
 * ===================================================================== */

const tabletStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--evo-color-text-muted)',
}

const mockSurface: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.4rem 0.55rem',
  background: 'var(--evo-color-surface)',
  border: '1px solid var(--evo-color-border)',
  borderRadius: '6px',
  fontSize: '0.7rem',
  color: 'var(--evo-color-text-secondary)',
}

// ---------- Forms ----------

export const ButtonPreview = () => (
  <EvoStack direction="row" gap="0.4rem">
    <EvoButton label="Button" size="sm" />
    <EvoButton label="Ghost" size="sm" variant="ghost" />
  </EvoStack>
)

export const InputPreview = () => (
  <EvoInput placeholder="Type here…" size="sm" />
)

export const CheckboxPreview = () => {
  const [v, setV] = useState(true)
  return (
    <EvoStack direction="row" gap="0.6rem" align="center">
      <EvoCheckbox checked={v} onChange={(e) => setV(e.target.checked)} label="Option" />
      <EvoCheckbox checked={false} readOnly label="Off" />
    </EvoStack>
  )
}

export const RadioPreview = () => (
  <EvoStack direction="row" gap="0.6rem" align="center">
    <EvoRadio value="a" label="One" />
    <EvoRadio value="b" label="Two" />
  </EvoStack>
)

export const SelectPreview = () => (
  <EvoSelect
    size="sm"
    placeholder="Choose…"
    options={[
      { value: '1', label: 'Apple' },
      { value: '2', label: 'Banana' },
    ]}
  />
)

export const TreeSelectPreview = () => (
  <div style={mockSurface}>
    <span>Select node…</span>
    <span style={{ marginLeft: 'auto', opacity: 0.6 }}>▾</span>
  </div>
)

export const TogglePreview = () => {
  const [v, setV] = useState(true)
  return (
    <EvoStack direction="row" gap="0.6rem" align="center">
      <EvoToggle checked={v} onChange={setV} size="sm" />
      <EvoToggle checked={!v} onChange={(x) => setV(!x)} size="sm" />
    </EvoStack>
  )
}

export const FormPreview = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%' }}>
    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--evo-color-text)' }}>Email</span>
    <EvoInput placeholder="you@example.com" size="sm" />
  </div>
)

// ---------- Layout ----------

const block = (size = 16): React.CSSProperties => ({
  width: size,
  height: size,
  background: 'var(--evo-color-primary)',
  borderRadius: 3,
  opacity: 0.85,
})

export const StackPreview = () => (
  <EvoStack direction="row" gap="0.45rem" align="center">
    <span style={block()} />
    <span style={{ ...block(), opacity: 0.6 }} />
    <span style={{ ...block(), opacity: 0.4 }} />
  </EvoStack>
)

export const GridPreview = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 4,
      width: 70,
      height: 46,
    }}
  >
    {Array.from({ length: 6 }).map((_, i) => (
      <span key={i} style={{ background: 'var(--evo-color-primary)', opacity: 0.85 - i * 0.1, borderRadius: 2 }} />
    ))}
  </div>
)

export const ContainerPreview = () => (
  <div
    style={{
      width: '100%',
      padding: '0.5rem 0.75rem',
      border: '1px dashed var(--evo-color-border-strong)',
      borderRadius: 6,
      fontSize: '0.7rem',
      color: 'var(--evo-color-text-muted)',
      textAlign: 'center',
    }}
  >
    Centered content
  </div>
)

export const DividerPreview = () => (
  <div style={{ width: '100%' }}>
    <EvoDivider label="Section" />
  </div>
)

// ---------- Navigation ----------

const navItem = (active: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  padding: '0.25rem 0.5rem',
  fontSize: '0.7rem',
  borderRadius: 4,
  background: active ? 'color-mix(in srgb, var(--evo-color-primary) 14%, transparent)' : 'transparent',
  color: active ? 'var(--evo-color-primary)' : 'var(--evo-color-text-secondary)',
  fontWeight: active ? 600 : 500,
})

export const NavPreview = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
    <span style={navItem(true)}>● Dashboard</span>
    <span style={navItem(false)}>○ Settings</span>
  </div>
)

export const TopNavPreview = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.35rem 0.55rem',
      background: 'var(--evo-color-surface)',
      border: '1px solid var(--evo-color-border)',
      borderRadius: 6,
      width: '100%',
      fontSize: '0.7rem',
    }}
  >
    <strong style={{ color: 'var(--evo-color-primary)' }}>Logo</strong>
    <span style={{ color: 'var(--evo-color-text-secondary)' }}>Home</span>
    <span style={{ color: 'var(--evo-color-primary)', fontWeight: 600 }}>Docs</span>
  </div>
)

export const BreadcrumbPreview = () => (
  <div style={{ fontSize: '0.75rem' }}>
    <EvoBreadcrumb>
      <EvoBreadcrumb.Item>Docs</EvoBreadcrumb.Item>
      <EvoBreadcrumb.Item current>Overview</EvoBreadcrumb.Item>
    </EvoBreadcrumb>
  </div>
)

export const TabsPreview = () => (
  <EvoTabs defaultTab="a">
    <EvoTabs.List>
      <EvoTabs.Tab id="a">Tab 1</EvoTabs.Tab>
      <EvoTabs.Tab id="b">Tab 2</EvoTabs.Tab>
    </EvoTabs.List>
  </EvoTabs>
)

export const PaginationPreview = () => (
  <EvoPagination total={50} page={2} pageSize={10} onChange={() => {}} />
)

// ---------- Data display ----------

export const CardPreview = () => (
  <div
    style={{
      width: 100,
      height: 60,
      borderRadius: 8,
      background: 'linear-gradient(145deg, var(--evo-color-surface-elevated), var(--evo-color-surface))',
      border: '1px solid var(--evo-color-border)',
      boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)',
      padding: '0.4rem 0.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--evo-color-text)' }}>Card</span>
    <span style={tabletStyle}>Subtitle</span>
  </div>
)

export const TablePreview = () => (
  <div
    style={{
      width: '100%',
      border: '1px solid var(--evo-color-border)',
      borderRadius: 6,
      overflow: 'hidden',
      fontSize: '0.7rem',
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--evo-color-surface-sunken)',
        padding: '0.25rem 0.5rem',
        color: 'var(--evo-color-text-muted)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        fontSize: '0.6rem',
      }}
    >
      <span>Name</span><span>Role</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0.25rem 0.5rem', borderTop: '1px solid var(--evo-color-border-subtle)' }}>
      <span style={{ color: 'var(--evo-color-text)' }}>Ada</span>
      <span style={{ color: 'var(--evo-color-text-secondary)' }}>Eng</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0.25rem 0.5rem', borderTop: '1px solid var(--evo-color-border-subtle)' }}>
      <span style={{ color: 'var(--evo-color-text)' }}>Linus</span>
      <span style={{ color: 'var(--evo-color-text-secondary)' }}>OS</span>
    </div>
  </div>
)

export const BadgePreview = () => (
  <EvoStack direction="row" gap="0.35rem" align="center">
    <EvoBadge severity="primary" variant="subtle">New</EvoBadge>
    <EvoBadge severity="success" variant="subtle">OK</EvoBadge>
    <EvoBadge severity="warning" variant="subtle">3</EvoBadge>
  </EvoStack>
)

export const SkeletonPreview = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
    <EvoSkeleton width="100%" height="0.5rem" animated />
    <EvoSkeleton width="70%"  height="0.5rem" animated />
    <EvoSkeleton width="45%"  height="0.5rem" animated />
  </div>
)

// ---------- Feedback ----------

export const AlertPreview = () => (
  <EvoAlert type="success">
    <span style={{ fontSize: '0.75rem' }}>Saved successfully</span>
  </EvoAlert>
)

export const ModalPreview = () => (
  <div
    style={{
      position: 'relative',
      width: 110,
      height: 68,
      background: 'var(--evo-color-surface-elevated)',
      border: '1px solid var(--evo-color-border)',
      borderRadius: 8,
      boxShadow: '0 12px 32px rgb(0 0 0 / 0.18)',
      padding: '0.45rem 0.55rem',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <strong style={{ fontSize: '0.7rem', color: 'var(--evo-color-text)' }}>Confirm?</strong>
      <span style={{ color: 'var(--evo-color-text-muted)', fontSize: '0.65rem' }}>×</span>
    </div>
    <span style={tabletStyle}>This is a dialog.</span>
  </div>
)

export const TooltipPreview = () => (
  <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
    <span
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--evo-color-surface-elevated)',
        border: '1px solid var(--evo-color-border)',
        color: 'var(--evo-color-text)',
        fontSize: '0.65rem',
        padding: '0.2rem 0.45rem',
        borderRadius: 4,
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 10px rgb(0 0 0 / 0.12)',
      }}
    >
      Tooltip
    </span>
    <span style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid var(--evo-color-border)', position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)' }} />
    <EvoButton label="Hover" size="sm" variant="outline" />
  </div>
)

// ---------- Newly added previews ----------

export const RichTextAreaPreview = () => (
  <div
    style={{
      width: '100%',
      maxWidth: 220,
      background: 'var(--evo-color-surface)',
      border: '1px solid var(--evo-color-border)',
      borderRadius: 6,
      overflow: 'hidden',
      fontSize: '0.65rem',
    }}
  >
    <div
      style={{
        display: 'flex',
        gap: '0.25rem',
        padding: '0.3rem 0.4rem',
        borderBottom: '1px solid var(--evo-color-border)',
        background: 'var(--evo-color-surface-sunken)',
      }}
    >
      <strong style={{ padding: '0 0.2rem' }}>B</strong>
      <em style={{ padding: '0 0.2rem' }}>I</em>
      <span style={{ padding: '0 0.2rem', textDecoration: 'underline' }}>U</span>
      <span style={{ marginLeft: 'auto', color: 'var(--evo-color-text-muted)' }}>H1</span>
    </div>
    <div style={{ padding: '0.4rem 0.5rem', color: 'var(--evo-color-text)' }}>
      Type something <strong>bold</strong>…
    </div>
  </div>
)

export const ImageCropperPreview = () => (
  <div
    style={{
      width: 130,
      height: 80,
      position: 'relative',
      borderRadius: 6,
      overflow: 'hidden',
      background:
        'linear-gradient(135deg, color-mix(in srgb, var(--evo-color-primary) 60%, transparent), color-mix(in srgb, var(--evo-color-info) 60%, transparent))',
      border: '1px solid var(--evo-color-border)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: '12px 16px',
        border: '1.5px dashed white',
        borderRadius: 3,
        boxShadow: '0 0 0 9999px rgb(0 0 0 / 0.35)',
      }}
    />
  </div>
)

export const CommandPalettePreview = () => (
  <div
    style={{
      width: '100%',
      maxWidth: 220,
      background: 'var(--evo-color-surface-elevated)',
      border: '1px solid var(--evo-color-border)',
      borderRadius: 8,
      overflow: 'hidden',
      fontSize: '0.7rem',
      boxShadow: '0 8px 16px -8px rgb(0 0 0 / 0.25)',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.4rem 0.55rem',
        borderBottom: '1px solid var(--evo-color-border)',
      }}
    >
      <span style={{ color: 'var(--evo-color-text-muted)' }}>⌕</span>
      <span style={{ color: 'var(--evo-color-text-muted)' }}>Search…</span>
      <kbd
        style={{
          marginLeft: 'auto',
          fontSize: '0.55rem',
          padding: '0.05rem 0.3rem',
          border: '1px solid var(--evo-color-border)',
          borderRadius: 3,
          color: 'var(--evo-color-text-muted)',
        }}
      >
        ⌘K
      </kbd>
    </div>
    <div style={{ padding: '0.3rem 0.55rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'var(--evo-color-primary)',
          }}
        />
        New file
      </div>
    </div>
  </div>
)

export const ToastPreview = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.45rem',
      padding: '0.4rem 0.6rem',
      background: 'var(--evo-color-surface-elevated)',
      backgroundImage: 'linear-gradient(color-mix(in srgb, var(--evo-color-success) 12%, transparent), color-mix(in srgb, var(--evo-color-success) 12%, transparent))',
      border: '1px solid color-mix(in srgb, var(--evo-color-success) 35%, transparent)',
      borderRadius: 6,
      boxShadow: '0 8px 24px rgb(0 0 0 / 0.15)',
      fontSize: '0.7rem',
      color: 'var(--evo-color-text)',
    }}
  >
    <span
      style={{
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: 'var(--evo-color-success)',
        color: 'var(--evo-color-success-fg)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.6rem',
        fontWeight: 700,
      }}
    >
      ✓
    </span>
    Saved
  </div>
)
