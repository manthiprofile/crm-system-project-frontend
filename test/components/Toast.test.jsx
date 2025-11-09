import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Toast from '../../src/components/Toast/Toast';

describe('Toast Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders toast message', () => {
    render(<Toast message="Test message" onClose={mockOnClose} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('displays success icon for success type', () => {
    render(<Toast message="Success" type="success" onClose={mockOnClose} />);
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('displays error icon for error type', () => {
    render(<Toast message="Error" type="error" onClose={mockOnClose} />);
    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('displays warning icon for warning type', () => {
    render(<Toast message="Warning" type="warning" onClose={mockOnClose} />);
    expect(screen.getByText('⚠')).toBeInTheDocument();
  });

  it('displays info icon for info type', () => {
    render(<Toast message="Info" type="info" onClose={mockOnClose} />);
    expect(screen.getByText('ℹ')).toBeInTheDocument();
  });

  it('displays info icon by default', () => {
    render(<Toast message="Default" onClose={mockOnClose} />);
    expect(screen.getByText('ℹ')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Toast message="Test" onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('Close notification');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('auto-dismisses after duration', async () => {
    render(<Toast message="Test" onClose={mockOnClose} duration={1000} />);
    
    // Advance timers and wait for the callback
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not auto-dismiss when duration is 0', () => {
    render(<Toast message="Test" onClose={mockOnClose} duration={0} />);
    
    vi.advanceTimersByTime(5000);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('has correct ARIA attributes', () => {
    render(<Toast message="Test" onClose={mockOnClose} />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'assertive');
  });
});

