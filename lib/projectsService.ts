import api from './api';
import { Project, FetchProjectsResponse } from '@/types/project';

export interface FetchProjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}

export interface CreateProjectPayload {
  title: string;
  description?: string;
  content?: string;
  published?: boolean;
  categoryIds?: string[];
  tagIds?: string[];
}

export async function fetchProjects({ page, limit, search }: FetchProjectsParams) {
  const res = await api.get('/projects', {
    params: { page, limit, search }
  });

  const json = res.data;

  return {
    data: json.projects ?? [],
    totalPages: Math.ceil((json.total ?? 0) / (limit || 10)),
  };
}

export async function getProjectById(id: string) {
  const res = await api.get(`/projects/${id}`);
  return res.data as Project;
}

export async function getProjectBySlug(slug: string) {
  const res = await api.get(`/projects/${slug}`);
  return res.data as Project;
}

export async function createProject(data: CreateProjectPayload) {
  const res = await api.post('/projects', data);
  return res.data as Project;
}

export async function updateProject(id: string, data: Partial<CreateProjectPayload>) {
  const res = await api.put(`/projects/${id}`, data);
  return res.data as Project;
}

export async function deleteProject(id: string) {
  return api.delete(`/projects/${id}`);
}
