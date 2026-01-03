import { http, HttpResponse } from 'msw';
import { mockProjectList } from '../data/project.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const projectHandlers = [
  http.get(`${API_URL}/projects`, () => HttpResponse.json({
    projects: mockProjectList.data,
    total: mockProjectList.total
  })),

  http.get(`${API_URL}/projects/:slug_or_id`, ({ params }) => {
    const identifier = params.slug_or_id;
    const project = mockProjectList.data.find(p => p.id === identifier || p.slug === identifier);
    return project ? HttpResponse.json(project) : new HttpResponse(null, { status: 404 });
  }),

  http.post(`${API_URL}/projects`, async ({ request }) => {
    const data = await request.json() as object;
    return HttpResponse.json({ id: 'proj-123', ...data }, { status: 201 });
  }),
];