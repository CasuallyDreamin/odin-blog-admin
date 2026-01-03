import { http, HttpResponse } from 'msw';
import { mockLoginResponse } from '../data/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const authHandlers = [
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const { email, password } = await request.json() as any;
    
    if (email === 'admin@sintopia.com' && password === 'password123') {
      return HttpResponse.json(mockLoginResponse, {
        headers: { 
          'Set-Cookie': 'admin_token=mock-token; Path=/; HttpOnly; SameSite=Lax' 
        },
      });
    }
    
    return new HttpResponse(
      JSON.stringify({ message: 'Invalid credentials' }), 
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }),

  http.post(`${API_URL}/auth/logout`, () => {
    return new HttpResponse(null, {
      status: 200,
      headers: { 'Set-Cookie': 'admin_token=; Path=/; Max-Age=0' },
    });
  }),

  http.get(`${API_URL}/auth/me`, ({ request }) => {
    const cookieHeader = request.headers.get('cookie') || '';
    const hasToken = cookieHeader.includes('admin_token=mock-token');

    if (!hasToken) {
      return new HttpResponse(null, { status: 401 });
    }

    return HttpResponse.json({ 
      user: { 
        id: '1', 
        email: 'admin@sintopia.com',
        username: 'admin' 
      } 
    });
  }),
];