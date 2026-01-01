"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchPosts } from '@/lib/postsService';
import { fetchTags } from '@/lib/tagsService';
import { fetchCategories } from '@/lib/categoriesService';
import { checkApiHealth } from '@/lib/api';
import { formatRelativeTime } from '@/lib/utils';
import Badge from '@/components/admin/Badge';
import StatusDot from '@/components/admin/StatusDot';
import DashboardStats from '@/components/admin/DashboardStats';
import { Post } from '@/types/post';

export default function DashboardPage() {
  const [data, setData] = useState({
    recentPosts: [] as Post[],
    totalPosts: 0,
    totalTags: 0,
    totalCats: 0,
    health: { online: false, latency: 0 },
    loading: true
  });

  useEffect(() => {
    async function loadDashboardData() {
      const [postsRes, tagsRes, catsRes, healthRes] = await Promise.allSettled([
        fetchPosts({ limit: 5 }),
        fetchTags({ limit: 1 }),
        fetchCategories({ limit: 1 }),
        checkApiHealth()
      ]);

      setData({
        recentPosts: postsRes.status === 'fulfilled' ? postsRes.value.data : [],
        totalPosts: postsRes.status === 'fulfilled' ? postsRes.value.total : 0,
        totalTags: tagsRes.status === 'fulfilled' ? tagsRes.value.total : 0,
        totalCats: catsRes.status === 'fulfilled' ? catsRes.value.total : 0,
        health: healthRes.status === 'fulfilled' ? healthRes.value : { online: false, latency: 0 },
        loading: false
      });
    }

    loadDashboardData();
  }, []);

  if (data.loading) {
    return <div className="p-6 animate-pulse text-neutral-500 font-mono text-xs">LOADING_SYSTEM_DATA...</div>;
  }

  return (
    <div className="space-y-10 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold section-title tracking-tighter">OVERVIEW</h1>
        <div className="h-1 w-12 bg-primary"></div>
      </header>

      <DashboardStats totalPosts={data.totalPosts} totalTags={data.totalTags} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-end justify-between border-b border-neutral-800 pb-2">
            <h2 className="text-lg font-bold section-title uppercase tracking-widest">Recent Activity</h2>
            <Link href="/posts" className="text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold">
              View All Posts →
            </Link>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-800/30 text-neutral-500 uppercase text-[10px] tracking-widest border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-bold">Entry Title</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {data.recentPosts.map((post: Post) => (
                  <tr key={post.id} className="hover:bg-neutral-800/20 group transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/posts/edit/${post.slug}`} className="font-medium group-hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusDot status={post.published ? 'published' : 'draft'} />
                        <span className="text-xs uppercase text-neutral-400">{post.published ? 'Live' : 'Draft'}</span>
                      </div>
                    </td> 
                    <td className="px-6 py-4 text-right text-neutral-500 tabular-nums">
                      {formatRelativeTime(post.createdAt || new Date())}
                    </td>
                  </tr>
                ))}
                {data.recentPosts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-neutral-600 italic">No recent activity found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-[10px] font-bold section-title mb-4 uppercase tracking-[0.2em] text-neutral-500 border-l-2 border-primary pl-3">
              Content Pipeline
            </h2>
            <div className="grid grid-cols-1 gap-2">
              <Link href="/posts/new" className="flex items-center justify-between p-3 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition text-sm group">
                <span>Compose Post</span>
                <span className="text-neutral-600 group-hover:text-white">→</span>
              </Link>
              <Link href="/thoughts/new" className="flex items-center justify-between p-3 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition text-sm group">
                <span>Share Thought</span>
                <span className="text-neutral-600 group-hover:text-white">→</span>
              </Link>
              <div className="p-3 rounded bg-neutral-900/30 border border-neutral-800 flex justify-between items-center text-xs">
                <span className="text-neutral-500 uppercase tracking-tighter">Categories</span>
                <span className="font-mono text-primary font-bold">{data.totalCats}</span>
              </div>
            </div>
          </section>

          <section className="p-4 bg-neutral-900/50 border border-dashed border-neutral-800 rounded">
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Service Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-400 font-mono tracking-tighter uppercase">Express_API</span>
                  {data.health.online && (
                    <span className="text-[9px] text-neutral-600 font-mono">{data.health.latency}ms latency</span>
                  )}
                </div>
                <Badge variant={data.health.online ? 'success' : 'error'}>
                  {data.health.online ? 'Online' : 'Offline'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-400 font-mono tracking-tighter uppercase">Postgres_DB</span>
                <Badge variant={data.health.online ? 'success' : 'warning'}>
                  {data.health.online ? 'Active' : 'Unknown'}
                </Badge>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}