import { http, HttpResponse } from 'msw';
import { mockComments } from '../data/comment.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const commentHandlers = [
  http.get(`${API_URL}/comments`, ({ request }) => {
    const url = new URL(request.url);
    
    const commentsWithPosts = mockComments.map(c => ({
      ...c,
      post: { id: 'p1', title: 'Example Post' }
    }));

    return HttpResponse.json({
      data: commentsWithPosts,
      total: commentsWithPosts.length,
      page: Number(url.searchParams.get('page')) || 1
    });
  }),

  http.get(`${API_URL}/comments/count/pending`, () => 
    HttpResponse.json({ count: 5 })
  ),

  http.put(`${API_URL}/comments/:id/status`, async ({ request }) => {
    const { isApproved } = await request.json() as { isApproved: boolean };
    return HttpResponse.json({ id: '1', isApproved });
  }),

  http.delete(`${API_URL}/comments/:id`, () => new HttpResponse(null, { status: 204 })),
];