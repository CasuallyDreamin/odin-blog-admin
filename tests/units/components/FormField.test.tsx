import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FormField from '@/components/admin/FormField';

describe('FormField Component', () => {
  const mockOnChange = vi.fn();

  it('renders a text input and associates it with the label', () => {
    render(
      <FormField 
        label="Username" 
        value="" 
        onChange={mockOnChange} 
      />
    );

    const input = screen.getByLabelText(/username/i);
    
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders a textarea when type is textarea', () => {
    render(
      <FormField 
        label="Description" 
        type="textarea" 
        value="Hello" 
        onChange={mockOnChange} 
      />
    );

    const textarea = screen.getByLabelText(/description/i);
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveValue('Hello');
  });

  it('renders a select with options when type is select', () => {
    const options = ['Option 1', 'Option 2'];
    render(
      <FormField 
        label="Pick one" 
        type="select" 
        options={options} 
        value="Option 1" 
        onChange={mockOnChange} 
      />
    );

    const select = screen.getByLabelText(/pick one/i);
    expect(select.tagName).toBe('SELECT');
    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    render(
      <FormField 
        label="Name" 
        value="" 
        onChange={mockOnChange} 
      />
    );

    const input = screen.getByLabelText(/name/i);
    fireEvent.change(input, { target: { value: 'John Doe' } });

    expect(mockOnChange).toHaveBeenCalledWith('John Doe');
  });

  it('displays an asterisk when required is true', () => {
    render(
      <FormField 
        label="Email" 
        value="" 
        onChange={mockOnChange} 
        required={true} 
      />
    );

    expect(screen.getByText(/email\s*\*/i)).toBeInTheDocument();
  });
});