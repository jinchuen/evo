import { EvoButton, EvoDivider, EvoNotification, EvoStack, evoNotify } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function NotificationPage() {
  const fakeSave = () =>
    new Promise<{ name: string }>((resolve, reject) => {
      window.setTimeout(() => {
        Math.random() > 0.4 ? resolve({ name: 'invoice-2026-05.pdf' }) : reject(new Error('Network timeout'))
      }, 1400)
    })

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoNotification</h1>
        <p className="docs-page-desc">
          A unified, global notification system. Combines transient <strong>toasts</strong> with a
          persistent <strong>notification center</strong> (bell + panel). One singleton API,
          callable from any file — no hook required.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoNotification, evoNotify</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Why EvoNotification</div>
        <p className="docs-section-desc">
          Three things any product needs to communicate with users — but they belong together,
          not in three different libraries:
        </p>
        <ul className="docs-list">
          <li><strong>Toast</strong> — transient feedback (saved, failed, copied). Lives here.</li>
          <li><strong>Notification center</strong> — accumulated, with unread state and a bell. Lives here.</li>
          <li><strong>In-page banner</strong> — declarative, persistent layout. Use <code>EvoAlert</code> for this.</li>
        </ul>
        <p className="docs-section-desc">
          The singleton <code>evoNotify</code> means you call from anywhere — event handlers,
          async functions, even a WebSocket <code>onmessage</code> outside the React tree.
        </p>
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Setup (once, at the app root)</div>
        <CodeBlock code={`import { EvoNotification } from '@justin_evo/evo-ui'

export default function App() {
  return (
    <EvoNotification.Provider defaultAnchor="top-right" maxVisible={3}>
      <YourApp />
      <EvoNotification.Toaster />
    </EvoNotification.Provider>
  )
}`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Toast — the basics</div>
        <div className="docs-preview">
          <EvoStack direction="row" gap="0.5rem" wrap>
            <EvoButton label="Default" onClick={() => evoNotify.toast('Build queued')} />
            <EvoButton label="Success" severity="primary" onClick={() => evoNotify.toast.success('Saved successfully', { description: 'Your changes are live.' })} />
            <EvoButton label="Error"   severity="danger"  onClick={() => evoNotify.toast.error('Save failed',           { description: 'Network timed out — try again.' })} />
            <EvoButton label="Warning" severity="warning" onClick={() => evoNotify.toast.warning('Disk almost full',    { description: 'Free up space soon.' })} />
            <EvoButton label="Info"    severity="secondary" onClick={() => evoNotify.toast.info('New version available', { description: 'Reload to update.' })} />
          </EvoStack>
        </div>
        <CodeBlock code={`evoNotify.toast('Build queued')
evoNotify.toast.success('Saved successfully', { description: 'Your changes are live.' })
evoNotify.toast.error('Save failed', { description: 'Network timed out — try again.' })
evoNotify.toast.warning('Disk almost full')
evoNotify.toast.info('New version available')`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Toast — promise</div>
        <p className="docs-section-desc">
          One toast walks itself through <em>loading → success</em> or <em>loading → error</em>.
          No flicker, no triple-toast spam.
        </p>
        <div className="docs-preview">
          <EvoButton
            label="Run async task"
            onClick={() =>
              evoNotify.toast.promise(fakeSave(), {
                loading: 'Uploading invoice…',
                success: (r) => `Uploaded ${r.name}`,
                error: (e) => `Upload failed: ${String(e)}`,
              })
            }
          />
        </div>
        <CodeBlock code={`evoNotify.toast.promise(api.saveInvoice(), {
  loading: 'Uploading invoice…',
  success: (r) => \`Uploaded \${r.name}\`,
  error:   (e) => \`Upload failed: \${String(e)}\`,
})`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Toast — with action and persistent</div>
        <div className="docs-preview">
          <EvoStack direction="row" gap="0.5rem" wrap>
            <EvoButton
              label="With action"
              onClick={() =>
                evoNotify.toast('Message archived', {
                  description: 'Hidden from your inbox.',
                  action: {
                    label: 'Undo',
                    onClick: () => evoNotify.toast.success('Restored'),
                  },
                })
              }
            />
            <EvoButton
              label="Persistent"
              variant="outline"
              onClick={() =>
                evoNotify.toast.warning('Unsaved changes', {
                  description: 'Press save before leaving.',
                  persistent: true,
                })
              }
            />
            <EvoButton label="Dismiss all" variant="outline" severity="secondary" onClick={() => evoNotify.dismissAll()} />
          </EvoStack>
        </div>
        <CodeBlock code={`evoNotify.toast('Message archived', {
  description: 'Hidden from your inbox.',
  action: { label: 'Undo', onClick: () => restore() },
})

evoNotify.toast.warning('Unsaved changes', { persistent: true })

evoNotify.dismissAll()`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Toast — anchors</div>
        <p className="docs-section-desc">
          Override per-toast, or set <code>defaultAnchor</code> on <code>Provider</code>.
          On screens ≤375px, anchors collapse to a full-width edge.
        </p>
        <div className="docs-preview">
          <EvoStack direction="row" gap="0.5rem" wrap>
            {(['top-left','top-center','top-right','bottom-left','bottom-center','bottom-right'] as const).map((a) => (
              <EvoButton
                key={a}
                label={a}
                variant="outline"
                onClick={() => evoNotify.toast.info(a, { anchor: a })}
              />
            ))}
          </EvoStack>
        </div>
        <CodeBlock code={`evoNotify.toast.info('Pinned bottom-center', { anchor: 'bottom-center' })`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Notification Center — Bell</div>
        <p className="docs-section-desc">
          Drop the bell anywhere. It reads from the same global store — clicking it opens a
          popover panel. <code>evoNotify.push(...)</code> adds an item and bumps the badge.
        </p>
        <div className="docs-preview">
          <EvoStack direction="row" gap="1rem" align="center">
            <EvoNotification.Bell />
            <EvoButton
              label="Push notification"
              onClick={() =>
                evoNotify.push({
                  title: 'Alice mentioned you',
                  description: '“Can you take a look at the new design?”',
                  severity: 'info',
                  toast: true,
                })
              }
            />
            <EvoButton
              label="Push error"
              severity="danger"
              variant="outline"
              onClick={() =>
                evoNotify.push({
                  title: 'Build failed',
                  description: 'main · commit a3f9b2 · 12 tests failed',
                  severity: 'error',
                })
              }
            />
            <EvoButton
              label="Mark all read"
              variant="outline"
              severity="secondary"
              onClick={() => evoNotify.inbox.markAllRead()}
            />
          </EvoStack>
        </div>
        <CodeBlock code={`<EvoNotification.Bell />

evoNotify.push({
  title: 'Alice mentioned you',
  description: '"Can you take a look at the new design?"',
  severity: 'info',
  toast: true,             // also flash a toast right now
})

evoNotify.inbox.markAllRead()`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Wiring to a live source (WebSocket / SSE)</div>
        <p className="docs-section-desc">
          EvoNotification does not ship a transport layer. Call <code>evoNotify.push(...)</code>{' '}
          from your own subscription code — server-sent events, WebSockets, polling — anything that
          can deliver a JSON payload to the browser.
        </p>
        <CodeBlock code={`socket.on('message', (msg) => {
  evoNotify.push({
    title: \`\${msg.from} sent you a message\`,
    description: msg.preview,
    avatarUrl: msg.fromAvatar,
    severity: 'info',
    onClick: () => navigate(\`/chat/\${msg.from}\`),
    toast: true,
  })
})`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">External-data mode</div>
        <p className="docs-section-desc">
          If you already own the list of notifications (Redux, Zustand, your own store), feed it
          to the Provider. The Provider becomes read-only; mutations route through{' '}
          <code>onInboxChange</code>.
        </p>
        <CodeBlock code={`<EvoNotification.Provider
  inboxItems={items}
  onInboxChange={(next) => dispatch(setNotifications(next))}
>
  <App />
  <EvoNotification.Toaster />
</EvoNotification.Provider>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Accessibility</div>
        <ul className="docs-list">
          <li><strong>Live regions:</strong> error toasts use <code>aria-live="assertive"</code>; everything else uses <code>polite</code>.</li>
          <li><strong>Timers pause</strong> on hover, on focus, and when the window blurs (configurable on Provider).</li>
          <li><strong>Esc</strong> dismisses the most recent toast at the focused anchor; <strong>Esc</strong> also closes the Bell panel.</li>
          <li><strong>Tab order:</strong> close button, action button, and item rows are all keyboard-reachable with a visible focus ring.</li>
          <li><strong>Reduced motion:</strong> respects <code>prefers-reduced-motion: reduce</code> automatically — no enter/exit animation.</li>
          <li><strong>Screen readers</strong> announce title <em>and</em> description, not only the title.</li>
          <li><strong>Touch target:</strong> Bell defaults to 44×44px (WCAG 2.5.5).</li>
        </ul>
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">evoNotify.toast (singleton)</div>
        <PropsTable props={[
          { prop: 'toast(msg, options?)',          type: '(ReactNode, EvoToastOptions?) => string', description: 'Show a toast. Returns the id.' },
          { prop: 'toast.success / error / warning / info', type: '(ReactNode, EvoToastOptions?) => string', description: 'Severity shortcuts.' },
          { prop: 'toast.loading(msg, options?)',  type: '(ReactNode, EvoToastOptions?) => string', description: 'Persistent toast, not auto-dismissible. Pair with update().' },
          { prop: 'toast.promise(p, msgs)',        type: '(Promise<T>, EvoPromiseMessages<T>) => string', description: 'One toast walks loading → success/error.' },
          { prop: 'toast.update(id, options)',     type: '(string, EvoToastOptions) => void', description: 'Update an existing toast in place.' },
          { prop: 'toast.dismiss(id?)',            type: '(string?) => void', description: 'Dismiss one toast, or all if id omitted.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoToastOptions</div>
        <PropsTable props={[
          { prop: 'id',          type: 'string',        description: 'Pass to update an existing toast instead of creating a new one.' },
          { prop: 'title',       type: 'ReactNode',     description: 'Primary line (bold). Falls back to the message argument.' },
          { prop: 'description', type: 'ReactNode',     description: 'Secondary line (muted).' },
          { prop: 'severity',    type: "'success' | 'error' | 'warning' | 'info'", default: "'info'", description: 'Icon + colour + aria-live mapping.' },
          { prop: 'icon',        type: 'ReactNode',     description: 'Overrides the default severity icon.' },
          { prop: 'duration',    type: 'number',        default: '4000', description: 'Auto-dismiss in ms. Use Infinity or `persistent: true` to disable.' },
          { prop: 'persistent',  type: 'boolean',       default: 'false', description: 'Disable auto-dismiss.' },
          { prop: 'anchor',      type: 'EvoNotificationAnchor', description: 'Per-toast position override.' },
          { prop: 'action',      type: '{ label: string; onClick: (e) => void }', description: 'Inline action button. Dismisses the toast on click.' },
          { prop: 'dismissible', type: 'boolean',       default: 'true', description: 'Show the close button.' },
          { prop: 'onDismiss',   type: '(id: string) => void', description: 'Fires when user dismisses.' },
          { prop: 'onAutoClose', type: '(id: string) => void', description: 'Fires when the timer expires.' },
          { prop: 'inbox',       type: 'boolean | Partial<EvoInboxItemInput>', description: 'Also push a copy into the notification center.' },
          { prop: 'className',   type: 'string',        description: 'Additional CSS class on the toast root.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">evoNotify.push + evoNotify.inbox.*</div>
        <PropsTable props={[
          { prop: 'push(item)',                type: '(EvoInboxItemInput) => string',  description: 'Add to the notification center. Returns the id.' },
          { prop: 'inbox.markRead(id)',        type: '(string) => void',               description: 'Mark a single item as read.' },
          { prop: 'inbox.markUnread(id)',      type: '(string) => void',               description: 'Mark a single item as unread.' },
          { prop: 'inbox.markAllRead()',       type: '() => void',                     description: 'Mark all items as read.' },
          { prop: 'inbox.remove(id)',          type: '(string) => void',               description: 'Remove one item.' },
          { prop: 'inbox.clear()',             type: '() => void',                     description: 'Remove all items.' },
          { prop: 'inbox.setItems(items)',     type: '(EvoInboxItem[]) => void',       description: 'Replace the full list (use in external-data mode).' },
          { prop: 'inbox.getState()',          type: '() => { items, unread }',        description: 'Read current state snapshot.' },
          { prop: 'inbox.subscribe(fn)',       type: '(fn) => () => void',             description: 'Subscribe to inbox changes. Returns an unsubscribe fn.' },
          { prop: 'dismissAll()',              type: '() => void',                     description: 'Dismiss every visible toast (does not touch the inbox).' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoNotification.Provider</div>
        <PropsTable props={[
          { prop: 'children',         type: 'ReactNode', required: true, description: 'Your app tree.' },
          { prop: 'defaultAnchor',    type: 'EvoNotificationAnchor', default: "'top-right'", description: 'Where toasts appear when no per-toast anchor is set.' },
          { prop: 'maxVisible',       type: 'number',  default: '3',     description: 'Max toasts visible per anchor. Extras fold into "+N more".' },
          { prop: 'defaultDuration',  type: 'number',  default: '4000',  description: 'Default auto-dismiss in ms.' },
          { prop: 'pauseOnFocusLoss', type: 'boolean', default: 'true',  description: 'Pause auto-dismiss timers when the window loses focus.' },
          { prop: 'inboxItems',       type: 'EvoInboxItem[]', description: 'External-data mode: parent owns the list.' },
          { prop: 'onInboxChange',    type: '(items: EvoInboxItem[]) => void', description: 'Receives every mutation when externally controlled.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoNotification.Bell</div>
        <PropsTable props={[
          { prop: 'variant',        type: "'solid' | 'ghost'", default: "'ghost'", description: 'Visual style.' },
          { prop: 'size',           type: "'sm' | 'md' | 'lg'", default: "'md'",    description: 'Touch target sizing; md = 44px (WCAG).' },
          { prop: 'hideZero',       type: 'boolean', default: 'true',  description: 'Hide the badge when unread count is 0.' },
          { prop: 'maxBadgeCount',  type: 'number',  default: '99',    description: 'Counts above render as "{max}+".' },
          { prop: 'panelPlacement', type: "'bottom-end' | 'bottom-start' | 'bottom' | 'top-end' | 'top-start'", default: "'bottom-end'", description: 'Where the popover opens.' },
          { prop: 'renderPanel',    type: "'popover' | 'none'", default: "'popover'", description: '"none" lets you render the Panel inline yourself.' },
          { prop: 'panelTitle',     type: 'ReactNode', default: "'Notifications'", description: 'Heading text inside the popover.' },
          { prop: 'panelEmptyState', type: 'ReactNode', description: 'Override the default empty state.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoNotification.Panel</div>
        <PropsTable props={[
          { prop: 'open',             type: 'boolean', default: 'true', description: 'Controls visibility when used standalone.' },
          { prop: 'onClose',          type: '() => void', description: 'Renders the close button when provided.' },
          { prop: 'title',            type: 'ReactNode', default: "'Notifications'", description: 'Heading text.' },
          { prop: 'emptyState',       type: 'ReactNode', description: 'Override the default empty UI.' },
          { prop: 'loading',          type: 'boolean', default: 'false', description: 'Show a loading state.' },
          { prop: 'error',            type: 'ReactNode', description: 'Show an error state.' },
          { prop: 'showMarkAllRead',  type: 'boolean', default: 'true', description: 'Show the "Mark all read" affordance when unread > 0.' },
          { prop: 'maxHeight',        type: 'number | string', default: '480', description: 'Body scroll cap.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">EvoNotification.Item</div>
        <PropsTable props={[
          { prop: 'item',     type: 'EvoInboxItem', required: true, description: 'The record to render.' },
          { prop: 'onClick',  type: '(item) => void', description: 'Overrides the item-level onClick. Auto-marks the item read.' },
        ]} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Related</div>
        <p className="docs-section-desc">
          For in-page, declarative banners (e.g. "Your trial ends in 3 days") use{' '}
          <code>EvoAlert</code> — the persistent counterpart to this transient + accumulated system.
        </p>
      </div>
    </div>
  )
}
