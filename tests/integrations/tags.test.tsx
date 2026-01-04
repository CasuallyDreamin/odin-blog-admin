import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TagsPage from '@/app/tags/page';
import { mockTagList } from '../mocks/data/tag.mock';
import { resetTagMocks } from '../mocks/handlers/tags';

describe('Tags Integration', () => {
  const [tag1, tag2, tag3] = mockTagList.data;

  beforeEach(() => {
    vi.restoreAllMocks();
    resetTagMocks();
  });

  it('renders tags and displays the correct post count', async () => {
    render(<TagsPage />);

    const firstRow = await screen.findByRole('row', { name: new RegExp(tag1.name, 'i') });
    expect(within(firstRow).getByText(tag1.posts!.length.toString())).toBeInTheDocument();

    const secondRow = screen.getByRole('row', { name: new RegExp(tag2.name, 'i') });
    expect(within(secondRow).getByText(tag2.posts!.length.toString())).toBeInTheDocument();
  });

  it('filters tags by name', async () => {
    render(<TagsPage />);

    await screen.findByText(tag1.name);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: tag3.name } });

    await waitFor(() => {
      expect(screen.queryByText(tag1.name)).not.toBeInTheDocument();
    });
    expect(screen.getByText(tag3.name)).toBeInTheDocument();
  });

  it('handles the full deletion flow for a tag', async () => {
    render(<TagsPage />);

    const row = await screen.findByRole('row', { name: new RegExp(tag1.name, 'i') });
    const deleteBtn = within(row).getByRole('button', { name: /delete/i });
    
    fireEvent.click(deleteBtn);

    const modal = await screen.findByRole('dialog');
    const confirmBtn = within(modal).getByRole('button', { name: /^delete$/i });
    
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.queryByText(tag1.name)).not.toBeInTheDocument();
    });
  });

  it('navigates to the edit page when clicking the Edit link', async () => {
    render(<TagsPage />);
    
    const row = await screen.findByRole('row', { name: new RegExp(tag1.name, 'i') });
    const editLink = within(row).getByRole('link', { name: /edit/i });
    
    expect(editLink).toHaveAttribute('href', `/tags/edit/${tag1.id}`);
  });
});