'use client';

import Link from 'next/link';
import '@/styles/admin/dashboard.css';

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
}

const DashboardCard = ({ title, description, href }: DashboardCardProps) => (
  <Link
    href={href}
    className="dashboard-card border border-neutral-700 rounded p-6 hover:bg-neutral-800 transition"
  >
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="mt-2 text-sm text-gray-300">{description}</p>
  </Link>
);

export default function DashboardPage() {
  return (
    <section className="dashboard-page grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
        title="Posts"
        description="View, edit, and create new posts."
        href="/posts"
      />
      <DashboardCard
        title="Categories"
        description="Manage post categories."
        href="/categories"
      />
      <DashboardCard
        title="Comments"
        description="Review and moderate comments."
        href="/comments"
      />
      <DashboardCard
        title="Settings"
        description="Update admin settings."
        href="/settings"
      />
    </section>
  );
}
