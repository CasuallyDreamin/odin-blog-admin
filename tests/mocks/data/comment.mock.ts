import { Comment } from '@/types/comment';

export const createMockComment = (overrides?: Partial<Comment>): Comment => ({
  id: 'comm-123',
  author: 'John Doe',
  authorEmail: 'john@example.com',
  body: 'This is a test comment.',
  createdAt: new Date().toISOString(),
  postId: 'uuid-1234-5678',
  isApproved: false,
  ...overrides,
});

export const mockComments: Comment[] = [
  createMockComment({ id: 'c1', author: 'Alice', isApproved: true }),
  createMockComment({ id: 'c2', author: 'Bob', body: 'Another comment' }),
];