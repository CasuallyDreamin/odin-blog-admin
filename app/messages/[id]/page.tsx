'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
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

export default function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndRead() {
      try {
        const res = await api.get(`/contact`); 
        const found = res.data.messages.find((m: ContactMessage) => m.id === id);
        
        if (found) {
          setMessage(found);
          if (!found.isRead) {
            await api.patch(`/contact/${id}/read`);
          }
        }
      } catch (err) {
        console.error("Failed to load message", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAndRead();
  }, [id]);

  if (loading) return <div className="p-10 text-cyan-500">Loading message...</div>;
  if (!message) return <div className="p-10 text-red-500">Message not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8 flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push('/messages')}>
          ← Back to Inbox
        </Button>
        <div className="text-sm text-neutral-500">
          Received on {new Date(message.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-xl">
        <header className="p-6 border-b border-neutral-800 bg-neutral-900/50">
          <h1 className="text-2xl font-bold text-white mb-2">
            {message.subject || '(No Subject)'}
          </h1>
          <div className="flex flex-col gap-1">
            <p className="text-cyan-400 font-medium">{message.name}</p>
            <p className="text-neutral-400 text-sm">{message.email}</p>
          </div>
        </header>

        <main className="p-8 text-neutral-200 leading-relaxed whitespace-pre-wrap min-h-[300px]">
          {message.message}
        </main>

        <footer className="p-4 bg-neutral-950/50 border-t border-neutral-800 flex justify-end gap-4">
          <Button 
            className="bg-red-600/10 text-red-500 border border-red-900/50 hover:bg-red-600 hover:text-white"
            onClick={async () => {
              if (confirm('Are you sure you want to delete this message?')) {
                await api.delete(`/contact/${id}`);
                router.push('/messages');
              }
            }}
          >
            Delete Message
          </Button>
          <a 
            href={`mailto:${message.email}?subject=Re: ${message.subject}`}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded font-medium transition-colors"
          >
            Reply via Email
          </a>
        </footer>
      </div>
   </div>
  );
}