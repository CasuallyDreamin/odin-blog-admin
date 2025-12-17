'use client';

import { useEffect, useState } from 'react';
import Topbar from '@/components/admin/Topbar';
import Table, { TableColumn } from '@/components/admin/Table';
import Pagination from '@/components/admin/Pagination';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import CategoryFormModal from '@/components/admin/CategoryFormModal';
import { fetchCategories, deleteCategory } from '@/lib/categoriesService';
import { Category } from '@/types/category';
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadCategories() {
    setLoading(true);

    try {
      const res = await fetchCategories({ page, search, limit: 10 });

      setCategories(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load categories', err);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, [page, search]);

  async function handleConfirmDelete() {
    if (!deleteId) return;
    
    await deleteCategory(deleteId);
    setDeleteId(null);
    
    loadCategories();
  }
  
  const handleCategoryCreated = () => {
      loadCategories();
  };

  const columns: TableColumn<Category>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (c) => (
        <span className="font-medium">{c.name}</span>
      ),
    },
    
    {
      key: 'postCount',
      label: 'Posts',
      render: (c) => {
        return c.postCount ?? 0;
      }
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Topbar
        title="Categories"
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        actions={
          <button
            className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            + Create Category
          </button>
        }
      />

      <Table<Category>
        columns={columns}
        data={categories}
        actions={(row) => (
          <div className="flex gap-3">
            <button
              className="text-cyan-400 hover:text-cyan-300"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Edit category ID:', row.id);
              }}
            >
              Edit
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(row.id);
              }}
              className="text-red-500 hover:text-red-400"
            >
              Delete
            </button>
          </div>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <ConfirmDeleteModal
        open={deleteId !== null}
        itemName="category"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />

      <CategoryFormModal
        isOpen={isModalOpen} // FIXED: Switched from 'open' to 'isOpen'
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCategoryCreated}
      />
    </div>
  );
}