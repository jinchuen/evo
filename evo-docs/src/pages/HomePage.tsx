import type { ComponentType } from 'react'
import { useNavigate } from 'react-router-dom'
import { EvoButton, EvoStack, EvoBadge } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import {
  ButtonPreview,
  InputPreview,
  CheckboxPreview,
  RadioPreview,
  SelectPreview,
  TreeSelectPreview,
  AutoCompletePreview,
  TogglePreview,
  FormPreview,
  StackPreview,
  GridPreview,
  ContainerPreview,
  DividerPreview,
  NavPreview,
  TopNavPreview,
  BreadcrumbPreview,
  TabsPreview,
  PaginationPreview,
  CardPreview,
  TablePreview,
  BadgePreview,
  SkeletonPreview,
  AlertPreview,
  ModalPreview,
  TooltipPreview,
  NotificationPreview,
  RichTextAreaPreview,
  ImageCropperPreview,
  CommandPalettePreview,
  ProgressPreview,
  ProgressRingPreview,
  StepperPreview,
  WizardPreview,
  BannerPreview,
  PricingTablePreview,
  CountdownPreview,
} from '../components/ComponentPreviews'

type Entry = { name: string; path: string; Preview: ComponentType }
type Group = { name: string; description: string; items: Entry[] }

// Grouped, in the same order they appear in the sidebar.
const groups: Group[] = [
  {
    name: 'Forms',
    description: 'Inputs, selects, and controls for collecting user data.',
    items: [
      { name: 'Button',      path: '/components/button',      Preview: ButtonPreview },
      { name: 'Input',       path: '/components/input',       Preview: InputPreview },
      { name: 'Checkbox',    path: '/components/checkbox',    Preview: CheckboxPreview },
      { name: 'Radio',       path: '/components/radio',       Preview: RadioPreview },
      { name: 'Select',      path: '/components/select',      Preview: SelectPreview },
      { name: 'Tree Select', path: '/components/tree-select', Preview: TreeSelectPreview },
      { name: 'AutoComplete', path: '/components/autocomplete', Preview: AutoCompletePreview },
      { name: 'Toggle',      path: '/components/toggle',      Preview: TogglePreview },
      { name: 'Form',        path: '/components/form',        Preview: FormPreview },
      { name: 'Rich Text Area', path: '/components/rich-text-area', Preview: RichTextAreaPreview },
    ],
  },
  {
    name: 'Layout',
    description: 'Spacing, alignment, and structural primitives.',
    items: [
      { name: 'Stack',     path: '/components/stack',     Preview: StackPreview },
      { name: 'Grid',      path: '/components/grid',      Preview: GridPreview },
      { name: 'Container', path: '/components/container', Preview: ContainerPreview },
      { name: 'Divider',   path: '/components/divider',   Preview: DividerPreview },
    ],
  },
  {
    name: 'Navigation',
    description: 'Wayfinding patterns for moving between views.',
    items: [
      { name: 'Nav',        path: '/components/nav',        Preview: NavPreview },
      { name: 'TopNav',     path: '/components/topnav',     Preview: TopNavPreview },
      { name: 'Breadcrumb', path: '/components/breadcrumb', Preview: BreadcrumbPreview },
      { name: 'Tabs',       path: '/components/tabs',       Preview: TabsPreview },
      { name: 'Pagination', path: '/components/pagination', Preview: PaginationPreview },
      { name: 'Command Palette', path: '/components/command-palette', Preview: CommandPalettePreview },
    ],
  },
  {
    name: 'Progress & Flow',
    description: 'Momentum, staged tasks, and goal-gradient head starts.',
    items: [
      { name: 'Progress',      path: '/components/progress',      Preview: ProgressPreview },
      { name: 'Progress Ring', path: '/components/progress-ring', Preview: ProgressRingPreview },
      { name: 'Stepper',       path: '/components/stepper',       Preview: StepperPreview },
      { name: 'Wizard',        path: '/components/wizard',        Preview: WizardPreview },
    ],
  },
  {
    name: 'Data Display',
    description: 'Show information at a glance.',
    items: [
      { name: 'Card',     path: '/components/card',     Preview: CardPreview },
      { name: 'Table',    path: '/components/table',    Preview: TablePreview },
      { name: 'Badge',    path: '/components/badge',    Preview: BadgePreview },
      { name: 'Skeleton', path: '/components/skeleton', Preview: SkeletonPreview },
      { name: 'Pricing Table', path: '/components/pricing-table', Preview: PricingTablePreview },
      { name: 'Countdown', path: '/components/countdown', Preview: CountdownPreview },
    ],
  },
  {
    name: 'Feedback',
    description: 'Alerts, overlays, and contextual messages.',
    items: [
      { name: 'Alert',   path: '/components/alert',   Preview: AlertPreview },
      { name: 'Banner',  path: '/components/banner',  Preview: BannerPreview },
      { name: 'Modal',   path: '/components/modal',   Preview: ModalPreview },
      { name: 'Tooltip', path: '/components/tooltip', Preview: TooltipPreview },
      { name: 'Notification', path: '/components/notification', Preview: NotificationPreview },
    ],
  },
  {
    name: 'Media',
    description: 'Components for working with rich content.',
    items: [
      { name: 'Image Cropper', path: '/components/image-cropper', Preview: ImageCropperPreview },
    ],
  },
]

const totalComponents = groups.reduce((sum, g) => sum + g.items.length, 0)

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="docs-home-hero">
        <h1>Evo UI Docs</h1>
        <p>
          A high-performance React component library. Browse the components below to explore
          usage examples, variants, and prop references.
        </p>
        <EvoStack direction="row" gap="0.75rem">
          <EvoButton label="Browse Components" onClick={() => navigate('/components/button')} />
          <EvoButton
            label="View on GitHub"
            variant="outline"
            severity="secondary"
            onClick={() => window.open('https://github.com/jinchuen/evo', '_blank', 'noopener,noreferrer')}
          />
        </EvoStack>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Installation</div>
        <CodeBlock lang="bash" code={`npm install @justin_evo/evo-ui`} />
        <CodeBlock lang="tsx" code={`// Import CSS once in your app entry
import '@justin_evo/evo-ui/dist/evo-ui.css'

// Wrap your app in the theme provider for built-in light/dark support
import { EvoThemeProvider, EvoButton, EvoCard, EvoInput } from '@justin_evo/evo-ui'

<EvoThemeProvider defaultTheme="system">
  <App />
</EvoThemeProvider>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">
          Theming
          <EvoBadge severity="success" variant="subtle">New</EvoBadge>
        </div>
        <p className="docs-page-desc">
          Every component ships with synchronised <strong>light</strong> and <strong>dark</strong> themes
          driven by CSS custom properties. Flip the toggle in the top-right of this page to see
          it in action, or read the full guide on the{' '}
          <a
            onClick={() => navigate('/theming')}
            style={{ color: 'var(--docs-accent)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Theming page
          </a>.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">
          Components
          <EvoBadge severity="info" variant="subtle">{totalComponents} total</EvoBadge>
        </div>

        {groups.map((group) => (
          <section key={group.name} className="docs-component-group">
            <header className="docs-component-group-head">
              <h3 className="docs-component-group-title">
                {group.name}
                <span className="docs-component-group-count">{group.items.length}</span>
              </h3>
              <p className="docs-component-group-desc">{group.description}</p>
            </header>

            <div className="docs-component-grid">
              {group.items.map((c) => {
                const Preview = c.Preview
                return (
                  <button
                    key={c.path}
                    type="button"
                    className="docs-component-card"
                    onClick={() => navigate(c.path)}
                    aria-label={`Open ${c.name} docs`}
                  >
                    <div className="docs-component-card-preview" aria-hidden="true">
                      <Preview />
                    </div>
                    <div className="docs-component-card-meta">
                      <div className="docs-component-card-name">{c.name}</div>
                      <div className="docs-component-card-cat">{group.name}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
