import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FilterBar from '@/components/admin/FilterBar';

describe('FilterBar Component', () => {
  const mockCategories = [{ id: '1', name: 'Tech' }, { id: '2', name: 'Life' }];
  const mockTags = ['React', 'Node'];
  const mockStatuses = ['Published', 'Draft'];

  const mockOnCategoryChange = vi.fn();
  const mockOnTagChange = vi.fn();
  const mockOnStatusChange = vi.fn();
  const mockOnSearchChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the search input with initial value', () => {
    render(
      <FilterBar 
        searchTerm="Initial Query" 
        onSearchChange={mockOnSearchChange} 
      />
    );

    const searchInput = screen.getByPlaceholderText(/search titles/i);
    expect(searchInput).toHaveValue('Initial Query');
  });

  it('calls onSearchChange after debounce when typing', async () => {
    render(
      <FilterBar 
        onSearchChange={mockOnSearchChange} 
        debounceMs={10} 
      />
    );

    const searchInput = screen.getByPlaceholderText(/search titles/i);
    fireEvent.change(searchInput, { target: { value: 'New Search' } });

    await waitFor(() => {
      expect(mockOnSearchChange).toHaveBeenCalledWith('New Search');
    }, { timeout: 100 });
  });

  it('opens a dropdown menu when clicked and displays items', () => {
    render(
      <FilterBar 
        categories={mockCategories} 
        onCategoryChange={mockOnCategoryChange} 
      />
    );

    const categoryBtn = screen.getByRole('button', { name: /categories/i });
    fireEvent.click(categoryBtn);

    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Life')).toBeInTheDocument();
  });

  it('toggles selection and calls the correct callback', () => {
    render(
      <FilterBar 
        tags={mockTags} 
        selectedTags={['React']} 
        onTagChange={mockOnTagChange} 
      />
    );

    const tagBtn = screen.getByRole('button', { name: /tags \(1\)/i });
    fireEvent.click(tagBtn);

    const nodeCheckbox = screen.getByLabelText('Node');
    fireEvent.click(nodeCheckbox);

    expect(mockOnTagChange).toHaveBeenCalledWith(['React', 'Node']);
  });

  it('removes an item from selection when unchecking', () => {
    render(
      <FilterBar 
        statuses={mockStatuses} 
        selectedStatuses={['Published']} 
        onStatusChange={mockOnStatusChange} 
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /status \(1\)/i }));
    
    const publishedCheckbox = screen.getByLabelText('Published');
    fireEvent.click(publishedCheckbox);

    expect(mockOnStatusChange).toHaveBeenCalledWith([]);
  });

  it('only allows one menu to be open at a time', () => {
    render(
      <FilterBar 
        categories={mockCategories} 
        tags={mockTags} 
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /categories/i }));
    expect(screen.getByText('Tech')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /tags/i }));
    
    expect(screen.queryByText('Tech')).not.toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
});