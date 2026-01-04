import { http, HttpResponse } from 'msw';
import { mockTagList } from '../data/tag.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let dynamicTags = [...mockTagList.data];

export const resetTagMocks = () => {
  dynamicTags = [...mockTagList.data];
};

export const tagHandlers = [
  http.get(`${API_URL}/tags`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';

    let filtered = [...dynamicTags];

    if (search) {
      filtered = filtered.filter(t => t.name.toLowerCase().includes(search));
    }

    return HttpResponse.json({
      tags: filtered,
      total: filtered.length,
      page: 1,
      totalPages: Math.ceil(filtered.length / 10),
    });
  }),

  http.post(`${API_URL}/tags`, async ({ request }) => {
    const { name } = await request.json() as { name: string };
    const newTag = { id: Math.random().toString(36).substr(2, 9), name, posts: [] };
    dynamicTags.push(newTag);
    return HttpResponse.json(newTag, { status: 201 });
  }),

  http.delete(`${API_URL}/tags/:id`, ({ params }) => {
    const { id } = params;
    dynamicTags = dynamicTags.filter(t => t.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];