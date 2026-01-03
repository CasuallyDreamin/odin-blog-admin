import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProjectsPage from '@/app/projects/page';
import { mockProjectList } from '../mocks/data/project.mock';

describe('Projects Integration', () => {
  it('renders the projects list and displays data', async () => {
    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText(mockProjectList.data[0].title)).toBeInTheDocument();
    }, { timeout: 3000 });

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(mockProjectList.data.length);
  });

  it('contains a functional link to create a new project', () => {
    render(<ProjectsPage />);
    const createBtn = screen.getByRole('link', { name: /\+ create project/i });
    expect(createBtn).toHaveAttribute('href', '/projects/new');
  });

  it('displays action buttons and links for each project row', async () => {
    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText(mockProjectList.data[0].title)).toBeInTheDocument();
    });

    const editLinks = screen.getAllByRole('link', { name: /edit/i });
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    expect(editLinks.length).toBeGreaterThanOrEqual(mockProjectList.data.length);
    expect(deleteButtons.length).toBeGreaterThanOrEqual(mockProjectList.data.length);
  });
});