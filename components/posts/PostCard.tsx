'use client';

import '@/styles/components/postcard.tailwind.css';
import { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
  onClick: (slug: string) => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  return (
    <li
      className={`post-card ${post.layout?.pinned ? 'border-cyan-400' : ''}`}
      onClick={() => onClick(post.slug)}
    >
      <h3 className="post-title">{post.title}</h3>
      <p className="post-meta">
        {post.categories?.map(c => c.name).join(', ')} •{' '}
        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
      </p>
      <p className="post-preview">
        {post.layout?.div?.p || 'No preview available'}
      </p>
    </li>
  );
}
