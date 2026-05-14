import { useState } from 'react'
import { EvoModal, EvoButton, EvoStack, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function ModalPage() {
  const [basicOpen, setBasicOpen] = useState(false)
  const [smOpen, setSmOpen] = useState(false)
  const [lgOpen, setLgOpen] = useState(false)
  const [fsOpen, setFsOpen] = useState(false)

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoModal</h1>
        <p className="docs-page-desc">
          An accessible dialog rendered in a portal. Closes on ESC or backdrop click.
          Compose with EvoModal.Header, EvoModal.Body, and EvoModal.Footer.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoModal</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic Modal</div>
        <div className="docs-preview">
          <EvoButton label="Open Modal" onClick={() => setBasicOpen(true)} />
        </div>
        <EvoModal open={basicOpen} onClose={() => setBasicOpen(false)}>
          <EvoModal.Header onClose={() => setBasicOpen(false)}>
            Confirm Action
          </EvoModal.Header>
          <EvoModal.Body>
            <p style={{ color: 'var(--docs-text-muted)', margin: 0 }}>
              Are you sure you want to proceed? This action cannot be undone.
            </p>
          </EvoModal.Body>
          <EvoModal.Footer>
            <EvoStack direction="row" gap="0.75rem" justify="end">
              <EvoButton label="Cancel" variant="outline" severity="secondary" onClick={() => setBasicOpen(false)} />
              <EvoButton label="Confirm" severity="danger" onClick={() => setBasicOpen(false)} />
            </EvoStack>
          </EvoModal.Footer>
        </EvoModal>
        <CodeBlock code={`const [open, setOpen] = useState(false)

<EvoButton label="Open Modal" onClick={() => setOpen(true)} />

<EvoModal open={open} onClose={() => setOpen(false)}>
  <EvoModal.Header onClose={() => setOpen(false)}>
    Confirm Action
  </EvoModal.Header>
  <EvoModal.Body>
    <p>Are you sure you want to proceed?</p>
  </EvoModal.Body>
  <EvoModal.Footer>
    <EvoButton label="Cancel" variant="outline" onClick={() => setOpen(false)} />
    <EvoButton label="Confirm" severity="danger" onClick={() => setOpen(false)} />
  </EvoModal.Footer>
</EvoModal>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Sizes</div>
        <div className="docs-preview">
          <EvoButton label="Small" size="sm" onClick={() => setSmOpen(true)} />
          <EvoButton label="Large" size="sm" onClick={() => setLgOpen(true)} />
          <EvoButton label="Fullscreen" size="sm" onClick={() => setFsOpen(true)} />
        </div>

        {[
          { open: smOpen, setOpen: setSmOpen, size: 'sm' as const, label: 'Small Modal' },
          { open: lgOpen, setOpen: setLgOpen, size: 'lg' as const, label: 'Large Modal' },
          { open: fsOpen, setOpen: setFsOpen, size: 'fullscreen' as const, label: 'Fullscreen Modal' },
        ].map(({ open, setOpen, size, label }) => (
          <EvoModal key={size} open={open} onClose={() => setOpen(false)} size={size}>
            <EvoModal.Header onClose={() => setOpen(false)}>{label}</EvoModal.Header>
            <EvoModal.Body>
              <p style={{ color: 'var(--docs-text-muted)', margin: 0 }}>
                This modal uses <code style={{ color: 'var(--docs-accent)', background: 'color-mix(in srgb, var(--docs-accent) 10%, transparent)', padding: '0 4px', borderRadius: 3 }}>size="{size}"</code>.
              </p>
            </EvoModal.Body>
            <EvoModal.Footer>
              <EvoButton label="Close" onClick={() => setOpen(false)} />
            </EvoModal.Footer>
          </EvoModal>
        ))}

        <CodeBlock code={`<EvoModal open={open} onClose={close} size="sm">...</EvoModal>
<EvoModal open={open} onClose={close} size="md">...</EvoModal>
<EvoModal open={open} onClose={close} size="lg">...</EvoModal>
<EvoModal open={open} onClose={close} size="fullscreen">...</EvoModal>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">EvoModal Props</div>
        <PropsTable props={[
          { prop: 'open', type: 'boolean', required: true, description: 'Controls modal visibility.' },
          { prop: 'onClose', type: '() => void', required: true, description: 'Called on ESC key or backdrop click.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Modal content.' },
          { prop: 'size', type: "'sm' | 'md' | 'lg' | 'fullscreen'", default: "'md'", description: 'Modal width.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Sub-component Props</div>
        <PropsTable props={[
          { prop: 'EvoModal.Header — onClose', type: '() => void', description: 'If provided, renders a close button in the header.' },
          { prop: 'EvoModal.Body — children', type: 'ReactNode', required: true, description: 'Scrollable body content.' },
          { prop: 'EvoModal.Footer — children', type: 'ReactNode', required: true, description: 'Footer content (typically action buttons).' },
        ]} />
      </div>
    </div>
  )
}
