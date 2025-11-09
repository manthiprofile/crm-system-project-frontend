import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCustomers as fetchCustomersAPI,
  createCustomer as createCustomerAPI,
  updateCustomer as updateCustomerAPI,
  deleteCustomer as deleteCustomerAPI,
} from '../../services/api/customerService';
import { fromApiFormat } from '../../utils/customerDataMapper';

/**
 * Async thunk for fetching all customers via API
 * @returns {Promise<Array>} Promise that resolves with array of customers
 */
export const fetchCustomersAsync = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const customers = await fetchCustomersAPI();
      // Convert API format to frontend format if needed
      // If API returns array, map each customer
      if (Array.isArray(customers)) {
        return customers.map((customer) => fromApiFormat(customer));
      }
      return customers;
    } catch (error) {
      return rejectWithValue({
        status: error.status || 500,
        message: error.message || 'Failed to fetch customers',
      });
    }
  }
);

/**
 * Async thunk for creating a new customer via API
 * @param {Object} customerData - Customer data to create
 * @returns {Promise<Object>} Promise that resolves with created customer
 */
export const createCustomerAsync = createAsyncThunk(
  'customers/createCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const newCustomer = await createCustomerAPI(customerData);
      // Convert API format to frontend format
      return fromApiFormat(newCustomer);
    } catch (error) {
      return rejectWithValue({
        status: error.status || 500,
        message: error.message || 'Failed to create customer',
      });
    }
  }
);

/**
 * Async thunk for updating a customer via API
 * @param {Object} payload - Object with id and data
 * @param {number} payload.id - Customer ID (numeric accountId)
 * @param {Object} payload.data - Customer data to update
 * @returns {Promise<Object>} Promise that resolves with updated customer
 */
export const updateCustomerAsync = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updatedCustomer = await updateCustomerAPI(id, data);
      // Convert API format to frontend format
      // Preserve the id/accountId from the request
      return fromApiFormat({ ...updatedCustomer, accountId: updatedCustomer.accountId || id, id: updatedCustomer.accountId || id });
    } catch (error) {
      return rejectWithValue({
        status: error.status || 500,
        message: error.message || 'Failed to update customer',
      });
    }
  }
);

/**
 * Async thunk for deleting a customer via API
 * @param {number} id - Customer ID (numeric accountId)
 * @returns {Promise<void>} Promise that resolves on successful deletion
 */
export const deleteCustomerAsync = createAsyncThunk(
  'customers/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await deleteCustomerAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue({
        status: error.status || 500,
        message: error.message || 'Failed to delete customer',
      });
    }
  }
);

/**
 * Initial customer data - empty array, will be populated from API
 */
const initialState = {
  customers: [],
  searchTerm: '',
  viewMode: 'table', // 'table'
  loading: false,
  error: null,
};

/**
 * Customer slice for managing customer state
 */
const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    /**
     * Add a new customer
     * @param {Object} state - Current state
     * @param {Object} action - Action with customer payload
     */
    addCustomer: (state, action) => {
      const newCustomer = {
        ...action.payload,
        id: Date.now(),
        joined: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        balance: parseFloat(action.payload.balance) || 0,
      };
      state.customers.push(newCustomer);
    },
    /**
     * Update an existing customer
     * @param {Object} state - Current state
     * @param {Object} action - Action with id and updated customer data
     */
    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(
        (customer) => customer.id === action.payload.id
      );
      if (index !== -1) {
        state.customers[index] = {
          ...state.customers[index],
          ...action.payload.updates,
          balance: parseFloat(action.payload.updates.balance) || state.customers[index].balance,
        };
      }
    },
    /**
     * Delete a customer
     * @param {Object} state - Current state
     * @param {Object} action - Action with customer id
     */
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(
        (customer) => customer.id !== action.payload
      );
    },
    /**
     * Set search term for filtering customers
     * @param {Object} state - Current state
     * @param {Object} action - Action with search term
     */
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    /**
     * Set view mode (table)
     * @param {Object} state - Current state
     * @param {Object} action - Action with view mode
     */
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    /**
     * Set error state
     * @param {Object} state - Current state
     * @param {Object} action - Action with error message
     */
    setError: (state, action) => {
      state.error = action.payload;
    },
    /**
     * Clear error state
     * @param {Object} state - Current state
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers pending
      .addCase(fetchCustomersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fetch customers fulfilled
      .addCase(fetchCustomersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update customers with fetched data
        state.customers = action.payload;
      })
      // Fetch customers rejected
      .addCase(fetchCustomersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create customer pending
      .addCase(createCustomerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Create customer fulfilled
      .addCase(createCustomerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Add new customer to state
        state.customers.push(action.payload);
      })
      // Create customer rejected
      .addCase(createCustomerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update customer pending
      .addCase(updateCustomerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Update customer fulfilled
      .addCase(updateCustomerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update customer in state (check both id and accountId)
        const updatedCustomer = action.payload;
        const index = state.customers.findIndex(
          (customer) => 
            customer.id === updatedCustomer.id || 
            customer.id === updatedCustomer.accountId ||
            customer.accountId === updatedCustomer.id ||
            customer.accountId === updatedCustomer.accountId
        );
        if (index !== -1) {
          state.customers[index] = updatedCustomer;
        }
      })
      // Update customer rejected
      .addCase(updateCustomerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete customer pending
      .addCase(deleteCustomerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Delete customer fulfilled
      .addCase(deleteCustomerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Remove customer from state (check both id and accountId)
        const deletedId = action.payload;
        state.customers = state.customers.filter(
          (customer) => 
            customer.id !== deletedId && 
            customer.accountId !== deletedId
        );
      })
      // Delete customer rejected
      .addCase(deleteCustomerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addCustomer,
  updateCustomer,
  deleteCustomer,
  setSearchTerm,
  setViewMode,
  setError,
  clearError,
} = customerSlice.actions;

export default customerSlice.reducer;

