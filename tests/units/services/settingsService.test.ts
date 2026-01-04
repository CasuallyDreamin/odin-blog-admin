import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as settingsService from '@/lib/settingsService';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe('Settings Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchSettings', () => {
    it('fetches the global blog settings', async () => {
      const mockSettings = {
        blogName: 'My Awesome Blog',
        tagline: 'Reflections on Code',
        postsPerPage: 10,
        theme: 'dark'
      };
      vi.mocked(api.get).mockResolvedValue({ data: mockSettings });

      const result = await settingsService.fetchSettings();

      expect(api.get).toHaveBeenCalledWith('/settings');
      expect(result.blogName).toBe('My Awesome Blog');
      expect(result.theme).toBe('dark');
    });
  });

  describe('updateSettings', () => {
    it('sends a PUT request with partial settings data', async () => {
      const payload = { blogName: 'New Title', theme: 'light' };
      const mockResponse = { ...payload, updatedAt: '2023-10-01' };
      
      vi.mocked(api.put).mockResolvedValue({ data: mockResponse });

      const result = await settingsService.updateSettings(payload);

      expect(api.put).toHaveBeenCalledWith('/settings', payload);
      expect(result.blogName).toBe('New Title');
      expect(result.updatedAt).toBeDefined();
    });
  });
});