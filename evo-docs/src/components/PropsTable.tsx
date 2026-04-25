export interface PropDef {
  prop: string
  type: string
  default?: string
  required?: boolean
  description: string
}

interface PropsTableProps {
  props: PropDef[]
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div className="docs-props-wrap">
      <table className="docs-props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.prop}>
              <td>
                <span className="prop-name">{p.prop}</span>
                {p.required && <span className="prop-required">*</span>}
              </td>
              <td><span className="prop-type">{p.type}</span></td>
              <td><span className="prop-default">{p.default ?? '—'}</span></td>
              <td><span className="prop-desc">{p.description}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
