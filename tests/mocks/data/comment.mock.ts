import { CommentWithPost } from '@/lib/commentsService';

export const createMockComment = (overrides?: Partial<CommentWithPost>): CommentWithPost => ({
  id: 'c-1',
  author: 'Alice',
  authorEmail: 'alice@example.com',
  body: 'This is a great post!',
  createdAt: new Date().toISOString(),
  postId: 'p1',
  isApproved: true,
  post: {
    id: 'p1',
    title: 'Example Post'
  },
  ...overrides,
});

export const mockCommentList = {
  data: [
    createMockComment({ id: 'c-1', author: 'Alice', body: 'This is a test comment.' }),
    createMockComment({ 
      id: 'c-2', 
      author: 'Bob', 
      body: 'Another comment', 
      isApproved: false,
      authorEmail: 'john@example.com' 
    }),
  ],
  total: 2,
  page: 1,
  totalPages: 1,
};