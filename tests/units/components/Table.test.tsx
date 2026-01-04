import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Table, { TableColumn } from '@/components/admin/Table';

interface MockData {
  id: string;
  title: string;
  status: string;
}

describe('Table Component', () => {
  const mockData: MockData[] = [
    { id: '1', title: 'First Post', status: 'Published' },
    { id: '2', title: 'Second Post', status: 'Draft' },
  ];

  const columns: TableColumn<MockData>[] = [
    { key: 'title', label: 'Blog Title' },
    { 
      key: 'status', 
      label: 'Current Status',
      render: (row) => <span data-testid="status-badge">{row.status.toUpperCase()}</span>
    },
  ];

  const mockOnRowClick = vi.fn();

  it('renders the correct headers', () => {
    render(<Table columns={columns} data={mockData} />);

    expect(screen.getByText('Blog Title')).toBeInTheDocument();
    expect(screen.getByText('Current Status')).toBeInTheDocument();
  });

  it('renders data rows based on columns', () => {
    render(<Table columns={columns} data={mockData} />);

    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });

  it('uses custom render functions for columns', () => {
    render(<Table columns={columns} data={mockData} />);

    const badges = screen.getAllByTestId('status-badge');
    expect(badges[0]).toHaveTextContent('PUBLISHED');
    expect(badges[1]).toHaveTextContent('DRAFT');
  });

  it('calls onRowClick with the correct row data', () => {
    render(<Table columns={columns} data={mockData} onRowClick={mockOnRowClick} />);

    const firstRow = screen.getByText('First Post').closest('tr');
    if (firstRow) fireEvent.click(firstRow);

    expect(mockOnRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('renders an actions column when provided', () => {
    render(
      <Table 
        columns={columns} 
        data={mockData} 
        actions={() => <button>Delete</button>} 
      />
    );

    expect(screen.getByText('Actions')).toBeInTheDocument();
    const deleteButtons = screen.getAllByText('Delete');
    expect(deleteButtons).toHaveLength(2);
  });

  it('renders nothing in tbody if data is empty', () => {
    const { container } = render(<Table columns={columns} data={[]} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(0);
  });
});