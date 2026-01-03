import { http, HttpResponse } from 'msw';
import { mockTags } from '../data/tag.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const tagHandlers = [
  http.get(`${API_URL}/tags`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || "";
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;

    const filteredTags = mockTags.filter(tag => 
      tag.name.toLowerCase().includes(search)
    );

    return HttpResponse.json({
      tags: filteredTags.slice((page - 1) * limit, page * limit),
      total: filteredTags.length,
      page,
      totalPages: Math.ceil(filteredTags.length / limit)
    });
  }),

  http.get(`${API_URL}/tags/:id`, ({ params }) => {
    const tag = mockTags.find(t => t.id === params.id);
    if (!tag) {
      return HttpResponse.json({ error: "Tag not found" }, { status: 404 });
    }
    return HttpResponse.json(tag);
  }),

  http.post(`${API_URL}/tags`, async ({ request }) => {
    const { name } = await request.json() as { name: string };

    if (!name || !name.trim()) {
      return HttpResponse.json({ error: "Tag name is required" }, { status: 400 });
    }

    const exists = mockTags.some(t => t.name.toLowerCase() === name.trim().toLowerCase());
    if (exists) {
      return HttpResponse.json({ error: "Tag already exists" }, { status: 400 });
    }

    const newTag = { id: `tag-${Date.now()}`, name: name.trim(), posts: [] };
    return HttpResponse.json(newTag, { status: 201 });
  }),

  http.delete(`${API_URL}/tags/:id`, ({ params }) => {
    const { id } = params;
    const exists = mockTags.some(t => t.id === id);
  
    if (!exists) {
      return HttpResponse.json({ error: "Tag not found" }, { status: 404 });
    }
  
    return new HttpResponse(null, { status: 204 });
  }),
];