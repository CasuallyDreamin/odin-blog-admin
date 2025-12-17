'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import api from '@/lib/api';

export default function NewTagPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/tags', { name });
      router.push('/tags');
    } catch (err) {
      console.error('Failed to create tag', err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Create New Tag</h1>
      <form onSubmit={handleSubmit}>
        <FormField
          label="Tag Name"
          value={name}
          onChange={setName}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500"
        >
          {loading ? 'Creating...' : 'Create Tag'}
        </button>
      </form>
    </div>
  );
}
