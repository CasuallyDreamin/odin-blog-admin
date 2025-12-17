'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/admin/Modal';
import FormField from '@/components/admin/FormField';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { createCategory, updateCategory, CreateCategoryPayload } from '@/lib/categoriesService';
import { Category } from '@/types/category';

interface CategoryFormModalProps {
  isOpen: boolean; 
  onClose: () => void;
  onSuccess: () => void;
  category?: Category | null; // For editing
}

export default function CategoryFormModal({ isOpen, onClose, onSuccess, category }: CategoryFormModalProps) {
  const isEditing = !!category;
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to set initial state when in Edit mode
  useEffect(() => {
    if (isEditing && category) {
      setName(category.name);
      setError(null);
    } else {
      setName('');
      setError(null);
    }
  }, [category, isEditing, isOpen]); // Added isOpen to re-run when opened/closed

  const resetForm = () => {
    setName('');
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    const payload: CreateCategoryPayload = { name: name.trim() };

    setLoading(true);
    setError(null);

    try {
      if (isEditing && category) {
        await updateCategory(category.id, payload);
      } else {
        await createCategory(payload);
      }
      
      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error('Category operation failed', err);
      setError(err.response?.data?.error || `Failed to ${isEditing ? 'update' : 'create'} category. Ensure the name is unique.`);
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = isEditing ? `Edit Category: ${category?.name}` : 'Create New Category';
  const submitLabel = isEditing ? 'Save Changes' : 'Create Category';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-(--bg-secondary) p-4 rounded-lg">
        {error && <ErrorMessage message={error} />}

        <FormField 
          label="Category Name" 
          type="text"
          value={name}
          onChange={setName}
          required={true}
        />
        
        {isEditing && category && (
            <div className='flex gap-4'>
                <FormField 
                    label="ID" 
                    type="text"
                    value={category.id}
                    onChange={()=>{}}                  
                />
            </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm text-neutral-100 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition duration-150"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"

            className="flex items-center justify-center px-4 py-2 text-sm text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition duration-150 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <LoadingSpinner/> : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}