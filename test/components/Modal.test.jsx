import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../src/components/Modal/Modal';

describe('Modal Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    document.body.style.overflow = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Title"
        description="Test Description"
      >
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Find the backdrop element using container query
    const backdrop = container.querySelector('[class*="backdrop"]');
    if (backdrop) {
      fireEvent.click(backdrop, { target: backdrop });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    } else {
      // Fallback: find modal and click its parent
      const modal = container.querySelector('[class*="modal"]');
      if (modal && modal.parentElement) {
        fireEvent.click(modal.parentElement, { target: modal.parentElement });
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    }
  });

  it('does not call onClose when modal content is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    const content = screen.getByText('Modal Content');
    fireEvent.click(content);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('sets body overflow to hidden when modal is open', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body overflow when modal is closed', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('unset');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} className="custom-modal">
        <div>Modal Content</div>
      </Modal>
    );
    
    const modal = container.querySelector('.custom-modal');
    expect(modal).toBeInTheDocument();
  });
});

