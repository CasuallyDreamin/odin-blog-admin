import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as postsService from '@/lib/postsService';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Posts Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPosts', () => {
    it('fetches posts and calculates pagination correctly', async () => {
      const mockApiResponse = {
        data: {
          posts: [{ id: '1', title: 'First Post' }],
          total: 15,
          page: 1,
        },
      };
      vi.mocked(api.get).mockResolvedValue(mockApiResponse);

      const result = await postsService.fetchPosts({ page: 1, limit: 10, search: 'test' });

      expect(api.get).toHaveBeenCalledWith('/posts', {
        params: { page: 1, limit: 10, search: 'test' },
      });
      expect(result.data).toHaveLength(1);
      expect(result.totalPages).toBe(2); 
    });
  });

  describe('getPostBySlug & getPostById', () => {
    it('fetches a post by its slug', async () => {
      const mockPost = { id: '1', slug: 'my-slug', title: 'Post Title' };
      vi.mocked(api.get).mockResolvedValue({ data: mockPost });

      const result = await postsService.getPostBySlug('my-slug');

      expect(api.get).toHaveBeenCalledWith('/posts/my-slug');
      expect(result.title).toBe('Post Title');
    });

    it('fetches a post by its ID', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { id: 'uuid-123' } });

      const result = await postsService.getPostById('uuid-123');

      expect(api.get).toHaveBeenCalledWith('/posts/uuid-123');
      expect(result.id).toBe('uuid-123');
    });
  });

  describe('create & update', () => {
    it('creates a post with the provided payload', async () => {
      const payload = { title: 'New', content: 'Body' };
      vi.mocked(api.post).mockResolvedValue({ data: { id: 'new-id', ...payload } });

      const result = await postsService.createPost(payload as any);

      expect(api.post).toHaveBeenCalledWith('/posts', payload);
      expect(result.id).toBe('new-id');
    });

    it('updates a post using PUT', async () => {
      const payload = { title: 'Updated' };
      vi.mocked(api.put).mockResolvedValue({ data: { id: '1', ...payload } });

      const result = await postsService.updatePost('1', payload);

      expect(api.put).toHaveBeenCalledWith('/posts/1', payload);
      expect(result.title).toBe('Updated');
    });
  });

  describe('fetchTags', () => {
    it('returns an array of tags on success', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { tags: [{ id: 't1', name: 'React' }] } });

      const tags = await postsService.fetchTags();

      expect(api.get).toHaveBeenCalledWith('/tags');
      expect(tags).toHaveLength(1);
      expect(tags[0].name).toBe('React');
    });

    it('returns an empty array and logs error on failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(api.get).mockRejectedValue(new Error('API Down'));

      const tags = await postsService.fetchTags();

      expect(tags).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});