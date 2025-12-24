'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Topbar from '@/components/admin/Topbar';
import Table, { TableColumn } from '@/components/admin/Table';
import Pagination from '@/components/admin/Pagination';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import { fetchQuotes, deleteQuote, Quote } from '@/lib/quotesService';

export default function AdminThoughtsPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function loadQuotes() {
    setLoading(true);
    try {
      const res = await fetchQuotes({ page, search, limit: 10 });
      setQuotes(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load thoughts:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotes();
  }, [page, search]);

  const columns: TableColumn<Quote>[] = [
    {
      key: 'content',
      label: 'Thought',
      render: (q) => <span className="line-clamp-1 italic">"{q.content}"</span>
    },
    { key: 'author', label: 'Author' },
    {
      key: 'categories',
      label: 'Category',
      render: (q) => q.categories?.[0]?.name || 'General'
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <Topbar
        title="Thoughts"
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        actions={
          <Link href="/thoughts/new" className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-sm">
            + Add Thought
          </Link>
        }
      />

      <Table<Quote>
        columns={columns}
        data={quotes}
        actions={(row) => (
          <button 
            onClick={() => setDeleteId(row.id)} 
            className="text-red-500 hover:text-red-400 text-sm font-medium"
          >
            Delete
          </button>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <ConfirmDeleteModal
        open={deleteId !== null}
        itemName="thought"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await deleteQuote(deleteId);
            loadQuotes();
          } catch (err) {
            console.error('Failed to delete thought:', err);
          } finally {
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}