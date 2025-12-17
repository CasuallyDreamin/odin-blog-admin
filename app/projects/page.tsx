'use client';

import { useEffect, useState } from 'react';
import Topbar from '@/components/admin/Topbar';
import Table, { TableColumn } from '@/components/admin/Table';
import Pagination from '@/components/admin/Pagination';
import Badge from '@/components/admin/Badge';
import StatusDot from '@/components/admin/StatusDot';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import { fetchProjects, deleteProject } from '@/lib/projectsService';
import { Project } from '@/types/project';
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function loadProjects() {
    setLoading(true);
    try {
      const res = await fetchProjects({ page, search, limit: 10 });
      setProjects(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load projects', err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, [page, search]);

  const columns: TableColumn<Project>[] = [
    { key: 'title', label: 'Title' },
    {
      key: 'categories',
      label: 'Categories',
      render: (p) =>
        p.categories?.length
          ? p.categories.map(c => <Badge key={c.id}>{c.name}</Badge>)
          : '—',
    },
    {
      key: 'published',
      label: 'Status',
      render: (p) => {
        const status = p.published ? 'published' : 'draft';
        return (
          <div className="flex items-center gap-2">
            <StatusDot status={status} />
            <span className="capitalize">{status}</span>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (p) => new Date(p.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Topbar
        title="Projects"
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        actions={
          <Link
            href="/projects/new"
            className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-sm"
          >
            + Create Project
          </Link>
        }
      />

      <Table<Project>
        columns={columns}
        data={projects}
        onRowClick={(row) => row.slug && (window.location.href = `/projects/edit/${row.slug}`)}
        actions={(row) => (
          <div className="flex gap-3">
            <Link
              href={`/projects/edit/${row.slug}`}
              className="text-cyan-400 hover:text-cyan-300"
              onClick={(e) => e.stopPropagation()}
            >
              Edit
            </Link>
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
        itemName="project"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await deleteProject(deleteId);
          setDeleteId(null);
          loadProjects();
        }}
      />
    </div>
  );
}
