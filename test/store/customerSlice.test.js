import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import customerReducer, {
  fetchCustomersAsync,
  createCustomerAsync,
  updateCustomerAsync,
  deleteCustomerAsync,
  setSearchTerm,
  setViewMode,
  setError,
  clearError,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from '../../src/store/slices/customerSlice';
import * as customerService from '../../src/services/api/customerService';
import * as customerDataMapper from '../../src/utils/customerDataMapper';

// Mock dependencies
vi.mock('../../src/services/api/customerService');
vi.mock('../../src/utils/customerDataMapper');

describe('customerSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        customers: customerReducer,
      },
    });
    vi.clearAllMocks();
  });

  describe('reducers', () => {
    it('sets initial state correctly', () => {
      const state = store.getState().customers;
      expect(state).toEqual({
        customers: [],
        searchTerm: '',
        viewMode: 'table',
        loading: false,
        error: null,
      });
    });

    it('sets search term', () => {
      store.dispatch(setSearchTerm('John'));
      expect(store.getState().customers.searchTerm).toBe('John');
    });

    it('sets view mode', () => {
      store.dispatch(setViewMode('table'));
      expect(store.getState().customers.viewMode).toBe('table');
    });

    it('sets error', () => {
      const error = { status: 500, message: 'Server error' };
      store.dispatch(setError(error));
      expect(store.getState().customers.error).toEqual(error);
    });

    it('clears error', () => {
      store.dispatch(setError({ status: 500, message: 'Error' }));
      store.dispatch(clearError());
      expect(store.getState().customers.error).toBeNull();
    });

    it('adds customer', () => {
      const customer = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      store.dispatch(addCustomer(customer));
      const customers = store.getState().customers.customers;
      expect(customers.length).toBe(1);
      expect(customers[0].firstName).toBe('John');
    });

    it('updates customer', () => {
      const customer = { id: 1, firstName: 'John', lastName: 'Doe' };
      store.dispatch(addCustomer(customer));
      const addedCustomer = store.getState().customers.customers[0];
      // Use the actual id from the added customer (which might be Date.now())
      store.dispatch(
        updateCustomer({ id: addedCustomer.id, updates: { firstName: 'Jane' } })
      );
      const updated = store.getState().customers.customers[0];
      expect(updated.firstName).toBe('Jane');
    });

    it('deletes customer', () => {
      const customer = { id: 1, firstName: 'John' };
      store.dispatch(addCustomer(customer));
      const addedCustomer = store.getState().customers.customers[0];
      // Use the actual id from the added customer
      store.dispatch(deleteCustomer(addedCustomer.id));
      expect(store.getState().customers.customers.length).toBe(0);
    });
  });

  describe('fetchCustomersAsync', () => {
    it('fetches customers successfully', async () => {
      const mockApiCustomers = [
        { accountId: 1, firstName: 'John', lastName: 'Doe' },
        { accountId: 2, firstName: 'Jane', lastName: 'Smith' },
      ];
      const mockFormattedCustomers = [
        { id: 1, accountId: 1, fullName: 'John Doe' },
        { id: 2, accountId: 2, fullName: 'Jane Smith' },
      ];

      customerService.fetchCustomers.mockResolvedValue(mockApiCustomers);
      customerDataMapper.fromApiFormat
        .mockReturnValueOnce(mockFormattedCustomers[0])
        .mockReturnValueOnce(mockFormattedCustomers[1]);

      await store.dispatch(fetchCustomersAsync());

      const state = store.getState().customers;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.customers.length).toBe(2);
    });

    it('handles fetch error', async () => {
      const error = { status: 500, message: 'Server error' };
      customerService.fetchCustomers.mockRejectedValue(error);

      await store.dispatch(fetchCustomersAsync());

      const state = store.getState().customers;
      expect(state.loading).toBe(false);
      expect(state.error).toEqual({
        status: 500,
        message: 'Server error',
      });
    });
  });

  describe('createCustomerAsync', () => {
    it('creates customer successfully', async () => {
      const customerData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      const mockApiCustomer = { accountId: 1, ...customerData };
      const mockFormattedCustomer = {
        id: 1,
        accountId: 1,
        fullName: 'John Doe',
        ...customerData,
      };

      customerService.createCustomer.mockResolvedValue(mockApiCustomer);
      customerDataMapper.fromApiFormat.mockReturnValue(mockFormattedCustomer);

      await store.dispatch(createCustomerAsync(customerData));

      const state = store.getState().customers;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.customers.length).toBe(1);
      expect(state.customers[0].fullName).toBe('John Doe');
    });

    it('handles create error', async () => {
      const error = { status: 400, message: 'Validation error' };
      customerService.createCustomer.mockRejectedValue(error);

      await store.dispatch(createCustomerAsync({}));

      const state = store.getState().customers;
      expect(state.loading).toBe(false);
      expect(state.error).toEqual({
        status: 400,
        message: 'Validation error',
      });
    });
  });

  describe('updateCustomerAsync', () => {
    it('updates customer successfully', async () => {
      // Add initial customer
      const initialCustomer = { id: 1, accountId: 1, firstName: 'John' };
      store.dispatch(addCustomer(initialCustomer));

      const updateData = { firstName: 'Jane' };
      const mockApiCustomer = { accountId: 1, id: 1, firstName: 'Jane' };
      const mockFormattedCustomer = {
        id: 1,
        accountId: 1,
        firstName: 'Jane',
      };

      customerService.updateCustomer.mockResolvedValue(mockApiCustomer);
      customerDataMapper.fromApiFormat.mockReturnValue(mockFormattedCustomer);

      await store.dispatch(
        updateCustomerAsync({ id: 1, data: updateData })
      );

      const state = store.getState().customers;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.customers[0].firstName).toBe('Jane');
    });

    it('handles update error', async () => {
      const error = { status: 404, message: 'Not found' };
      customerService.updateCustomer.mockRejectedValue(error);

      await store.dispatch(updateCustomerAsync({ id: 999, data: {} }));

      const state = store.getState().customers;
      expect(state.loading).toBe(false);
      expect(state.error).toEqual({
        status: 404,
        message: 'Not found',
      });
    });
  });

  describe('deleteCustomerAsync', () => {
    it('deletes customer successfully', async () => {
      // Add initial customer
      const customer = { id: 1, accountId: 1, firstName: 'John' };
      store.dispatch(addCustomer(customer));

      customerService.deleteCustomer.mockResolvedValue();

      await store.dispatch(deleteCustomerAsync(1));

      const state = store.getState().customers;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.customers.length).toBe(0);
    });

    it('handles delete error', async () => {
      const error = { status: 404, message: 'Not found' };
      customerService.deleteCustomer.mockRejectedValue(error);

      await store.dispatch(deleteCustomerAsync(999));

      const state = store.getState().customers;
      expect(state.loading).toBe(false);
      expect(state.error).toEqual({
        status: 404,
        message: 'Not found',
      });
    });
  });
});

