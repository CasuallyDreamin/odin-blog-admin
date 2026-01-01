'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCommentsCount } from '@/lib/commentsService';
import { fetchUnreadMessagesCount } from '@/lib/contactService';

interface StatsProps {
  totalPosts: number;
  totalTags: number;
}

const StatCard = ({ label, value, href, alert }: { label: string; value: number | string; href: string; alert?: boolean }) => (
  <Link href={href} className={`bg-neutral-900 border ${alert ? 'border-primary' : 'border-neutral-800'} p-5 rounded-lg hover:border-primary transition-colors group`}>
    <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest">{label}</p>
    <p className="text-3xl font-bold mt-2 text-white group-hover:text-primary transition-colors tabular-nums">
      {value}
    </p>
  </Link>
);

export default function DashboardStats({ totalPosts, totalTags }: StatsProps) {
  const [counts, setCounts] = useState({ comments: 0, messages: 0 });

  useEffect(() => {
    async function loadSecureStats() {
      try {
        const [c, m] = await Promise.all([
          fetchCommentsCount(),
          fetchUnreadMessagesCount()
        ]);
        setCounts({ comments: c, messages: m });
      } catch (err) {
        console.error("Auth failed for stats:", err);
      }
    }
    loadSecureStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Posts" value={totalPosts} href="/posts" />
      <StatCard label="Messages" value={counts.messages} href="/messages" alert={counts.messages > 0} />
      <StatCard label="Pending Comments" value={counts.comments} href="/comments" alert={counts.comments > 0} />
      <StatCard label="Total Tags" value={totalTags} href="/tags" />
    </div>
  );
}