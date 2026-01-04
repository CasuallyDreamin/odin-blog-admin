import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as projectsService from '@/lib/projectsService';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Projects Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchProjects', () => {
    it('returns projects and calculates totalPages with a default limit', async () => {
      const mockApiResponse = {
        data: {
          projects: [{ id: 'p1', title: 'Portfolio Site' }],
          total: 25,
        },
      };
      vi.mocked(api.get).mockResolvedValue(mockApiResponse);

      const result = await projectsService.fetchProjects({ page: 1, limit: 10 });

      expect(api.get).toHaveBeenCalledWith('/projects', {
        params: { page: 1, limit: 10, search: undefined },
      });
      expect(result.data).toHaveLength(1);
      expect(result.totalPages).toBe(3);
    });

    it('uses default limit of 10 for pagination calculation if limit is undefined', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { total: 15, projects: [] } });

      const result = await projectsService.fetchProjects({ page: 1 });

      expect(result.totalPages).toBe(2);
    });
  });

  describe('getProjectBySlug & getProjectById', () => {
    it('fetches a project by its slug', async () => {
      const mockProject = { id: 'p1', slug: 'my-project', title: 'Project A' };
      vi.mocked(api.get).mockResolvedValue({ data: mockProject });

      const result = await projectsService.getProjectBySlug('my-project');

      expect(api.get).toHaveBeenCalledWith('/projects/my-project');
      expect(result.title).toBe('Project A');
    });

    it('fetches a project by its ID', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { id: 'id-123' } });

      const result = await projectsService.getProjectById('id-123');

      expect(api.get).toHaveBeenCalledWith('/projects/id-123');
      expect(result.id).toBe('id-123');
    });
  });

  describe('create & update', () => {
    it('sends a POST request with the new project data', async () => {
      const payload = { title: 'New App', description: 'Cool app' };
      vi.mocked(api.post).mockResolvedValue({ data: { id: 'new-p', ...payload } });

      const result = await projectsService.createProject(payload as any);

      expect(api.post).toHaveBeenCalledWith('/projects', payload);
      expect(result.id).toBe('new-p');
    });

    it('sends a PUT request for updates', async () => {
      const payload = { published: true };
      vi.mocked(api.put).mockResolvedValue({ data: { id: 'p1', ...payload } });

      const result = await projectsService.updateProject('p1', payload);

      expect(api.put).toHaveBeenCalledWith('/projects/p1', payload);
      expect(result.published).toBe(true);
    });
  });

  describe('deleteProject', () => {
    it('calls the delete method with the correct project id', async () => {
      vi.mocked(api.delete).mockResolvedValue({ status: 200 });

      await projectsService.deleteProject('p_delete');

      expect(api.delete).toHaveBeenCalledWith('/projects/p_delete');
    });
  });
});