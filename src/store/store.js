import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './slices/customerSlice';

/**
 * Redux store configuration
 * @returns {Object} Configured Redux store
 */
const store = configureStore({
  reducer: {
    customers: customerReducer,
  },
});

export default store;

