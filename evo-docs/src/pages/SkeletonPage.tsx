import { useState } from 'react'
import { EvoSkeleton, EvoToggle, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function SkeletonPage() {
  const [animated, setAnimated] = useState(true)

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoSkeleton</h1>
        <p className="docs-page-desc">
          Placeholder loaders for content that is loading. Includes base rectangle,
          text block, and circle variants.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoSkeleton</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Controls</div>
        <div className="docs-preview">
          <EvoToggle checked={animated} onChange={setAnimated} label="Animated" />
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic Shapes</div>
        <div className="docs-preview col">
          <EvoSkeleton width="100%" height={16} animated={animated} />
          <EvoSkeleton width="70%" height={16} animated={animated} />
          <EvoSkeleton width={200} height={80} borderRadius={8} animated={animated} />
        </div>
        <CodeBlock code={`<EvoSkeleton width="100%" height={16} />
<EvoSkeleton width="70%" height={16} />
<EvoSkeleton width={200} height={80} borderRadius={8} />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Text Block</div>
        <div className="docs-preview col" style={{ width: '100%' }}>
          <EvoSkeleton.Text lines={4} animated={animated} />
        </div>
        <CodeBlock code={`<EvoSkeleton.Text lines={4} />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Circle</div>
        <div className="docs-preview">
          <EvoSkeleton.Circle size={40} animated={animated} />
          <EvoSkeleton.Circle size={56} animated={animated} />
          <EvoSkeleton.Circle size={72} animated={animated} />
        </div>
        <CodeBlock code={`<EvoSkeleton.Circle size={40} />
<EvoSkeleton.Circle size={56} />
<EvoSkeleton.Circle size={72} />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Profile Card Pattern</div>
        <div className="docs-preview">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', width: '100%', maxWidth: 360 }}>
            <EvoSkeleton.Circle size={48} animated={animated} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingTop: '0.2rem' }}>
              <EvoSkeleton width="60%" height={14} animated={animated} />
              <EvoSkeleton width="90%" height={12} animated={animated} />
              <EvoSkeleton width="40%" height={12} animated={animated} />
            </div>
          </div>
        </div>
        <CodeBlock code={`<div style={{ display: 'flex', gap: '1rem' }}>
  <EvoSkeleton.Circle size={48} />
  <div style={{ flex: 1 }}>
    <EvoSkeleton width="60%" height={14} />
    <EvoSkeleton width="90%" height={12} />
  </div>
</div>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'EvoSkeleton — width', type: 'number | string', default: "'100%'", description: 'Width of the skeleton.' },
          { prop: 'EvoSkeleton — height', type: 'number | string', default: "'1rem'", description: 'Height of the skeleton.' },
          { prop: 'EvoSkeleton — borderRadius', type: 'number | string', default: "'6px'", description: 'Border radius.' },
          { prop: 'EvoSkeleton — animated', type: 'boolean', default: 'true', description: 'Enables the shimmer animation.' },
          { prop: 'EvoSkeleton.Text — lines', type: 'number', default: '3', description: 'Number of text lines to render.' },
          { prop: 'EvoSkeleton.Circle — size', type: 'number | string', default: '40', description: 'Diameter of the circle.' },
        ]} />
      </div>
    </div>
  )
}
