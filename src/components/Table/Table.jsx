import React from 'react';
import styles from './Table.module.css';

/**
 * Table component for displaying tabular data
 * @param {Object} props - Component props
 * @param {Array} props.columns - Array of column definitions: { key, label, render }
 * @param {Array} props.data - Array of data objects
 * @param {Function} props.onRowClick - Row click handler
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Table component
 */
const Table = ({ columns = [], data = [], onRowClick, className = '' }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={`${styles.table} ${className}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={styles.tableHeader}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.emptyCell}>
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row.id || index}
                className={`${styles.tableRow} ${onRowClick ? styles.clickable : ''}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} className={styles.tableCell}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
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

export default Table;

