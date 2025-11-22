'use client';

import React from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
}

export default function Table<T>({
  columns,
  data,
  onRowClick,
  actions,
}: TableProps<T>) {
  return (
    <div className="overflow-auto border border-neutral-800 rounded">
      <table className="w-full text-left">
        <thead className="bg-neutral-900 border-b border-neutral-800">
          <tr>
            {columns.map(col => (
              <th
                key={String(col.key)}
                className="px-4 py-2 text-sm font-medium text-gray-300"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
            {actions && <th className="px-4 py-2 text-sm">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-neutral-800 hover:bg-neutral-800/40 transition cursor-pointer"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <td key={String(col.key)} className="px-4 py-2 text-sm">
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}

              {actions && (
                <td className="px-4 py-2 text-sm">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
