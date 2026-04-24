import { useState } from 'react'
import { EvoPagination, EvoDivider } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'

export default function PaginationPage() {
  const [page1, setPage1] = useState(1)
  const [page2, setPage2] = useState(5)
  const [page3, setPage3] = useState(1)

  return (
    <div>
      <div className="docs-page-header">
        <div className="docs-page-tag">Component</div>
        <h1 className="docs-page-title">EvoPagination</h1>
        <p className="docs-page-desc">
          Page navigation with smart ellipsis for large page counts. Fully controlled
          and accessible via semantic nav element.
        </p>
        <div className="docs-import-line">
          import {'{ '}<span>EvoPagination</span>{' }'} from '@justin_evo/evo-ui'
        </div>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Basic</div>
        <div className="docs-preview col">
          <EvoPagination total={50} page={page1} pageSize={10} onChange={setPage1} />
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Page: <strong style={{ color: '#e2e8f0' }}>{page1}</strong> / 5</p>
        </div>
        <CodeBlock code={`const [page, setPage] = useState(1)

<EvoPagination total={50} page={page} pageSize={10} onChange={setPage} />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Large Dataset with Ellipsis</div>
        <div className="docs-preview col">
          <EvoPagination total={500} page={page2} pageSize={10} onChange={setPage2} />
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Page: <strong style={{ color: '#e2e8f0' }}>{page2}</strong> / 50</p>
        </div>
        <CodeBlock code={`<EvoPagination total={500} page={page} pageSize={10} onChange={setPage} />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">More Siblings</div>
        <div className="docs-preview col">
          <EvoPagination
            total={200}
            page={page3}
            pageSize={10}
            siblingCount={2}
            onChange={setPage3}
          />
        </div>
        <CodeBlock code={`<EvoPagination
  total={200}
  page={page}
  pageSize={10}
  siblingCount={2}
  onChange={setPage}
/>`} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'total', type: 'number', required: true, description: 'Total number of items.' },
          { prop: 'page', type: 'number', required: true, description: 'Current page (1-indexed).' },
          { prop: 'onChange', type: '(page: number) => void', required: true, description: 'Called when the page changes.' },
          { prop: 'pageSize', type: 'number', default: '10', description: 'Items per page.' },
          { prop: 'siblingCount', type: 'number', default: '1', description: 'Number of page buttons shown on each side of the current page.' },
          { prop: 'className', type: 'string', description: 'Additional CSS class.' },
        ]} />
      </div>
    </div>
  )
}
