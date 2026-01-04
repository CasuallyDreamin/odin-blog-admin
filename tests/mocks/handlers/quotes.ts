import { http, HttpResponse } from 'msw';
import { mockQuoteList } from '../data/quote.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let dynamicQuotes = [...mockQuoteList.data];

export const quoteHandlers = [
  http.get(`${API_URL}/quotes`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';

    let filtered = [...dynamicQuotes];

    if (search) {
      filtered = filtered.filter(q => 
        q.content.toLowerCase().includes(search) || 
        q.author?.toLowerCase().includes(search)
      );
    }

    return HttpResponse.json({
      quotes: filtered,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / 10),
    });
  }),

  http.delete(`${API_URL}/quotes/:id`, ({ params }) => {
    const { id } = params;
    dynamicQuotes = dynamicQuotes.filter(q => q.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];