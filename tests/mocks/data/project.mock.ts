import { Project, FetchProjectsResponse } from '@/types/project';

export const createMockProject = (overrides?: Partial<Project>): Project => ({
  id: 'proj-1',
  title: 'Portfolio Website',
  slug: 'portfolio-website',
  description: 'My personal portfolio built with Next.js',
  content: '<p>Project content goes here</p>',
  createdAt: new Date().toISOString(),
  published: true,
  tags: [],
  categories: [],
  media: [
    { id: 'm1', filePath: '/uploads/project.png', mimeType: 'image/png', altText: 'Project screenshot' }
  ],
  ...overrides,
});

export const mockProjectList: FetchProjectsResponse = {
  data: [createMockProject()],
  total: 1,
  page: 1,
  totalPages: 1,
};