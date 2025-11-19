'use client';

import React from 'react';
import Link from 'next/link';

interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  currentPath: string;
}

export default function Sidebar({ items, currentPath }: SidebarProps) {
  return (
    <aside className="w-60 bg-neutral-900 text-gray-100 h-screen p-4 flex flex-col gap-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-2 p-2 rounded hover:bg-neutral-800 ${
            currentPath === item.href ? 'bg-cyan-500 text-white font-semibold' : ''
          }`}
        >
          {item.icon && <span>{item.icon}</span>}
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
