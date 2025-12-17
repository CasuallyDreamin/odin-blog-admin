import api from "./api";
import { Tag } from "@/types/tag";

export interface FetchTagsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FetchTagsResponse {
  data: Tag[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateTagPayload {
  name: string;
}

export async function fetchTags({ page = 1, limit = 10, search = "" }: FetchTagsParams = {}) {
  const res = await api.get("/tags", {
    params: { page, limit, search },
  });

  const json = res.data;

  return {
    data: json.tags ?? [],
    total: json.total ?? 0,
    page: json.page ?? page,
    totalPages: Math.ceil((json.total ?? 0) / limit),
  } as FetchTagsResponse;
}


export async function getTagById(id: string) {
  const res = await api.get(`/tags/${id}`);
  return res.data as Tag;
}

export async function getTagBySlug(slug: string) {
  const res = await api.get(`/tags/slug/${slug}`);
  return res.data as Tag;
}

export async function createTag(data: CreateTagPayload) {
  const res = await api.post("/tags", data);
  return res.data as Tag;
}

export async function updateTag(id: string, data: Partial<CreateTagPayload>) {
  const res = await api.put(`/tags/${id}`, data);
  return res.data as Tag;
}

export async function deleteTag(id: string) {
  return api.delete(`/tags/${id}`);
}