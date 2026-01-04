import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import SettingsPage from '@/app/settings/page';
import { mockSettings } from '../mocks/data/settings.mock';
import { resetSettingsMocks } from '../mocks/handlers/settings';

describe('Settings Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetSettingsMocks();
    window.alert = vi.fn(); 
  });

  it('loads and displays current settings in form fields', async () => {
    render(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/blog name/i)).toHaveValue(mockSettings.blogName);
    });

    expect(screen.getByLabelText(/tagline/i)).toHaveValue(mockSettings.tagline);
    expect(screen.getByLabelText(/posts per page/i)).toHaveValue(mockSettings.postsPerPage);
    expect(screen.getByLabelText(/default theme/i)).toHaveValue(mockSettings.theme);
    
    expect(screen.getByDisplayValue(mockSettings.socialLinks!.twitter)).toBeInTheDocument();
  });

  it('handles field updates and form submission', async () => {
    render(<SettingsPage />);

    const newBlogName = 'Updated Blog Name';
    const input = await screen.findByLabelText(/blog name/i);

    fireEvent.change(input, { target: { value: newBlogName } });
    
    const saveButton = screen.getByRole('button', { name: /save settings/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Settings saved successfully!');
    });

    expect(screen.getByLabelText(/blog name/i)).toHaveValue(newBlogName);
  });

  it('can add and remove social links', async () => {
    render(<SettingsPage />);

    await screen.findByDisplayValue(mockSettings.socialLinks!.twitter);

    const addButton = screen.getByRole('button', { name: /\+ add social link/i });
    fireEvent.click(addButton);

    const platforms = screen.getAllByPlaceholderText(/platform/i);
    const lastPlatformInput = platforms[platforms.length - 1];
    fireEvent.change(lastPlatformInput, { target: { value: 'LinkedIn' } });

    const removeButtons = screen.getAllByRole('button', { name: /×/ });
    fireEvent.click(removeButtons[0]);

    expect(screen.queryByDisplayValue(mockSettings.socialLinks!.twitter)).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('LinkedIn')).toBeInTheDocument();
  });
});