'use client';

import { useState, useEffect, useCallback } from 'react';

import { 
  fetchComments, 
  deleteComment, 
  CommentWithPost,
  setCommentApprovalStatus 
} from '@/lib/commentsService';

import ErrorMessage from '@/components/ErrorMessage';
import LoadingSpinner from '@/components/LoadingSpinner';
import FilterBar from '@/components/admin/FilterBar'; // Keep for search, remove for status filter
import Table, { TableColumn } from '@/components/admin/Table';
import Pagination from '@/components/admin/Pagination';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import StatusDot from '@/components/admin/StatusDot';
import Link from 'next/link';

const ITEMS_PER_PAGE = 10;
type StatusKey = 'all' | 'pending' | 'approved';
const STATUS_OPTIONS: { label: string; value: StatusKey }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
];


export default function CommentsPage() {
  // 1. STATE MANAGEMENT
  const [comments, setComments] = useState<CommentWithPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusKey>('all'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<CommentWithPost | null>(null);

  const loadCommentsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchComments({ 
        page: page, 
        limit: ITEMS_PER_PAGE, 
        search: search, 
        status: statusFilter 
      });

      setComments(response.data);
      setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));

    } catch (err: any) {
      console.error('Failed to fetch comments:', err);
      setError(err.response?.data?.error || 'Failed to load comments.');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]); 

  useEffect(() => {
    loadCommentsData();
  }, [loadCommentsData]);


  const handleToggleApproval = async (comment: CommentWithPost) => {
    setLoading(true);
    const newStatus = !comment.isApproved;
    
    try {
      await setCommentApprovalStatus(comment.id, newStatus); 

      loadCommentsData();
      
    } catch (err: any) {
      console.error('Failed to toggle comment approval:', err);
      setError(err.response?.data?.error || 'Failed to toggle comment approval.');
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    if (!commentToDelete) return;
    setLoading(true); 
    setIsDeleteModalOpen(false); 
    setError(null);

    try {
      await deleteComment(commentToDelete.id);
      loadCommentsData();
    } catch (err: any) {
      console.error('Failed to delete comment:', err);
      setError(err.response?.data?.error || 'Failed to delete comment.');
      setLoading(false);
    } finally {
      setCommentToDelete(null);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearch(query);
    setPage(1); 
  };

  const handleStatusChange = (status: StatusKey) => {
    setStatusFilter(status);
    setPage(1); 
  };
  
  // --- Table Column Definition ---
  const columns: TableColumn<CommentWithPost>[] = [
    {
      key: 'isApproved',
      label: 'Status',
      width: '100px',
      render: (c) => {
        const status = c.isApproved ? 'published' : 'draft';
        return (
          <div className="flex items-center gap-2">
            <StatusDot status={status} />
            <span className="capitalize text-xs">
              {c.isApproved ? 'Approved' : 'Pending'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'post.title',
      label: 'Post Title',
      render: (c) => (
        <Link 
          href={`/posts/edit/${c.post.id}`} 
          className="text-cyan-400 hover:underline"
          onClick={(e) => e.stopPropagation()} 
        >
          {c.post.title}
        </Link>
      ),
    },
    {
      key: 'author',
      label: 'Author',
      width: '150px',
      render: (c) => (
        <span className="font-medium">
          {c.author}
          {c.authorEmail && <span className="text-xs text-gray-500 block">{c.authorEmail}</span>}
        </span>
      )
    },
    {
      key: 'body',
      label: 'Comment Snippet',
      render: (c) => (
        <span className="text-gray-400">
          {c.body.length > 80 ? `${c.body.substring(0, 80)}...` : c.body}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created At',
      width: '120px',
      render: (c) => new Date(c.createdAt).toLocaleDateString(),
    },
  ];

  const showTable = !loading && comments.length > 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">💬 Comment Management</h1>
      <div className="flex justify-between items-center mb-6">
        <FilterBar
          searchTerm={search}
          onSearchChange={handleSearchChange}
          placeholder="Search comments or author..."
        />

        {/* Status Filter Buttons */}
        <div className="flex gap-2">
            {STATUS_OPTIONS.map(option => (
                <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        statusFilter === option.value
                            ? 'bg-cyan-600 text-white'
                            : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                    }`}
                    disabled={loading}
                >
                    {option.label}
                </button>
            ))}
        </div>
      </div>
      
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && comments.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No comments found for the current filter.
        </div>
      )}

      {showTable && (
        <>
          <Table<CommentWithPost>
            columns={columns}
            data={comments}
            onRowClick={() => {}} 
            actions={(comment) => (
              <div className="flex gap-3 items-center">
                <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleApproval(comment);
                    }}
                    className={`disabled:opacity-50 text-sm transition-colors ${
                      comment.isApproved 
                        ? 'text-yellow-500 hover:text-yellow-400' 
                        : 'text-green-500 hover:text-green-400'
                    }`}
                    disabled={loading}
                  >
                    {comment.isApproved ? 'Unapprove' : 'Approve'}
                </button>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommentToDelete(comment);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-red-500 hover:text-red-400 disabled:opacity-50 text-sm"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            )}
          />
          
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onChange={setPage}
            disabled={loading}
          />
        </>
      )}

      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        itemName="comment"
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setCommentToDelete(null);
        }}
        onConfirm={handleDelete}
        message={`Are you sure you want to permanently delete the comment by "${commentToDelete?.author}"? This action cannot be undone.`}
      />
    </div>
  );
}