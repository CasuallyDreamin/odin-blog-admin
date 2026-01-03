import { http, HttpResponse } from 'msw';
import { mockCategories } from '../data/category.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const categoryHandlers = [
  http.get(`${API_URL}/categories`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;

    return HttpResponse.json({
      categories: mockCategories,
      total: mockCategories.length,
      page,
      totalPages: Math.ceil(mockCategories.length / limit),
    });
  }),

  http.get(`${API_URL}/categories/:id`, ({ params }) => {
    const category = mockCategories.find(c => c.id === params.id);
    if (!category) {
      return HttpResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return HttpResponse.json(category);
  }),

  http.post(`${API_URL}/categories`, async ({ request }) => {
    const data = await request.json() as Record<string, any>;
    
    const newCategory = {
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      postCount: 0,
      ...data
    };

    return HttpResponse.json(newCategory, { status: 201 });
  }),

  http.put(`${API_URL}/categories/:id`, async ({ request }) => {
    const data = await request.json() as Record<string, any>;
    return HttpResponse.json({
      updatedAt: new Date().toISOString(),
      ...data
    });
  }),

  http.delete(`${API_URL}/categories/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];