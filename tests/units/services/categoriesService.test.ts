import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as categoriesService from '@/lib/categoriesService';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Categories Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchCategories', () => {
    it('fetches categories and calculates pagination correctly', async () => {
      const mockApiResponse = {
        data: {
          categories: [{ id: '1', name: 'Tech' }, { id: '2', name: 'Life' }],
          total: 25,
        },
      };
      vi.mocked(api.get).mockResolvedValue(mockApiResponse);

      const result = await categoriesService.fetchCategories({ limit: 10, page: 1 });

      expect(api.get).toHaveBeenCalledWith('/categories', {
        params: { page: 1, limit: 10, search: '' },
      });
      
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(25);
      expect(result.totalPages).toBe(3); 
    });

    it('returns empty data when api returns nothing', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: {} });
      const result = await categoriesService.fetchCategories();
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('getCategoryById', () => {
    it('calls the specific category endpoint', async () => {
      const mockCategory = { id: 'cat_1', name: 'Design' };
      vi.mocked(api.get).mockResolvedValue({ data: mockCategory });

      const result = await categoriesService.getCategoryById('cat_1');

      expect(api.get).toHaveBeenCalledWith('/categories/cat_1');
      expect(result.name).toBe('Design');
    });
  });

  describe('createCategory', () => {
    it('sends a post request with the category payload', async () => {
      const payload = { name: 'New Category' };
      vi.mocked(api.post).mockResolvedValue({ data: { id: '123', ...payload } });

      const result = await categoriesService.createCategory(payload);

      expect(api.post).toHaveBeenCalledWith('/categories', payload);
      expect(result.id).toBe('123');
    });
  });

  describe('updateCategory', () => {
    it('sends a put request to update category data', async () => {
      const updateData = { name: 'Updated Tech' };
      vi.mocked(api.put).mockResolvedValue({ data: { id: '1', ...updateData } });

      const result = await categoriesService.updateCategory('1', updateData);

      expect(api.put).toHaveBeenCalledWith('/categories/1', updateData);
      expect(result.name).toBe('Updated Tech');
    });
  });

  describe('deleteCategory', () => {
    it('calls the delete method for the given id', async () => {
      vi.mocked(api.delete).mockResolvedValue({ status: 200 });

      await categoriesService.deleteCategory('999');

      expect(api.delete).toHaveBeenCalledWith('/categories/999');
    });
  });
});