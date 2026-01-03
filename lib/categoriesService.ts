import api from './api';
import { Category } from '@/types/category'; 

export interface FetchCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FetchCategoriesResponse {
  data: Category[];
  total: number;
  totalPages: number;
}

export interface CreateCategoryPayload {
  name: string;
  id?: string;
}

export async function fetchCategories({
  page = 1,
  limit = 10,
  search = ""
}: FetchCategoriesParams = {}): Promise<FetchCategoriesResponse> {
  const res = await api.get('/categories', {
    params: { page, limit, search }
  });

  const json = res.data;

  return {
    data: json.categories ?? [],
    total: json.total ?? 0,
    page: json.page ?? page,
    totalPages: Math.ceil((json.total ?? 0) / limit),
  } as FetchCategoriesResponse;
}


export async function getCategoryById(id: string): Promise<Category> {
  const res = await api.get(`/categories/${id}`);
  return res.data as Category;
}

export async function createCategory(data: CreateCategoryPayload): Promise<Category> {
  const res = await api.post('/categories', data);
  return res.data as Category;
}

export async function updateCategory(id: string, data: Partial<CreateCategoryPayload>): Promise<Category> {
  const res = await api.put(`/categories/${id}`, data);
  return res.data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}