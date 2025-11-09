import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../../src/context/ToastContext';
import ToastContainer from '../../src/components/Toast/ToastContainer';

describe('ToastContext', () => {
  it('provides toast functionality to children', () => {
    const TestComponent = () => {
      const { showToast } = useToast();
      return (
        <button onClick={() => showToast('Test message', 'success')}>
          Show Toast
        </button>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.getByText('Show Toast')).toBeInTheDocument();
  });

  it('throws error when useToast is used outside provider', () => {
    const TestComponent = () => {
      useToast();
      return <div>Test</div>;
    };

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');

    consoleSpy.mockRestore();
  });

  it('shows toast when showToast is called', () => {
    const TestComponent = () => {
      const { showToast } = useToast();
      return (
        <button onClick={() => showToast('Test message', 'success')}>
          Show Toast
        </button>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
        <ToastContainer />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Show Toast').click();
    });

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('removes toast when removeToast is called', () => {
    const TestComponent = () => {
      const { showToast, removeToast, toasts } = useToast();
      const handleShow = () => {
        showToast('Test message', 'success', 0);
      };
      const handleRemove = () => {
        // Get the first toast ID from the toasts array
        if (toasts.length > 0) {
          removeToast(toasts[0].id);
        }
      };
      return (
        <>
          <button onClick={handleShow}>Show Toast</button>
          <button onClick={handleRemove}>Remove Toast</button>
        </>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
        <ToastContainer />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Show Toast').click();
    });

    expect(screen.getByText('Test message')).toBeInTheDocument();

    act(() => {
      screen.getByText('Remove Toast').click();
    });

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('supports multiple toasts', () => {
    const TestComponent = () => {
      const { showToast } = useToast();
      return (
        <>
          <button onClick={() => showToast('Message 1', 'success')}>
            Show Toast 1
          </button>
          <button onClick={() => showToast('Message 2', 'error')}>
            Show Toast 2
          </button>
        </>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
        <ToastContainer />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Show Toast 1').click();
      screen.getByText('Show Toast 2').click();
    });

    expect(screen.getByText('Message 1')).toBeInTheDocument();
    expect(screen.getByText('Message 2')).toBeInTheDocument();
  });
});

