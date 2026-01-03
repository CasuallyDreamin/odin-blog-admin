import { http, HttpResponse } from 'msw';
import { mockMessageList } from '../data/message.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const contactHandlers = [
  http.get(`${API_URL}/contact`, () => HttpResponse.json({
    messages: mockMessageList,
    total: mockMessageList.length,
    page: 1,
    totalPages: 1,
  })),

  http.get(`${API_URL}/contact/unread/count`, () => HttpResponse.json({ count: 2 })),

  http.patch(`${API_URL}/contact/:id/read`, () => new HttpResponse(null, { status: 200 })),

  http.delete(`${API_URL}/contact/:id`, () => new HttpResponse(null, { status: 204 })),
];