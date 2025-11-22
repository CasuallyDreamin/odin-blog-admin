'use client';

import { useEffect, useState } from 'react';
import Topbar from '@/components/admin/Topbar';
import Table, { TableColumn } from '@/components/admin/Table';
import Pagination from '@/components/admin/Pagination';
import Badge from '@/components/admin/Badge';
import StatusDot from '@/components/admin/StatusDot';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import { fetchPosts, deletePost } from '@/lib/postsService';
import { Post } from '@/types/post';
import Link from "next/link";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // fetch data function
  async function loadPosts() {
    setLoading(true);

    try {
      const res = await fetchPosts({ page, search, limit: 10 });

      setPosts(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load posts', err);
    }

    setLoading(false);
  }

  // load on page or search change
  useEffect(() => {
    loadPosts();
  }, [page, search]);

  // Table columns
  const columns: TableColumn<Post>[] = [
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'categories',
      label: 'Categories',
      render: (p) =>
        p.categories?.length
          ? p.categories.map((c) => <Badge key={c.id}>{c.name}</Badge>)
          : '—',
    },
    {
      key: 'published',
      label: 'Status',
      render: (p) => {
        const status = p.published ? 'published' : 'draft';
        return (
          <div className="flex items-center gap-2">
            <StatusDot status={status} />
            <span className="capitalize">{status}</span>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (p) =>
        p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Topbar
        title="Posts"
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        actions={
          <Link
            href="/posts/new"
            className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-sm"
          >
            + Create Post
          </Link>
        }
      />

      {/* Table */}
      <Table<Post>
        columns={columns}
        data={posts}
        actions={(row) => (
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Edit', row.slug);
              }}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Edit
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(row.id);
              }}
              className="text-red-500 hover:text-red-400"
            >
              Delete
            </button>
          </div>
        )}
      />

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* Delete modal */}
      <ConfirmDeleteModal
        open={deleteId !== null}
        itemName="post"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          console.log("Delete ID: ", deleteId);
          await deletePost(deleteId);
          setDeleteId(null);
          loadPosts();
        }}
      />
    </div>
  );
}
