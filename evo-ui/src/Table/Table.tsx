import React from 'react';
import styles from '../css/table.module.scss';

export interface TableColumn<T> {
  /** Key of the data object to read from. */
  key: keyof T;
  /** Display label for the column header. */
  header: string;
  /** Optional fixed width (e.g. '120px', '10%'). */
  width?: string;
  /** Custom cell renderer — falls back to string coercion. */
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface EvoTableProps<T extends Record<string, unknown>> {
  /** Column definitions. */
  columns: TableColumn<T>[];
  /** Row data array. */
  data: T[];
  /** Message shown when `data` is empty. */
  emptyText?: string;
  /** Fired when a row is double-clicked, receiving that row's data. */
  onRowDoubleClick?: (row: T) => void;
  className?: string;
}

export const EvoTable = <T extends Record<string, unknown>>({
  columns,
  data,
  emptyText = 'No data available.',
  onRowDoubleClick,
  className,
}: EvoTableProps<T>) => {
  const wrapperClass = [styles.wrapper, className].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={styles.th}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={styles.tbody}>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={[
                  styles.tr,
                  onRowDoubleClick ? styles.clickable : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onDoubleClick={
                  onRowDoubleClick ? () => onRowDoubleClick(row) : undefined
                }
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className={styles.td}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
