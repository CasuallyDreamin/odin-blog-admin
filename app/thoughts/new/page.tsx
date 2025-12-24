'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import { Button } from '@/components/ui/Button';
import { fetchCategories } from '@/lib/categoriesService'; // Switched
import { createQuote } from '@/lib/quotesService';

export default function NewThoughtPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [categoryId, setCategoryId] = useState(''); // renamed
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetchCategories();
        const catData = Array.isArray(res) ? res : (res as any).data || [];
        setAvailableCategories(catData);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    getCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("The thought content is required.");
      return;
    }

    setSaving(true);
    try {
      await createQuote({
        content,
        author: author || 'Unknown',
        categoryIds: categoryId ? [categoryId] : [], // passing categoryIds
      });
      router.push('/thoughts');
    } catch (err) {
      setError("Server error: Failed to save thought.");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-cyan-400">Add New Thought</h1>
      
      <form onSubmit={handleSave} className="flex flex-col gap-6 bg-neutral-900 p-6 rounded-lg border border-neutral-800 shadow-xl">
        {error && (
          <div className="text-red-500 bg-red-500/10 p-3 rounded border border-red-500 text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        <FormField 
          label="The Thought" 
          type="textarea" 
          placeholder="What's on your mind?" 
          value={content} 
          onChange={setContent} 
        />

        <FormField 
          label="Author / Source" 
          placeholder="e.g. Marcus Aurelius or Self" 
          value={author} 
          onChange={setAuthor} 
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">Category</label>
          <select 
            className="bg-neutral-800 border border-neutral-700 p-2.5 rounded text-white focus:border-cyan-500 outline-none transition-colors cursor-pointer"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">General / Uncategorized</option>
            {availableCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-500 px-8">
            {saving ? 'Saving...' : 'Save Thought'}
          </Button>
        </div>
      </form>
    </div>
  );
}