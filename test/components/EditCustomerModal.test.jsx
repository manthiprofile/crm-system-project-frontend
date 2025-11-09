import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ToastProvider } from '../../src/context/ToastContext';
import EditCustomerModal from '../../src/components/EditCustomerModal/EditCustomerModal';
import customerReducer from '../../src/store/slices/customerSlice';

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

describe('EditCustomerModal', () => {
  const mockOnClose = vi.fn();
  const mockCustomer = {
    accountId: 1,
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '+11234567890',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    renderWithProviders(
      <EditCustomerModal
        isOpen={true}
        onClose={mockOnClose}
        customer={mockCustomer}
      />
    );
    expect(screen.getByText('Edit Customer')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    renderWithProviders(
      <EditCustomerModal
        isOpen={false}
        onClose={mockOnClose}
        customer={mockCustomer}
      />
    );
    expect(screen.queryByText('Edit Customer')).not.toBeInTheDocument();
  });

  it('populates form with customer data', async () => {
    renderWithProviders(
      <EditCustomerModal
        isOpen={true}
        onClose={mockOnClose}
        customer={mockCustomer}
      />
    );

    // Wait for the form to be populated (useEffect runs asynchronously)
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
    expect(screen.getByDisplayValue('New York')).toBeInTheDocument();
    expect(screen.getByDisplayValue('NY')).toBeInTheDocument();
  });

  it('parses phone number with country code', () => {
    renderWithProviders(
      <EditCustomerModal
        isOpen={true}
        onClose={mockOnClose}
        customer={mockCustomer}
      />
    );

    // Country code should be extracted (first 2 digits after +)
    const countryCodeInput = screen.getByLabelText(/country code/i);
    expect(countryCodeInput.value).toBe('11');
  });

  it('validates required fields', async () => {
    renderWithProviders(
      <EditCustomerModal
        isOpen={true}
        onClose={mockOnClose}
        customer={mockCustomer}
      />
    );

    // Wait for form to be populated first
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: '' } });

    const submitButton = screen.getByText(/update customer/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('calls onClose when modal is closed', () => {
    renderWithProviders(
      <EditCustomerModal
        isOpen={true}
        onClose={mockOnClose}
        customer={mockCustomer}
      />
    );

    const closeButton = screen.getByLabelText(/close modal/i);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles customer with missing fields', () => {
    const incompleteCustomer = {
      accountId: 1,
      firstName: 'John',
    };

    renderWithProviders(
      <EditCustomerModal
        isOpen={true}
        onClose={mockOnClose}
        customer={incompleteCustomer}
      />
    );

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
  });
});

