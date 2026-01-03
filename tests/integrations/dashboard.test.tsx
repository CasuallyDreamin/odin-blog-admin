import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardPage from '@/app/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Dashboard Page Integration', () => {
  it('renders the overview with data from the mocked services', async () => {
    render(<DashboardPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/overview/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Total Posts/i)).toBeInTheDocument();
    });
  });

  it('displays the statistics cards correctly', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/messages/i)).toBeInTheDocument();
      expect(screen.getByText(/comments/i)).toBeInTheDocument();
    });
  });
});