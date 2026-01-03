import { http, HttpResponse } from 'msw';
import { mockPostList } from '../data/post.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const postHandlers = [
  http.get(`${API_URL}/posts`, ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;
    const page = Number(url.searchParams.get('page')) || 1;
    
    return HttpResponse.json({
      posts: mockPostList.slice((page - 1) * limit, page * limit),
      total: mockPostList.length,
      page: page
    });
  }),

  http.get(`${API_URL}/posts/:slug_or_id`, ({ params }) => {
    const identifier = params.slug_or_id;
    const post = mockPostList.find(p => p.id === identifier || p.slug === identifier);
    
    if (!post) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(post);
  }),

  http.post(`${API_URL}/posts`, async ({ request }) => {
    const data = await request.json() as object;
    return HttpResponse.json({ id: 'new-id', ...data }, { status: 201 });
  }),

  http.put(`${API_URL}/posts/:id`, async ({ request }) => {
    const data = await request.json() as object;
    return HttpResponse.json(data);
  }),

  http.delete(`${API_URL}/posts/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];