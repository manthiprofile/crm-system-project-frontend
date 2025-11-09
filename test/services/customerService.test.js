import { describe, it, expect, vi, beforeEach } from 'vitest';
import axiosClient from '../../src/services/api/axiosClient';
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../../src/services/api/customerService';

// Mock axiosClient
vi.mock('../../src/services/api/axiosClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('customerService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchCustomers', () => {
    it('fetches customers successfully', async () => {
      const mockCustomers = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Smith' },
      ];

      axiosClient.get.mockResolvedValue({ data: mockCustomers });

      const result = await fetchCustomers();

      expect(axiosClient.get).toHaveBeenCalledWith('/customer-accounts');
      expect(result).toEqual(mockCustomers);
    });

    it('handles errors from axios interceptor', async () => {
      const error = { status: 500, message: 'Server error' };
      axiosClient.get.mockRejectedValue(error);

      await expect(fetchCustomers()).rejects.toEqual(error);
    });

    it('handles unexpected error format', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Network error');
      axiosClient.get.mockRejectedValue(error);

      await expect(fetchCustomers()).rejects.toMatchObject({
        status: expect.any(Number),
        message: expect.any(String),
      });

      consoleSpy.mockRestore();
    });
  });

  describe('createCustomer', () => {
    it('creates customer successfully', async () => {
      const customerData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      const mockResponse = { id: 1, ...customerData };

      axiosClient.post.mockResolvedValue({ data: mockResponse });

      const result = await createCustomer(customerData);

      expect(axiosClient.post).toHaveBeenCalledWith(
        '/customer-accounts',
        customerData
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles errors from axios interceptor', async () => {
      const error = { status: 400, message: 'Validation error' };
      axiosClient.post.mockRejectedValue(error);

      await expect(createCustomer({})).rejects.toEqual(error);
    });
  });

  describe('updateCustomer', () => {
    it('updates customer successfully', async () => {
      const customerData = { firstName: 'John', lastName: 'Updated' };
      const mockResponse = { id: 1, ...customerData };

      axiosClient.patch.mockResolvedValue({ data: mockResponse });

      const result = await updateCustomer(1, customerData);

      expect(axiosClient.patch).toHaveBeenCalledWith(
        '/customer-accounts/1',
        customerData
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles errors from axios interceptor', async () => {
      const error = { status: 404, message: 'Customer not found' };
      axiosClient.patch.mockRejectedValue(error);

      await expect(updateCustomer(999, {})).rejects.toEqual(error);
    });
  });

  describe('deleteCustomer', () => {
    it('deletes customer successfully', async () => {
      axiosClient.delete.mockResolvedValue({ data: null });

      await deleteCustomer(1);

      expect(axiosClient.delete).toHaveBeenCalledWith('/customer-accounts/1');
    });

    it('handles errors from axios interceptor', async () => {
      const error = { status: 404, message: 'Customer not found' };
      axiosClient.delete.mockRejectedValue(error);

      await expect(deleteCustomer(999)).rejects.toEqual(error);
    });
  });
});

