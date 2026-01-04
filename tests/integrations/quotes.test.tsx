import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AdminThoughtsPage from '@/app/thoughts/page';
import { mockQuoteList } from '../mocks/data/quote.mock';

describe('Quotes Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the quotes list and displays content', async () => {
    render(<AdminThoughtsPage />);

    await waitFor(() => {
      expect(screen.getByText(new RegExp(mockQuoteList.data[0].content, 'i'))).toBeInTheDocument();
    });

    expect(screen.getByText(mockQuoteList.data[1].author!)).toBeInTheDocument();
  });

  it('filters quotes based on search input', async () => {
    render(<AdminThoughtsPage />);

    await screen.findByText(/First Thought/i);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Second' } });

    await waitFor(() => {
      expect(screen.queryByText(/First Thought/i)).not.toBeInTheDocument();
    });
    expect(screen.getByText(/Second Thought/i)).toBeInTheDocument();
  });

  it('handles the full deletion flow', async () => {
    render(<AdminThoughtsPage />);

    const firstQuote = await screen.findByText(/First Thought/i);
    const row = firstQuote.closest('tr')!;
    const deleteBtn = within(row).getByRole('button', { name: /delete/i });
    
    fireEvent.click(deleteBtn);

    const modal = await screen.findByRole('dialog');
    const confirmBtn = within(modal).getByRole('button', { name: /^delete$/i });
    
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.queryByText(/First Thought/i)).not.toBeInTheDocument();
    });
  });

  it('navigates to the creation page via the Add Thought button', () => {
    render(<AdminThoughtsPage />);
    const addBtn = screen.getByRole('link', { name: /\+ add thought/i });
    expect(addBtn).toHaveAttribute('href', '/thoughts/new');
  });
});