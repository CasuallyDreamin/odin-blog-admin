import { http, HttpResponse } from 'msw';
import { mockDashboardCounts } from '../data/dashboard.mock';
import { mockCategories } from '../data/category.mock';
import { mockTags } from '../data/tag.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const dashboardHandlers = [
  http.get(`${API_URL}/comments/count/pending`, () => 
    HttpResponse.json({ count: mockDashboardCounts.comments })
  ),

  http.get(`${API_URL}/contact/unread/count`, () => 
    HttpResponse.json({ count: mockDashboardCounts.messages })
  ),

  http.get(`${API_URL}/categories`, () => 
    HttpResponse.json({ data: mockCategories, total: mockCategories.length })
  ),

  http.get(`${API_URL}/tags`, () => 
    HttpResponse.json({ data: mockTags, total: mockTags.length })
  ),
];