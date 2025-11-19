'use client';

import { motion } from 'framer-motion';
import '@/styles/components/comments.tailwind.css';

export default function CommentList({ comments }) {
  return (
    <motion.section
      className="comments-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <h2 className="comments-title">Comments</h2>

      {comments.length === 0 ? (
        <p className="no-comments">No comments yet. Be the first!</p>
      ) : (
        <ul className="comments-list">
          {comments.map((c) => (
            <motion.li
              key={c.id}
              className="comment-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="comment-author">{c.author || c.name}</p>
              <p className="comment-date">
                {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
              </p>
              <p className="comment-body">{c.body || c.comment}</p>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}
