import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PostsPage from '@/app/posts/page';
import { mockPostList } from '../mocks/data/post.mock';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

describe('Blog Integration', () => {
  it('renders the posts list and displays data from the service', async () => {
    render(<PostsPage />);

    await waitFor(() => {
      expect(screen.getByText(mockPostList[0].title)).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByText(mockPostList[1].title)).toBeInTheDocument();
    
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(mockPostList.length);
  });

  it('contains a functional link to create a new post', () => {
    render(<PostsPage />);
    
    const createBtn = screen.getByRole('link', { name: /\+ create post/i });
    expect(createBtn).toHaveAttribute('href', '/posts/new');
  });

  it('shows empty state (tbody is empty)', async () => {
    server.use(
      http.get(`${API_URL}/posts`, () => {
        return HttpResponse.json({ data: [], total: 0 });
      })
    );

    render(<PostsPage />);

    await waitFor(() => {
      const tbody = document.querySelector('tbody');
      expect(tbody?.children.length).toBe(0);
    });
  });

  it('handles API errors without crashing', async () => {
    server.use(
      http.get(`${API_URL}/posts`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<PostsPage />);

    expect(screen.getByText(/Posts/i)).toBeInTheDocument();
  });
});