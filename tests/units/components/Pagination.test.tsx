import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from '@/components/admin/Pagination';

describe('Pagination Component', () => {
  const mockOnChange = vi.fn();

  it('renders the current page and total pages', () => {
    render(<Pagination page={2} totalPages={5} onChange={mockOnChange} />);

    expect(screen.getByText(/page 2 \/ 5/i)).toBeInTheDocument();
  });

  it('disables the Prev button on the first page', () => {
    render(<Pagination page={1} totalPages={5} onChange={mockOnChange} />);

    const prevButton = screen.getByRole('button', { name: /prev/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables the Next button on the last page', () => {
    render(<Pagination page={5} totalPages={5} onChange={mockOnChange} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('calls onChange with page - 1 when Prev is clicked', () => {
    render(<Pagination page={3} totalPages={5} onChange={mockOnChange} />);

    const prevButton = screen.getByRole('button', { name: /prev/i });
    fireEvent.click(prevButton);

    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it('calls onChange with page + 1 when Next is clicked', () => {
    render(<Pagination page={3} totalPages={5} onChange={mockOnChange} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    expect(mockOnChange).toHaveBeenCalledWith(4);
  });

  it('enables both buttons when on a middle page', () => {
    render(<Pagination page={2} totalPages={3} onChange={mockOnChange} />);

    expect(screen.getByRole('button', { name: /prev/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
  });
});