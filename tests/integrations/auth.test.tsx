import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '@/app/login/page';
import { mockRouter } from '../mocks/navigation';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

describe('Auth Flow Integration', () => {
  it('allows a user to log in and redirects to dashboard', async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: 'admin@sintopia.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/Signing in.../i);
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('shows an error message on invalid credentials (401)', async () => {
    server.use(
      http.post(`${API_URL}/auth/login`, () => {
        return new HttpResponse(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
      })
    );

    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('handles server errors gracefully (500)', async () => {
    server.use(
      http.post(`${API_URL}/auth/login`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'admin@sintopia.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});