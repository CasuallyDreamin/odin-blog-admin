'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import api from '@/lib/api';
import { fetchTags } from '@/lib/tagsService';
import { fetchCategories } from '@/lib/categoriesService';

interface ProjectPayload {
  title: string;
  description: string;
  content: string;
  published: boolean;
  tagIds: string[];
  categoryIds: string[];
}

async function createProject(data: ProjectPayload) {
  const res = await api.post('/projects', data);
  return res.data;
}

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [tagList, categoryList] = await Promise.all([fetchTags(), fetchCategories()]);
      setTags(tagList.data);
      setCategories(categoryList.data);
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProject({
        title,
        description,
        content,
        published,
        tagIds: selectedTags,
        categoryIds: selectedCategories,
      });
      router.push('/projects');
    } catch (err) {
      console.error('Failed to create project', err);
      setLoading(false);
    }
  };

  const renderSelectedBadges = (items: string[], allItems: { id: string; name: string }[], setter: Function) => (
    <div className="flex flex-wrap gap-2 mt-1">
      {items.map((id) => {
        const item = allItems.find((t) => t.id === id);
        return (
          <span
            key={id}
            className="px-2 py-1 bg-cyan-600 text-white rounded cursor-pointer"
            onClick={() => setter(items.filter((t) => t !== id))}
          >
            {item?.name} ×
          </span>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Title" value={title} onChange={setTitle} required />
        <FormField label="Description" type="textarea" value={description} onChange={setDescription} />
        <FormField label="Content" type="textarea" value={content} onChange={setContent} />

        <FormField
          label="Published"
          type="select"
          value={published ? 'true' : 'false'}
          onChange={(val) => setPublished(val === 'true')}
          options={['true', 'false']}
        />

        {/* Tags multi-select */}
        <FormField
          label="Tags"
          type="select"
          value=""
          onChange={(val) => {
            if (val && !selectedTags.includes(val)) setSelectedTags([...selectedTags, val]);
          }}
          options={tags.map((t) => t.id)}
        />
        {renderSelectedBadges(selectedTags, tags, setSelectedTags)}

        {/* Categories multi-select */}
        <FormField
          label="Categories"
          type="select"
          value=""
          onChange={(val) => {
            if (val && !selectedCategories.includes(val)) setSelectedCategories([...selectedCategories, val]);
          }}
          options={categories.map((c) => c.id)}
        />
        {renderSelectedBadges(selectedCategories, categories, setSelectedCategories)}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500"
        >
            {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}
