'use client';

import PostCard from './PostCard';
import { Post } from '@/types/post';

interface PinnedPostCardProps {
  post: Post;
  onClick: (slug: string) => void;
}

export default function PinnedPostCard({ post, onClick }: PinnedPostCardProps) {
  return (
    <PostCard
      post={{ ...post, layout: { ...post.layout, pinned: true } }}
      onClick={onClick}
    />
  );
}
