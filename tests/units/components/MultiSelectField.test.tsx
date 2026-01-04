import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MultiSelectField from '@/components/admin/MultiSelectField';

describe('MultiSelectField Component', () => {
  const mockOptions = [
    { id: '1', name: 'React' },
    { id: '2', name: 'Vue' },
    { id: '3', name: 'Angular' },
  ];

  const mockFetchOptions = vi.fn().mockResolvedValue({ data: mockOptions });
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders and fetches options on mount', async () => {
    render(
      <MultiSelectField
        label="Technologies"
        fetchOptions={mockFetchOptions}
        selectedIds={[]}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockFetchOptions).toHaveBeenCalled();
    });

    const select = screen.getByRole('combobox');
    expect(screen.getByText('Select...')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('calls onChange when an option is selected', async () => {
    render(
      <MultiSelectField
        label="Technologies"
        fetchOptions={mockFetchOptions}
        selectedIds={[]}
        onChange={mockOnChange}
      />
    );

    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });

    expect(mockOnChange).toHaveBeenCalledWith(['1']);
  });

  it('renders selected items as badges', async () => {
    render(
      <MultiSelectField
        label="Technologies"
        fetchOptions={mockFetchOptions}
        selectedIds={['1', '2']}
        onChange={mockOnChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Vue')).toBeInTheDocument();
    });

    const reactBadge = screen.getByText(/React/);
    expect(reactBadge).toHaveClass('bg-cyan-700');
  });

  it('removes an item when its badge is clicked', async () => {
    render(
      <MultiSelectField
        label="Technologies"
        fetchOptions={mockFetchOptions}
        selectedIds={['1', '2']}
        onChange={mockOnChange}
      />
    );

    await waitFor(() => expect(screen.getByText('React')).toBeInTheDocument());

    const reactBadge = screen.getByText(/React/);
    fireEvent.click(reactBadge);

    expect(mockOnChange).toHaveBeenCalledWith(['2']);
  });

  it('filters out already selected items from the dropdown', async () => {
    render(
      <MultiSelectField
        label="Technologies"
        fetchOptions={mockFetchOptions}
        selectedIds={['1']}
        onChange={mockOnChange}
      />
    );

    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

    const options = screen.getAllByRole('option');
    const optionValues = options.map((opt) => (opt as HTMLOptionElement).value);

    expect(optionValues).not.toContain('1');
    expect(optionValues).toContain('2');
    expect(optionValues).toContain('3');
  });
});