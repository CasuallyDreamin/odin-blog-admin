'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/lib/postsService';
import TextEditor from '@/components/posts/TextEditor';
import api from '@/lib/api'; 

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}


export default function NewPostPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('Enter your post content here...');
  const [published, setPublished] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);

  useEffect(() => {
    async function fetchLookups() {
      try {
        // Fetch categories and tags (assuming API endpoints exist)
        const [categoriesRes, tagsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/tags'),
        ]);

        // 🎯 FIX: Safely extract array data from the response object.
        const categoriesData = categoriesRes.data?.categories || categoriesRes.data;
        setAvailableCategories(Array.isArray(categoriesData) ? categoriesData : []);

        const tagsData = tagsRes.data?.tags || tagsRes.data;
        setAvailableTags(Array.isArray(tagsData) ? tagsData : []);
        
      } catch (err) {
        console.error('Failed to fetch categories or tags:', err);
      } finally {
        setLoadingLookups(false);
      }
    }

    fetchLookups();
  }, []);

  const handleCategoryChange = (categoryId: string, isChecked: boolean) => {
    setSelectedCategories(prev => 
      isChecked 
        ? [...prev, categoryId] 
        : prev.filter(id => id !== categoryId)
    );
  };

  const handleTagChange = (tagId: string, isChecked: boolean) => {
    setSelectedTags(prev => 
      isChecked 
        ? [...prev, tagId] 
        : prev.filter(id => id !== tagId)
    );
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      console.error('Validation Error: Title and content are required.');
      return;
    }
    
    const categoryIds = selectedCategories;
    const tagIds = selectedTags;

    try {
      const response = await createPost({
        title,
        content,
        layout: null, 
        categoryIds,
        tagIds,
        published, 
      });

      console.log('Post created successfully:', response);
      
      router.push('/posts');

    } catch (err: any) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-neutral-900 text-neutral-100 rounded-lg shadow-2xl">
      <h1 className="text-3xl font-bold text-cyan-400">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title Input */}
        <input
          className="bg-neutral-800 text-neutral-100 border border-neutral-700 px-4 py-2 rounded-lg w-full text-xl focus:border-cyan-500 transition duration-150"
          placeholder="Post Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Rich Text Editor */}
        <div className="min-h-[400px]">
            <TextEditor 
              value={content} 
              onChange={setContent} 
            />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Publication Status */}
            <div className="flex items-center space-x-3 bg-neutral-800 p-3 rounded-lg border border-neutral-700">
                <input
                    id="published-checkbox"
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-5 w-5 text-cyan-500 rounded border-gray-600 focus:ring-cyan-500"
                />
                <label htmlFor="published-checkbox" className="text-lg font-medium select-none">
                    Publish Immediately
                </label>
            </div>

            {/* Categories Selection */}
            <div className="col-span-1 bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                <h3 className="text-xl font-semibold mb-3 text-cyan-300">Categories</h3>
                {loadingLookups ? (
                    <p className="text-gray-400">Loading...</p>
                ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {availableCategories.length === 0 ? (
                            <p className="text-gray-500 text-sm">No categories available. Create one first.</p>
                        ) : (
                            availableCategories.map((cat) => (
                                <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat.id)}
                                        onChange={(e) => handleCategoryChange(cat.id, e.target.checked)}
                                        className="rounded text-cyan-500 border-gray-600 focus:ring-cyan-500"
                                    />
                                    <span className="text-gray-200">{cat.name}</span>
                                </label>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Tags Selection */}
            <div className="col-span-1 bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                <h3 className="text-xl font-semibold mb-3 text-cyan-300">Tags</h3>
                {loadingLookups ? (
                    <p className="text-gray-400">Loading...</p>
                ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {availableTags.length === 0 ? (
                            <p className="text-gray-500 text-sm">No tags available. Create one first.</p>
                        ) : (
                            availableTags.map((tag) => (
                                <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedTags.includes(tag.id)}
                                        onChange={(e) => handleTagChange(tag.id, e.target.checked)}
                                        className="rounded text-cyan-500 border-gray-600 focus:ring-cyan-500"
                                    />
                                    <span className="text-gray-200">{tag.name}</span>
                                </label>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition duration-150 transform hover:scale-[1.01] shadow-lg shadow-cyan-900/50"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}