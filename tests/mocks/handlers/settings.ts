import { http, HttpResponse } from 'msw';
import { mockSettings } from '../data/settings.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const settingsHandlers = [
  http.get(`${API_URL}/settings`, () => {
    return HttpResponse.json(mockSettings);
  }),

  http.put(`${API_URL}/settings`, async ({ request }) => {
    const updates = await request.json() as Record<string, any>;
    
    return HttpResponse.json({ 
      ...mockSettings, 
      ...updates 
    });
  }),
];