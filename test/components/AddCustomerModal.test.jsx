import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ToastProvider } from '../../src/context/ToastContext';
import AddCustomerModal from '../../src/components/AddCustomerModal/AddCustomerModal';
import customerReducer from '../../src/store/slices/customerSlice';
import * as customerSlice from '../../src/store/slices/customerSlice';

// Mock the async thunk
vi.mock('../../src/store/slices/customerSlice', async () => {
  const actual = await vi.importActual('../../src/store/slices/customerSlice');
  return {
    ...actual,
    createCustomerAsync: vi.fn(),
  };
});

const mockShowToast = vi.fn();
const mockRemoveToast = vi.fn();

// Mock ToastContext at module level
vi.mock('../../src/context/ToastContext', async () => {
  const actual = await vi.importActual('../../src/context/ToastContext');
  return {
    ...actual,
    useToast: () => ({
      showToast: mockShowToast,
      removeToast: mockRemoveToast,
      toasts: [],
    }),
  };
});

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      customers: customerReducer,
    },
    preloadedState: {
      customers: {
        customers: [],
        searchTerm: '',
        viewMode: 'table',
        loading: false,
        error: null,
        ...initialState,
      },
    },
  });
};

const renderWithProviders = (component, store = createMockStore()) => {
  return render(
    <Provider store={store}>
      <ToastProvider>{component}</ToastProvider>
    </Provider>
  );
};

describe('AddCustomerModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    renderWithProviders(
      <AddCustomerModal isOpen={true} onClose={mockOnClose} />
    );
    expect(screen.getByText('Add New Customer')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    renderWithProviders(
      <AddCustomerModal isOpen={false} onClose={mockOnClose} />
    );
    expect(screen.queryByText('Add New Customer')).not.toBeInTheDocument();
  });

  it('renders all form fields', () => {
    renderWithProviders(
      <AddCustomerModal isOpen={true} onClose={mockOnClose} />
    );
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProviders(
      <AddCustomerModal isOpen={true} onClose={mockOnClose} />
    );

    const submitButton = screen.getByText(/add customer/i);
    fireEvent.click(submitButton);

    // Wait for validation errors to appear - check for the actual error text
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('validates email format', async () => {
    renderWithProviders(
      <AddCustomerModal isOpen={true} onClose={mockOnClose} />
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    const submitButton = screen.getByText(/add customer/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('validates phone number format', async () => {
    renderWithProviders(
      <AddCustomerModal isOpen={true} onClose={mockOnClose} />
    );

    // Fill in required fields first
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    const lastNameInput = screen.getByLabelText(/last name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: '123' } });

    const submitButton = screen.getByText(/add customer/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Phone number must be exactly 9 digits')
      ).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('validates country code format', async () => {
    renderWithProviders(
      <AddCustomerModal isOpen={true} onClose={mockOnClose} />
    );

    // Fill in required fields first
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    const lastNameInput = screen.getByLabelText(/last name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: '123456789' } });

    const countryCodeInput = screen.getByLabelText(/country code/i);
    fireEvent.change(countryCodeInput, { target: { value: '1' } });

    const submitButton = screen.getByText(/add customer/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Country code must be exactly 2 digits')
      ).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('calls onClose when modal is closed', () => {
    renderWithProviders(
      <AddCustomerModal isOpen={true} onClose={mockOnClose} />
    );

    const closeButton = screen.getByLabelText(/close modal/i);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('resets form when modal is closed', () => {
    renderWithProviders(
      <AddCustomerModal isOpen={true} onClose={mockOnClose} />
    );

    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const closeButton = screen.getByLabelText(/close modal/i);
    fireEvent.click(closeButton);

    // Reopen modal
    const { rerender } = renderWithProviders(
      <AddCustomerModal isOpen={false} onClose={mockOnClose} />
    );
    rerender(
      <Provider store={createMockStore()}>
        <ToastProvider>
          <AddCustomerModal isOpen={true} onClose={mockOnClose} />
        </ToastProvider>
      </Provider>
    );

    const firstNameInputAfter = screen.getByLabelText(/first name/i);
    expect(firstNameInputAfter.value).toBe('');
  });
});

