import type { ReactNode } from 'react'

export type DataTableColumn<Row> = {
  key: string
  label: string
  render: (row: Row) => ReactNode
}

export function DataTable<Row>({
  columns,
  rows,
  rowKey,
  actions,
}: {
  columns: DataTableColumn<Row>[]
  rows: Row[]
  rowKey: (row: Row, index: number) => string
  actions?: (row: Row) => ReactNode
}) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {columns.map((column) => <th key={column.key}>{column.label}</th>)}
            {actions && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={rowKey(row, index)}>
              {columns.map((column) => <td key={column.key} data-label={column.label}>{column.render(row)}</td>)}
              {actions && <td data-label="Aksi">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
