import { http, HttpResponse } from 'msw';
import { mockCommentList } from '../data/comment.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const commentHandlers = [
  http.get(`${API_URL}/comments`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const status = url.searchParams.get('status') || 'all';

    let filtered = [...mockCommentList.data];

    if (status !== 'all') {
      const isApprovedSearch = status === 'approved';
      filtered = filtered.filter(c => c.isApproved === isApprovedSearch);
    }

    if (search) {
      filtered = filtered.filter(c => 
        c.author.toLowerCase().includes(search) || 
        c.body.toLowerCase().includes(search)
      );
    }

    return HttpResponse.json({
      comments: filtered,
      total: filtered.length,
      page: 1,
      totalPages: Math.ceil(filtered.length / 10)
    });
  }),

  http.put(`${API_URL}/comments/:id/status`, async ({ request, params }) => {
    const { isApproved } = await request.json() as { isApproved: boolean };
    const id = params.id as string;
    const comment = mockCommentList.data.find(c => c.id === id);

    if (!comment) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json({
      ...comment,
      isApproved
    });
  }),

  http.delete(`${API_URL}/comments/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}/comments/count/pending`, () => {
    const count = mockCommentList.data.filter(c => !c.isApproved).length;
    return HttpResponse.json({ count });
  }),
];