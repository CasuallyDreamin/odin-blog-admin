import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CommentsPage from '@/app/comments/page';
import { mockCommentList } from '../mocks/data/comment.mock';

describe('Comments Comprehensive Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the comments list and handles searching', async () => {
    render(<CommentsPage />);

    await waitFor(() => {
      expect(screen.getByText(mockCommentList.data[0].author)).toBeInTheDocument();
    });

    expect(screen.getByText('Bob')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search comments or author/i);
    fireEvent.change(searchInput, { target: { value: 'Alice' } });

    await waitFor(() => {
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('filters comments by status', async () => {
    render(<CommentsPage />);

    await screen.findByText('Alice');

    const pendingBtn = screen.getByRole('button', { name: /^pending$/i });
    fireEvent.click(pendingBtn);

    await waitFor(() => {
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('toggles comment approval status', async () => {
    render(<CommentsPage />);

    const aliceRow = await screen.findByText('Alice').then(el => el.closest('tr'));
    const approveBtn = within(aliceRow!).getByRole('button', { name: /unapprove/i });

    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });
  });

  it('handles the full deletion flow via modal', async () => {
    render(<CommentsPage />);

    await screen.findByText('Alice');
    const aliceRow = screen.getByText('Alice').closest('tr')!;
    const deleteBtn = within(aliceRow).getByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtn);

    const modal = await screen.findByRole('dialog');
    
    const confirmBtn = within(modal).getByRole('button', { name: /^delete$/i });
    fireEvent.click(confirmBtn);
    
    await waitFor(() => {
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });
  });

  it('shows empty state message when no results match', async () => {
    render(<CommentsPage />);

    const searchInput = await screen.findByPlaceholderText(/search comments/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistentAuthor' } });

    await waitFor(() => {
      expect(screen.getByText(/no comments found for the current filter/i)).toBeInTheDocument();
    });
  });
});