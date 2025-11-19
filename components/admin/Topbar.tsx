'use client';

import React from 'react';
import useSearchBar from '@/hooks/useSearchBar';

interface TopbarProps {
  title?: string;
  actions?: React.ReactNode;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

export default function Topbar({ title, actions, searchTerm = '', onSearchChange }: TopbarProps) {
  const { search, handleChange } = useSearchBar({ initialValue: searchTerm, onSearchChange });

  return (
    <header className="w-full bg-neutral-900 text-gray-100 p-4 flex justify-between items-center gap-4">
      {title && <h1 className="text-lg font-semibold">{title}</h1>}
      <input
        type="search"
        placeholder="Search..."
        value={search}
        onChange={handleChange}
        className="px-3 py-1 rounded bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />
      {actions && <div>{actions}</div>}
    </header>
  );
}
