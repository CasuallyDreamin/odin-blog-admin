import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MessageDetailPage from '@/app/messages/[id]/page';
import { createMockContactMessage } from '../mocks/data/message.mock';
import api from '@/lib/api';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Message Detail Integration', () => {
  const unreadMessage = createMockContactMessage({ id: 'm1', isRead: false });
  const params = Promise.resolve({ id: unreadMessage.id });

  beforeEach(() => {
    vi.clearAllMocks();
    
    (api.get as any).mockResolvedValue({ 
      data: { messages: [unreadMessage] } 
    });
    window.confirm = vi.fn(() => true);
  });

  it('renders message content and marks as read', async () => {
    await act(async () => {
      render(<MessageDetailPage params={params} />);
    });

    await waitFor(() => {
      expect(screen.getByText(unreadMessage.subject || '')).toBeInTheDocument();
    });

    expect(screen.getByText(unreadMessage.name)).toBeInTheDocument();
    expect(screen.getByText(unreadMessage.message)).toBeInTheDocument();
    
    expect(api.patch).toHaveBeenCalledWith(`/contact/${unreadMessage.id}/read`);
  });

  it('displays a mailto link with the correct subject', async () => {
    await act(async () => {
      render(<MessageDetailPage params={params} />);
    });

    await waitFor(() => {
      const replyLink = screen.getByRole('link', { name: /reply via email/i });
      expect(replyLink).toHaveAttribute(
        'href', 
        `mailto:${unreadMessage.email}?subject=Re: ${unreadMessage.subject}`
      );
    });
  });

  it('shows error state if message is not found', async () => {
    (api.get as any).mockResolvedValue({ data: { messages: [] } });
    
    await act(async () => {
      render(<MessageDetailPage params={params} />);
    });

    await waitFor(() => {
      expect(screen.getByText(/message not found/i)).toBeInTheDocument();
    });
  });
});