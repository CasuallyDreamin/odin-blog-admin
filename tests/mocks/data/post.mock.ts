import { Post } from '@/types/post';
import { createMockCategory } from './category.mock';
import { createMockComment } from './comment.mock';

export const createMockPost = (overrides?: Partial<Post>): Post => ({
  id: 'uuid-1234-5678',
  slug: 'test-post-slug',
  title: 'Default Mock Title',
  content: '<p>Default mock content</p>',
  published: false,
  tags: ['testing'],
  categories: [createMockCategory()],
  layout: {
    pinned: false,
    div: { p: 'default-layout-text' }
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  comments: [createMockComment()],
  ...overrides,
});

export const mockPostList: Post[] = [
  createMockPost({ 
    id: 'post-1', 
    title: 'First Integration Post', 
    slug: 'first-post', 
    published: true 
  }),
  createMockPost({ 
    id: 'post-2', 
    title: 'Second Draft Post', 
    slug: 'second-post', 
    published: false 
  }),
  createMockPost({ 
    id: 'post-3', 
    title: 'Pinned Content', 
    slug: 'pinned-post', 
    layout: { pinned: true } 
  }),
];