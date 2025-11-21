'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import { usePathname } from 'next/navigation';
import '@/styles/admin/layout.css';
import '@/styles/globals.css';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const path = usePathname();

  const sidebarItems = [
    { label: 'Dashboard', href: '/', icon: null },
    { label: 'Posts', href: '/posts', icon: null },
    { label: 'Categories', href: '/categories', icon: null },
    { label: 'Comments', href: '/comments', icon: null },
    { label: 'Settings', href: '/settings', icon: null },
  ];

  return (
    <html className="admin-layout flex h-screen bg-neutral-900 text-gray-100">
        <body>
            <Sidebar items={sidebarItems} currentPath={path || '/'} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar title="Admin Panel" />
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </body>
    </html>
  );
}
