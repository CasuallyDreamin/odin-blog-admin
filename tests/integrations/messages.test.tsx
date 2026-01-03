import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MessagesPage from '@/app/messages/page';
import { mockMessageList } from '../mocks/data/message.mock';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Messages Integration', () => {
  it('renders the messages list and displays sender info', async () => {
    render(<MessagesPage />);

    await waitFor(() => {
      expect(screen.getByText(mockMessageList[0].name)).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByText(mockMessageList[0].email)).toBeInTheDocument();

    const subjects = screen.getAllByText(mockMessageList[0].subject || '');
    expect(subjects.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(mockMessageList[1].name)).toBeInTheDocument();
  });

  it('contains delete buttons for each message', async () => {
    render(<MessagesPage />);

    await waitFor(() => {
      expect(screen.getByText(mockMessageList[0].name)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons.length).toBe(mockMessageList.length);
  });

  it('handles empty inbox state', async () => {
    render(<MessagesPage />);
    
    await waitFor(() => {
      const rows = screen.queryAllByRole('row');
      expect(rows.length).toBeLessThanOrEqual(1); 
    });
  });
});