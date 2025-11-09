import axiosClient from './axiosClient';

/**
 * Customer API service for interacting with customer endpoints
 */

/**
 * Fetch all customer accounts
 * @returns {Promise<Array>} Promise that resolves with array of customers
 * @throws {Object} Error object with status and message
 */
export const fetchCustomers = async () => {
  try {
    const response = await axiosClient.get('/customer-accounts');
    return response.data;
  } catch (error) {
    // Error from axios interceptor is already properly formatted
    // Just ensure it has the right structure
    if (error && typeof error === 'object' && error.status !== undefined) {
      throw error;
    }
    // Fallback for unexpected error format
    console.error('[fetchCustomers] Unexpected error format:', error);
    throw {
      status: error?.status || error?.response?.status || 500,
      message: error?.message || error?.response?.data?.message || 'Failed to fetch customers',
      originalError: error,
    };
  }
};

/**
 * Create a new customer account
 * @param {Object} customerData - Customer data to create
 * @returns {Promise<Object>} Promise that resolves with created customer data
 * @throws {Object} Error object with status and message
 */
export const createCustomer = async (customerData) => {
  try {
    const response = await axiosClient.post('/customer-accounts', customerData);
    return response.data;
  } catch (error) {
    // Error from axios interceptor is already properly formatted
    // Just ensure it has the right structure
    if (error && typeof error === 'object' && error.status !== undefined) {
      throw error;
    }
    // Fallback for unexpected error format
    console.error('[createCustomer] Unexpected error format:', error);
    throw {
      status: error?.status || error?.response?.status || 500,
      message: error?.message || error?.response?.data?.message || 'Failed to create customer',
      originalError: error,
    };
  }
};

/**
 * Update a customer account by ID
 * @param {number} id - Customer ID (numeric accountId)
 * @param {Object} customerData - Customer data to update
 * @returns {Promise<Object>} Promise that resolves with updated customer data
 * @throws {Object} Error object with status and message
 */
export const updateCustomer = async (id, customerData) => {
  try {
    const response = await axiosClient.patch(
      `/customer-accounts/${id}`,
      customerData
    );
    return response.data;
  } catch (error) {
    // Error from axios interceptor is already properly formatted
    // Just ensure it has the right structure
    if (error && typeof error === 'object' && error.status !== undefined) {
      throw error;
    }
    // Fallback for unexpected error format
    console.error('[updateCustomer] Unexpected error format:', error);
    throw {
      status: error?.status || error?.response?.status || 500,
      message: error?.message || error?.response?.data?.message || 'Failed to update customer',
      originalError: error,
    };
  }
};

/**
 * Delete a customer account by ID
 * @param {number} id - Customer ID (numeric accountId)
 * @returns {Promise<void>} Promise that resolves on successful deletion
 * @throws {Object} Error object with status and message
 */
export const deleteCustomer = async (id) => {
  try {
    const response = await axiosClient.delete(`/customer-accounts/${id}`);
    // 204 No Content means success (response.data will be empty)
    return response.data;
  } catch (error) {
    // Error from axios interceptor is already properly formatted
    // Just ensure it has the right structure
    if (error && typeof error === 'object' && error.status !== undefined) {
      throw error;
    }
    // Fallback for unexpected error format
    console.error('[deleteCustomer] Unexpected error format:', error);
    throw {
      status: error?.status || error?.response?.status || 500,
      message: error?.message || error?.response?.data?.message || 'Failed to delete customer',
      originalError: error,
    };
  }
};

