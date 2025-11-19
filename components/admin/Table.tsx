'use client';

import React from 'react';

interface Column<T> {
  label: string;
  key: keyof T | ((item: T) => React.ReactNode);
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
}

export default function Table<T>({ columns, data, onRowClick }: TableProps<T>) {
  return (
    <table className="w-full table-auto border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          {columns.map((col) => (
            <th key={col.label} className="p-2 border-b border-gray-300 text-left">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={idx}
            onClick={() => onRowClick?.(row)}
            className="hover:bg-gray-50 cursor-pointer"
          >
            {columns.map((col) => (
              <td key={col.label} className="p-2 border-b border-gray-300">
                {typeof col.key === 'function' ? col.key(row) : (row[col.key] as React.ReactNode)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
