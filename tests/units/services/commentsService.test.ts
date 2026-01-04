import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as commentsService from '@/lib/commentsService';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Comments Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchComments', () => {
    it('fetches comments with default status and pagination', async () => {
      const mockApiResponse = {
        data: {
          comments: [
            { id: 'c1', content: 'Great post', post: { id: 'p1', title: 'Post 1' } }
          ],
          total: 1,
          page: 1
        }
      };
      vi.mocked(api.get).mockResolvedValue(mockApiResponse);

      const result = await commentsService.fetchComments({ page: 1, limit: 10 });

      expect(api.get).toHaveBeenCalledWith('/comments', {
        params: { page: 1, limit: 10, search: '', status: 'pending' }
      });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].post.title).toBe('Post 1');
    });

    it('handles search and custom status filters', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { comments: [], total: 0 } });

      await commentsService.fetchComments({ search: 'spam', status: 'approved' });

      expect(api.get).toHaveBeenCalledWith('/comments', {
        params: { page: 1, limit: 10, search: 'spam', status: 'approved' }
      });
    });
  });

  describe('setCommentApprovalStatus', () => {
    it('calls the status endpoint with approval boolean', async () => {
      const mockResponse = { id: 'c1', isApproved: true };
      vi.mocked(api.put).mockResolvedValue({ data: mockResponse });

      const result = await commentsService.setCommentApprovalStatus('c1', true);

      expect(api.put).toHaveBeenCalledWith('/comments/c1/status', { isApproved: true });
      expect(result.isApproved).toBe(true);
    });
  });

  describe('fetchCommentsCount', () => {
    it('calls the pending count endpoint and returns the number', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { count: 5 } });

      const result = await commentsService.fetchCommentsCount();

      expect(api.get).toHaveBeenCalledWith('/comments/count/pending');
      expect(result).toBe(5);
    });
  });

  describe('deleteComment', () => {
    it('calls the delete method for the given comment id', async () => {
      vi.mocked(api.delete).mockResolvedValue({ status: 200 });

      await commentsService.deleteComment('c_123');

      expect(api.delete).toHaveBeenCalledWith('/comments/c_123');
    });
  });
});