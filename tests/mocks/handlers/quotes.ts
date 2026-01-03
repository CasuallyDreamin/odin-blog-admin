import { http, HttpResponse } from 'msw';
import { mockQuotes } from '../data/quote.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const quoteHandlers = [
  http.get(`${API_URL}/quotes`, ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;
    const page = Number(url.searchParams.get('page')) || 1;

    return HttpResponse.json({
      quotes: mockQuotes.slice((page - 1) * limit, page * limit),
      total: mockQuotes.length,
      page: page,
      totalPages: Math.ceil(mockQuotes.length / limit)
    });
  }),

  http.post(`${API_URL}/quotes`, async ({ request }) => {
    const data = await request.json() as Record<string, any>;
    
    const newQuote = {
      id: `q-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      ...data
    };

    return HttpResponse.json(newQuote, { status: 201 });
  }),

  http.delete(`${API_URL}/quotes/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];