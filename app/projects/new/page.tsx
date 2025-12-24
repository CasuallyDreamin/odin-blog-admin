'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/admin/FormField';
import api from '@/lib/api';
import { fetchTags } from '@/lib/tagsService';
import { fetchCategories } from '@/lib/categoriesService';
import TextEditor from '@/components/posts/TextEditor';
import { Button } from '@/components/ui/Button';

interface ProjectPayload {
  title: string;
  description: string;
  content: string;
  preview: string;
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
  
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [tagList, categoryList] = await Promise.all([fetchTags(), fetchCategories()]);
        setTags(tagList.data || []);
        setCategories(categoryList.data || []);
      } catch (err) {
        console.error('Failed to load metadata', err);
      }
    }
    loadData();
  }, []);

  const handleCategoryChange = (id: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleTagChange = (id: string, checked: boolean) => {
    setSelectedTags((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (!content.trim() || content === "<p><br></p>") {
      setError("Project content cannot be empty.");
      return;
    }

    setLoading(true);

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const firstParagraph = tempDiv.querySelector("p")?.textContent || "";
    const generatedPreview = firstParagraph.substring(0, 180).trim();

    try {
      await createProject({
        title,
        description,
        content,
        preview: generatedPreview,
        published,
        tagIds: selectedTags,
        categoryIds: selectedCategories,
      });
      router.push('/projects');
    } catch (err) {
      console.error('Failed to create project', err);
      setError("Server error: Failed to create project.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-neutral-900 text-neutral-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-cyan-400">Create New Project</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <FormField label="Title" value={title} onChange={setTitle} required />
            <FormField 
              label="Description (Internal)" 
              type="textarea" 
              value={description} 
              onChange={setDescription} 
            />
            
            <div className="flex items-center space-x-3 bg-neutral-800 p-4 rounded-lg border border-neutral-700">
              <input
                id="published-checkbox"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-5 w-5 text-cyan-500 rounded border-gray-600 focus:ring-cyan-500"
              />
              <label htmlFor="published-checkbox" className="text-lg font-medium select-none cursor-pointer">
                Publish Project
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
              <h3 className="text-sm font-semibold mb-3 text-cyan-300 uppercase tracking-wider">Categories</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={(e) => handleCategoryChange(cat.id, e.target.checked)}
                      className="rounded text-cyan-500 border-gray-600"
                    />
                    <span className="text-sm text-gray-200">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
              <h3 className="text-sm font-semibold mb-3 text-cyan-300 uppercase tracking-wider">Tags</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={(e) => handleTagChange(tag.id, e.target.checked)}
                      className="rounded text-cyan-500 border-gray-600"
                    />
                    <span className="text-sm text-gray-200">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <label className="font-semibold text-cyan-300 uppercase tracking-wider text-sm">Project Content</label>
          <div className="min-h-[400px] border border-neutral-700 rounded-lg overflow-hidden bg-neutral-800">
            <TextEditor value={content} onChange={setContent} />
          </div>
        </section>

        <div className="flex justify-end gap-4 border-t border-neutral-800 pt-6">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={loading}>
            Discard
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="px-8 bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  );
}