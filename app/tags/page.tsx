"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/admin/Topbar";
import Table, { TableColumn } from "@/components/admin/Table";
import Pagination from "@/components/admin/Pagination";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import { fetchTags, deleteTag } from "@/lib/tagsService";
import { Tag } from "@/types/tag";
import Link from "next/link";

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function loadTags() {
    setLoading(true);
    try {
      const res = await fetchTags({ page, search, limit: 10 });
      setTags(res.data);
      setTotalPages(res.totalPages ?? 1);
    } catch (err) {
      console.error("Failed to load tags", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadTags();
  }, [page, search]);

  const columns: TableColumn<Tag>[] = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "posts",
      label: "Posts",
      render: (t) => (t.posts ? t.posts.length : 0),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Topbar
        title="Tags"
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        actions={
          <Link
            href="/tags/new"
            className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-sm"
          >
            + Create Tag
          </Link>
        }
      />

      <Table<Tag>
        columns={columns}
        data={tags}
        onRowClick={(row) => (row.id ? (window.location.href = `/tags/edit/${row.id}`) : null)}
        actions={(row) => (
          <div className="flex gap-3">
            <Link
              href={`/tags/edit/${row.id}`}
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
        itemName="tag"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await deleteTag(deleteId);
          setDeleteId(null);
          loadTags();
        }}
      />
    </div>
  );
}
