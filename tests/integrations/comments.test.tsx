import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CommentsPage from '@/app/comments/page';
import { mockComments } from '../mocks/data/comment.mock';
import * as commentsService from '@/lib/commentsService';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('Comments Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders comments table with author and post title', async () => {
    render(<CommentsPage />);

    await waitFor(() => {
      expect(screen.getByText(mockComments[0].author)).toBeInTheDocument();
    });

    expect(screen.getByText(mockComments[1].author)).toBeInTheDocument();
    expect(screen.getByText(/Example Post/i)).toBeInTheDocument();
    
    const statusLabels = screen.getAllByText(/Approved|Pending/i);
    expect(statusLabels.length).toBeGreaterThanOrEqual(2);
  });

  it('toggles comment approval status', async () => {
    const toggleSpy = vi.spyOn(commentsService, 'setCommentApprovalStatus');
    render(<CommentsPage />);

    await waitFor(() => {
      expect(screen.getByText(mockComments[1].author)).toBeInTheDocument();
    });

    const approveButtons = screen.getAllByRole('button', { name: /approve/i });
    fireEvent.click(approveButtons[0]);

    await waitFor(() => {
      expect(toggleSpy).toHaveBeenCalledWith(mockComments[1].id, true);
    });
  });

  it('updates the view when a status filter is clicked', async () => {
    const fetchSpy = vi.spyOn(commentsService, 'fetchComments');
    render(<CommentsPage />);

    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument();
    });

    const pendingFilter = screen.getByRole('button', { name: /^pending$/i });
    fireEvent.click(pendingFilter);

    expect(fetchSpy).toHaveBeenCalledWith(expect.objectContaining({
      status: 'pending'
    }));
  });
});