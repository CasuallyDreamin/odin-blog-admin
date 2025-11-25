import api from './api';
import { Post } from '@/types/post';

export interface FetchPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}

export interface FetchPostsResponse {
  data: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreatePostPayload {
  title: string;
  layout?: any;
  published?: boolean;
  categoryIds?: string[];
  tagIds?: string[];
}

export async function createPost(data: CreatePostPayload) {
  const res = await api.post('/posts', data);
  return res.data as Post;
}

export async function fetchPosts({ page, limit, search }: any) {
  const res = await api.get('/posts', {
    params: { page, limit, search }
  });

  const json = res.data;

  return {
    data: json.posts ?? [],
    totalPages: Math.ceil((json.total ?? 0) / limit),
  };
}
export async function getPostById(id: string) {
  const res = await api.get(`/posts/${id}`);
  return res.data as Post;
}

export async function  getPostBySlug(slug: string) {
  const res = await api.get(`/posts/${slug}`);
  return res.data as Post;
}

export async function updatePost(id: string, data: Partial<CreatePostPayload>) {
  const res = await api.put(`/posts/${id}`, data);
  return res.data as Post;
}

export async function deletePost(id: string) {
  return api.delete(`/posts/${id}`);
}
