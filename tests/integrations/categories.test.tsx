import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CategoriesPage from '@/app/categories/page';
import { mockCategories } from '../mocks/data/category.mock';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

describe('Categories Integration', () => {
  it('renders the categories list and displays data', async () => {
    render(<CategoriesPage />);

    await waitFor(() => {
      expect(screen.getByText(mockCategories[0].name)).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByText(mockCategories[1].name)).toBeInTheDocument();
    
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(mockCategories.length);
  });

  it('contains a functional create category button', () => {
    render(<CategoriesPage />);
    
    const createBtn = screen.getByRole('button', { name: /\+ create category/i });
    expect(createBtn).toBeInTheDocument();
  });

  it('displays action buttons for each category', async () => {
    render(<CategoriesPage />);

    await waitFor(() => {
      expect(screen.getByText(mockCategories[0].name)).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    expect(editButtons.length).toBeGreaterThanOrEqual(mockCategories.length);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons.length).toBeGreaterThanOrEqual(mockCategories.length);
  });

  it('handles empty category list', async () => {
    server.use(
      http.get(`${API_URL}/categories`, () => {
        return HttpResponse.json({ data: [], total: 0 });
      })
    );

    render(<CategoriesPage />);

    await waitFor(() => {
      const tbody = document.querySelector('tbody');
      expect(tbody?.children.length).toBe(0);
    });
  });
});