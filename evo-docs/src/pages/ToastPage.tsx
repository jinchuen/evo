import { EvoButton, EvoDivider } from '@justin_evo/evo-ui'
import { useToast } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function ToastPage() {
  const { toast } = useToast()

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoToast</h1>
        <p className="docs-page-desc">
          Non-blocking notification toasts rendered via a portal. Requires wrapping your app
          with EvoToastProvider and using the useToast hook to trigger them.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoToastProvider</span>, <span>useToast</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Interactive Demo</div>
        <div className="docs-preview">
          <EvoButton
            label="Success"
            severity="success"
            onClick={() => toast('Changes saved successfully!', 'success')}
          />
          <EvoButton
            label="Error"
            severity="danger"
            onClick={() => toast('Something went wrong. Please try again.', 'error')}
          />
          <EvoButton
            label="Warning"
            severity="warning"
            onClick={() => toast('Your session will expire soon.', 'warning')}
          />
          <EvoButton
            label="Info"
            severity="info"
            onClick={() => toast('A new version is available.', 'info')}
          />
        </div>
        <CodeBlock code={`function MyComponent() {
  const { toast } = useToast()

  return (
    <button onClick={() => toast('Saved!', 'success')}>
      Save
    </button>
  )
}`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Custom Duration</div>
        <div className="docs-preview">
          <EvoButton
            label="Show for 8s"
            variant="outline"
            onClick={() => toast('This toast stays for 8 seconds.', 'info', 8000)}
          />
          <EvoButton
            label="Show for 1s"
            variant="outline"
            onClick={() => toast('Quick!', 'success', 1000)}
          />
        </div>
        <CodeBlock code={`// toast(message, type?, duration?)
toast('This stays for 8 seconds.', 'info', 8000)
toast('Quick!', 'success', 1000)`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Setup</div>
        <CodeBlock code={`// main.tsx — wrap your app once
import { EvoToastProvider } from '@justin_evo/evo-ui'

createRoot(document.getElementById('root')!).render(
  <EvoToastProvider>
    <App />
  </EvoToastProvider>
)`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">API Reference</div>
        <PropsTable props={[
          { prop: 'EvoToastProvider — children', type: 'ReactNode', required: true, description: 'Wrap your app to enable toast functionality.' },
          { prop: 'useToast() → toast', type: '(message, type?, duration?) => void', description: 'Trigger a toast notification. Must be called inside EvoToastProvider.' },
          { prop: 'message', type: 'string', required: true, description: 'Toast message text.' },
          { prop: 'type', type: "'success' | 'error' | 'warning' | 'info'", default: "'info'", description: 'Semantic type determining icon and color.' },
          { prop: 'duration', type: 'number', default: '4000', description: 'Auto-dismiss duration in milliseconds.' },
        ]} />
      </div>
    </div>
  )
}
