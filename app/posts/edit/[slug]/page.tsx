'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
// Using getPostBySlug for fetch, but updatePost will use the ID
import { updatePost, getPostBySlug } from '@/lib/postsService';
import TextEditor from '@/components/posts/TextEditor';
import api from '@/lib/api'; 
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

// Define types 
interface Category { id: string; name: string; }
interface Tag { id: string; name: string; }
interface Post {
    id: string; // Internal database ID is critical for update
    title: string;
    content: string | null;
    published: boolean;
    categories: { id: string; name: string }[];
    tags: { id: string; name: string }[];
}


export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  // We still use the slug for the initial lookup, but the ID for the update
  const postSlug = params.slug as string;
  
  // Post state
  const [postId, setPostId] = useState<string | null>(null); // 🎯 This is the ID we will use for the update
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Lookup data state
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  // Page state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    async function fetchData() {
      if (!postSlug) {
        setLoading(false);
        setError("Error: Post slug is missing from the URL.");
        return;
      }
      
      setLoading(true); 
      setError(null);

      try {
        const postRes = await getPostBySlug(postSlug); 
        const postData: Post = postRes;

        const [categoriesRes, tagsRes] = await Promise.all([
          api.get('/categories'), 
          api.get('/tags'),
        ]);

        const categoriesData = categoriesRes.data?.categories || categoriesRes.data;
        const tagsData = tagsRes.data?.tags || tagsRes.data;

        setAvailableCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setAvailableTags(Array.isArray(tagsData) ? tagsData : []);
        setPostId(postData.id); 
        setTitle(postData.title || '');
        setContent(postData.content || 'Start writing your rich text content here...'); 
        setPublished(postData.published ?? false);

        setSelectedCategories((postData.categories || []).map(c => c.id));
        setSelectedTags((postData.tags || []).map(t => t.id));

      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        setError(`Failed to load post for slug: "${postSlug}". It might not exist.`);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [postSlug]); 

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


  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🎯 Use postId for validation
    if (!title.trim() || !content.trim() || !postId) {
      console.error('Validation Error: Post ID, title, and content are required.');
      if (!postId) setError("Cannot update: Internal Post ID is missing. Please reload.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    const postData = {
        title,
        content,
        layout: null, 
        categoryIds: selectedCategories,
        tagIds: selectedTags,
        published, 
    };

    try {
      // 🎯 PASS the internal postId
      const response = await updatePost(postId, postData); 
      
      console.log('Post updated successfully:', response);
      router.push('/posts'); 

    } catch (err: any) {
      console.error('Failed to update post:', err);
      setError('Failed to update post. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) return <LoadingSpinner message={`Loading post slug: ${postSlug || '...'}`} />;
  if (error && !loading) return <ErrorMessage message={error} />;
  
  if (!postId && !loading) return <ErrorMessage message="Error: Post data was loaded, but the internal ID required for update is missing." />;


  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-neutral-900 text-neutral-100 rounded-lg shadow-2xl">
      <h1 className="text-3xl font-bold text-cyan-400">Edit Post: {title}</h1>
      {/* ... (rest of the form UI remains the same) */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title Input */}
        <input
          className="bg-neutral-800 text-neutral-100 border border-neutral-700 px-4 py-2 rounded-lg w-full text-xl focus:border-cyan-500 transition duration-150"
          placeholder="Post Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />

        {/* Rich Text Editor */}
        <div className="min-h-[400px]">
            <TextEditor 
              value={content} 
              onChange={setContent} 
              readOnly={isSubmitting}
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
                    disabled={isSubmitting}
                />
                <label htmlFor="published-checkbox" className="text-lg font-medium select-none">
                    Published
                </label>
            </div>

            {/* Categories Selection */}
            <div className="col-span-1 bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                <h3 className="text-xl font-semibold mb-3 text-cyan-300">Categories</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {availableCategories.length === 0 ? (
                        <p className="text-gray-500 text-sm">No categories available.</p>
                    ) : (
                        availableCategories.map((cat) => (
                            <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(cat.id)}
                                    onChange={(e) => handleCategoryChange(cat.id, e.target.checked)}
                                    className="rounded text-cyan-500 border-gray-600 focus:ring-cyan-500"
                                    disabled={isSubmitting}
                                />
                                <span className="text-gray-200">{cat.name}</span>
                            </label>
                        ))
                    )}
                </div>
            </div>

            {/* Tags Selection */}
            <div className="col-span-1 bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                <h3 className="text-xl font-semibold mb-3 text-cyan-300">Tags</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {availableTags.length === 0 ? (
                        <p className="text-gray-500 text-sm">No tags available.</p>
                    ) : (
                        availableTags.map((tag) => (
                            <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedTags.includes(tag.id)}
                                    onChange={(e) => handleTagChange(tag.id, e.target.checked)}
                                    className="rounded text-cyan-500 border-gray-600 focus:ring-cyan-500"
                                    disabled={isSubmitting}
                                />
                                <span className="text-gray-200">{tag.name}</span>
                            </label>
                        ))
                    )}
                </div>
            </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || loading || !postId} 
          className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition duration-150 transform hover:scale-[1.01] shadow-lg shadow-cyan-900/50 disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving Changes...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
}