interface ClassRow {
  cls: string
  prop: string
  value: string
  note?: string
}

interface ClassTableProps {
  rows: ClassRow[]
  showNote?: boolean
}

export function ClassTable({ rows, showNote = false }: ClassTableProps) {
  return (
    <div className="docs-props-wrap">
      <table className="docs-props-table">
        <thead>
          <tr>
            <th>Class</th>
            <th>CSS Property</th>
            <th>Value</th>
            {showNote && <th>Note</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td><span className="prop-name">{r.cls}</span></td>
              <td><span className="prop-type">{r.prop}</span></td>
              <td><span className="prop-default">{r.value}</span></td>
              {showNote && <td><span className="prop-desc">{r.note ?? ''}</span></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
