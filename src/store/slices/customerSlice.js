import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial customer data matching the design
 */
const initialState = {
  customers: [
    {
      id: 1,
      fullName: 'Sarah Johnson',
      email: 'sarah.j@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Inc.',
      status: 'Active',
      balance: 12500.0,
      joined: 'Jan 15, 2024',
      address: '123 Tech Street, San Francisco, CA 94102',
    },
    {
      id: 2,
      fullName: 'Michael Chen',
      email: 'mchen@innovate.io',
      phone: '+1 (555) 234-5678',
      company: 'Innovate Solutions',
      status: 'Active',
      balance: 8750.5,
      joined: 'Feb 20, 2024',
      address: '456 Innovation Ave, New York, NY 10001',
    },
    {
      id: 3,
      fullName: 'Emily Rodriguez',
      email: 'emily.r@designstudio.com',
      phone: '+1 (555) 345-6789',
      company: 'Creative Design Studio',
      status: 'Pending',
      balance: 0.0,
      joined: 'Nov 1, 2024',
      address: '789 Creative Blvd, Los Angeles, CA 90001',
    },
    {
      id: 4,
      fullName: 'David Park',
      email: 'dpark@quantum.net',
      phone: '+1 (555) 456-7890',
      company: 'Quantum Networks',
      status: 'Active',
      balance: 25000.0,
      joined: 'Dec 10, 2023',
      address: '321 Quantum Lane, Seattle, WA 98101',
    },
    {
      id: 5,
      fullName: 'Lisa Anderson',
      email: 'l.anderson@globaltech.com',
      phone: '+1 (555) 567-8901',
      company: 'GlobalTech Systems',
      status: 'Inactive',
      balance: 3200.0,
      joined: 'Mar 5, 2024',
      address: '654 Global Way, Chicago, IL 60601',
    },
  ],
  searchTerm: '',
  viewMode: 'table', // 'table' or 'cards'
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
     * Set view mode (table or cards)
     * @param {Object} state - Current state
     * @param {Object} action - Action with view mode
     */
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
  },
});

export const {
  addCustomer,
  updateCustomer,
  deleteCustomer,
  setSearchTerm,
  setViewMode,
} = customerSlice.actions;

export default customerSlice.reducer;

