import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from '@/components/admin/Modal';

describe('Modal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText(/modal content/i)).not.toBeInTheDocument();
  });

  it('renders content and title when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when the backdrop overlay is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );
  
    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);
  
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders footer buttons and handles confirm/cancel', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose} 
        onConfirm={mockOnConfirm}
        confirmLabel="Go"
        cancelLabel="Stop"
      >
        <div>Content</div>
      </Modal>
    );

    const confirmBtn = screen.getByText('Go');
    const cancelBtn = screen.getByText('Stop');

    fireEvent.click(confirmBtn);
    expect(mockOnConfirm).toHaveBeenCalled();

    fireEvent.click(cancelBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });
});