"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/admin/Topbar";
import Table, { TableColumn } from "@/components/admin/Table";
import Pagination from "@/components/admin/Pagination";
import { fetchMedia, deleteMedia } from "@/lib/mediaService";
import { Media } from "@/types/media";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import Link from "next/link";

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadMedia = async () => {
    try {
        const res = await fetchMedia({ page, search, limit: 10 });

        console.log("MEDIA RESPONSE:", res);

        setMedia(res.data || []);
        setTotalPages(res.totalPages || 1);
    } catch (err) {
        console.error(err);
        setMedia([]);
        setTotalPages(1);
    }
    };

  useEffect(() => {
    loadMedia();
  }, [page, search]);

  const columns: TableColumn<Media>[] = [
    {
        key: "index",
        label: "#",
        render: (m) => {
          const index = media.findIndex(item => item.id === m.id);
          return (page - 1) * 10 + index + 1;
      }
    },
    {
      key: "name",
      label: "Name",
      render: (m) =>
        m.altText ||
        m.filePath.split("/").pop() ||
        "—",
    },
    {
        key: "filePath",
        label: "URL",
        render: (m) => {
            const [copied, setCopied] = useState(false);

            const handleCopy = async (e: React.MouseEvent) => {
            e.stopPropagation();
            try {
                await navigator.clipboard.writeText(m.filePath);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
            };

            return (
            <span
                onClick={handleCopy}
                className="text-cyan-400 hover:text-cyan-300 truncate block max-w-xs cursor-pointer select-all"
                title="Click to copy"
            >
                {copied ? "Copied!" : m.filePath}
            </span>
            );
        },
        },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Topbar
        title="Media Library"
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        actions={
          <Link
            href="/media/upload"
            className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-sm"
          >
            + Upload Media
          </Link>
        }
      />

      <Table<Media>
        columns={columns}
        data={Array.isArray(media) ? media : []}
        actions={(row) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(row.id);
            }}
            className="text-red-500 hover:text-red-400"
          >
            Delete
          </button>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <ConfirmDeleteModal
        open={deleteId !== null}
        itemName="media"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await deleteMedia(deleteId);
          setDeleteId(null);
          loadMedia();
        }}
      />
    </div>
  );
}
