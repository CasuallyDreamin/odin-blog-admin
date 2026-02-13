import api from './api';
import { Media, PaginatedMedia } from '@/types/media';

interface FetchMediaParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const fetchMedia = async ({
  page = 1,
  limit = 10,
  search = '',
}: FetchMediaParams = {}): Promise<PaginatedMedia> => {
  const res = await api.get('/media', {
    params: { page, limit, search },
  });
  return res.data;
};

export const getMediaById = async (id: string): Promise<Media> => {
  const res = await api.get(`/media/${id}`);
  return res.data;
};

interface CreateMediaPayload {
  filePath: string;
  mimeType: string;
  altText?: string;
  postId?: string;
  projectId?: string;
}

export const createMedia = async (data: CreateMediaPayload): Promise<Media> => {
  const res = await api.post('/media', data);
  return res.data;
};

interface UpdateMediaPayload {
  altText: string;
}

export const updateMedia = async (id: string, data: UpdateMediaPayload): Promise<Media> => {
  const res = await api.put(`/media/${id}`, data);
  return res.data;
};

export const deleteMedia = async (id: string): Promise<{ success: boolean }> => {
  const res = await api.delete(`/media/${id}`);
  return res.data;
};
