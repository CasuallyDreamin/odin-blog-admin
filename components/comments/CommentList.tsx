'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Comment } from '@/types/comment';
import api from '@/lib/api';
import '@/styles/components/comments.tailwind.css';

interface CommentListProps {
  comments: Comment[];
  onUpdate?: (updated: Comment[]) => void;
}

export default function CommentList({ comments, onUpdate }: CommentListProps) {
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.delete(`/comments/${id}`);
      const updated = localComments.filter(c => c.id !== id);
      setLocalComments(updated);
      onUpdate?.(updated);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Could not delete comment. Try again.');
    }
  };

  const togglePublished = async (c: Comment) => {
    try {
      const res = await api.patch(`/comments/${c.id}`, { isApproved: !c.isApproved });
      const updated = localComments.map(comment =>
        comment.id === c.id ? { ...comment, published: res.data.published } : comment
      );
      setLocalComments(updated);
      onUpdate?.(updated);
    } catch (err) {
      console.error('Failed to update comment:', err);
      alert('Could not update comment. Try again.');
    }
  };

  return (
    <motion.section
      className="comments-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <h2 className="comments-title">Comments</h2>

      {localComments.length === 0 ? (
        <p className="no-comments">No comments yet.</p>
      ) : (
        <ul className="comments-list">
          {localComments.map((c) => (
            <motion.li
              key={c.id}
              className={`comment-item ${!c.isApproved ? 'comment-unpublished' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="comment-author">{c.author}</p>
              <p className="comment-date">
                {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
              </p>
              <p className="comment-body">{c.body}</p>

              <div className="comment-controls mt-2 flex gap-2">
                <button
                  className="btn-delete text-red-500 text-sm"
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </button>
                <button
                  className="btn-toggle text-cyan-500 text-sm"
                  onClick={() => togglePublished(c)}
                >
                  {c.isApproved ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}
