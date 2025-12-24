'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/admin/Topbar';
import Table, { TableColumn } from '@/components/admin/Table';
import Pagination from '@/components/admin/Pagination';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import StatusDot from '@/components/admin/StatusDot';
import api from '@/lib/api';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function loadMessages() {
    setLoading(true);
    try {
      const res = await api.get('/contact', { params: { page, limit: 10 } });
      setMessages(res.data.messages || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, [page]);

  const columns: TableColumn<ContactMessage>[] = [
    {
      key: 'isRead',
      label: 'Status',
      render: (m) => (
        <div className="flex items-center gap-2">
          <StatusDot status={m.isRead ? 'published' : 'draft'} />
          <span className="text-xs uppercase">{m.isRead ? 'Read' : 'New'}</span>
        </div>
      )
    },
    { key: 'name', label: 'From' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    {
      key: 'createdAt',
      label: 'Date',
      render: (m) => new Date(m.createdAt).toLocaleDateString()
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Inbound Messages" />

      <Table<ContactMessage>
        columns={columns}
        data={messages}
        onRowClick={(row) => router.push(`/messages/${row.id}`)}
        actions={(row) => (
          <button 
            onClick={(e) => { e.stopPropagation(); setDeleteId(row.id); }} 
            className="text-red-500 hover:text-red-400 text-sm font-medium"
          >
            Delete
          </button>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <ConfirmDeleteModal
        open={deleteId !== null}
        itemName="message"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await api.delete(`/contact/${deleteId}`);
          setDeleteId(null);
          loadMessages();
        }}
      />
    </div>
  );
}