import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as tagsService from '@/lib/tagsService';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Tags Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchTags', () => {
    it('calls /tags with correct params and transforms response', async () => {
      const mockData = {
        tags: [{ id: '1', name: 'JavaScript' }],
        total: 1,
        page: 1,
        totalPages: 1,
      };
      
      vi.mocked(api.get).mockResolvedValue({ data: mockData });

      const result = await tagsService.fetchTags({ page: 1, limit: 10, search: 'js' });

      expect(api.get).toHaveBeenCalledWith('/tags', {
        params: { page: 1, limit: 10, search: 'js' },
      });
      expect(result.data).toEqual(mockData.tags);
      expect(result.total).toBe(1);
    });

    it('defaults to empty array if tags are missing from response', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: {} });

      const result = await tagsService.fetchTags();
      expect(result.data).toEqual([]);
    });
  });

  describe('getTagById', () => {
    it('fetches a single tag by ID', async () => {
      const mockTag = { id: '5', name: 'Testing' };
      vi.mocked(api.get).mockResolvedValue({ data: mockTag });

      const result = await tagsService.getTagById('5');

      expect(api.get).toHaveBeenCalledWith('/tags/5');
      expect(result).toEqual(mockTag);
    });
  });

  describe('createTag', () => {
    it('sends a post request with the name payload', async () => {
      const payload = { name: 'New Tag' };
      vi.mocked(api.post).mockResolvedValue({ data: { id: '10', ...payload } });

      const result = await tagsService.createTag(payload);

      expect(api.post).toHaveBeenCalledWith('/tags', payload);
      expect(result.name).toBe('New Tag');
    });
  });

  describe('deleteTag', () => {
    it('calls the delete method with the correct ID', async () => {
      vi.mocked(api.delete).mockResolvedValue({ status: 200 });

      await tagsService.deleteTag('99');

      expect(api.delete).toHaveBeenCalledWith('/tags/99');
    });
  });
});