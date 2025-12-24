import api from './api';

export interface Quote {
  id: string;
  content: string;
  author?: string;
  categories?: { id: string; name: string }[];
  createdAt: string;
}
export interface CreateQuotePayload {
  content: string;
  author?: string;
  categoryIds?: string[];
}
export interface FetchQuotesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function createQuote(data: CreateQuotePayload) {
  const res = await api.post('/quotes', data);
  return res.data as Quote;
}

export async function fetchQuotes({ page = 1, limit = 10, search = '' }: FetchQuotesParams = {}) {
  const res = await api.get('/quotes', {
    params: { page, limit, search }
  });

  const json = res.data;

  return {
    data: json.quotes ?? [],
    total: json.total ?? 0,
    totalPages: json.totalPages ?? Math.ceil((json.total ?? 0) / limit),
  };
}

export async function deleteQuote(id: string) {
  return api.delete(`/quotes/${id}`);
}