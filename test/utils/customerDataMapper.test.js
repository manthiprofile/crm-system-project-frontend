import { describe, it, expect } from 'vitest';
import {
  parseAddress,
  combineAddress,
  splitFullName,
  combineFullName,
  parsePhoneNumber,
  toApiFormat,
  fromApiFormat,
} from '../../src/utils/customerDataMapper';

describe('customerDataMapper Utilities', () => {
  describe('parseAddress', () => {
    it('parses full address with state and country', () => {
      const result = parseAddress('123 Main St, New York, NY, USA');
      expect(result).toEqual({
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      });
    });

    it('parses address with state and ZIP', () => {
      const result = parseAddress('123 Main St, New York, NY 10001');
      expect(result).toEqual({
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      });
    });

    it('parses address with only street and city', () => {
      const result = parseAddress('123 Main St, New York');
      expect(result).toEqual({
        address: '123 Main St',
        city: 'New York',
        state: '',
        country: 'USA',
      });
    });

    it('handles empty address string', () => {
      const result = parseAddress('');
      expect(result).toEqual({
        address: '',
        city: '',
        state: '',
        country: 'USA',
      });
    });

    it('handles null/undefined address', () => {
      const result = parseAddress(null);
      expect(result).toEqual({
        address: '',
        city: '',
        state: '',
        country: 'USA',
      });
    });
  });

  describe('combineAddress', () => {
    it('combines all address parts', () => {
      const result = combineAddress('123 Main St', 'New York', 'NY', 'USA');
      expect(result).toBe('123 Main St, New York, NY');
    });

    it('includes country when not USA', () => {
      const result = combineAddress('123 Main St', 'London', 'England', 'UK');
      expect(result).toBe('123 Main St, London, England, UK');
    });

    it('filters out empty parts', () => {
      const result = combineAddress('123 Main St', '', 'NY', 'USA');
      expect(result).toBe('123 Main St, NY');
    });
  });

  describe('splitFullName', () => {
    it('splits full name into first and last name', () => {
      const result = splitFullName('John Doe');
      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('handles name with multiple last names', () => {
      const result = splitFullName('John Doe Smith');
      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe Smith',
      });
    });

    it('handles single name', () => {
      const result = splitFullName('John');
      expect(result).toEqual({
        firstName: 'John',
        lastName: '',
      });
    });

    it('handles empty string', () => {
      const result = splitFullName('');
      expect(result).toEqual({
        firstName: '',
        lastName: '',
      });
    });

    it('handles null/undefined', () => {
      const result = splitFullName(null);
      expect(result).toEqual({
        firstName: '',
        lastName: '',
      });
    });
  });

  describe('combineFullName', () => {
    it('combines first and last name', () => {
      const result = combineFullName('John', 'Doe');
      expect(result).toBe('John Doe');
    });

    it('handles empty last name', () => {
      const result = combineFullName('John', '');
      expect(result).toBe('John');
    });

    it('handles empty first name', () => {
      const result = combineFullName('', 'Doe');
      expect(result).toBe('Doe');
    });

    it('handles both empty', () => {
      const result = combineFullName('', '');
      expect(result).toBe('');
    });
  });

  describe('parsePhoneNumber', () => {
    it('parses phone number with country code', () => {
      const result = parsePhoneNumber('+11234567890');
      expect(result).toEqual({
        countryCode: '11',
        phoneNumber: '234567890',
      });
    });

    it('parses phone number with 2-digit country code', () => {
      const result = parsePhoneNumber('+44123456789');
      expect(result).toEqual({
        countryCode: '44',
        phoneNumber: '123456789',
      });
    });

    it('handles phone number without + prefix', () => {
      const result = parsePhoneNumber('1234567890');
      expect(result).toEqual({
        countryCode: '11',
        phoneNumber: '1234567890',
      });
    });

    it('handles empty string', () => {
      const result = parsePhoneNumber('');
      expect(result).toEqual({
        countryCode: '11',
        phoneNumber: '',
      });
    });

    it('handles null/undefined', () => {
      const result = parsePhoneNumber(null);
      expect(result).toEqual({
        countryCode: '11',
        phoneNumber: '',
      });
    });

    it('handles phone with only 1 digit after +', () => {
      const result = parsePhoneNumber('+1');
      expect(result).toEqual({
        countryCode: '11',
        phoneNumber: '',
      });
    });
  });

  describe('toApiFormat', () => {
    it('converts frontend format to API format', () => {
      const frontendCustomer = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, New York, NY',
      };

      const result = toApiFormat(frontendCustomer);
      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '15551234567',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      });
    });

    it('handles missing fields', () => {
      const frontendCustomer = {
        fullName: 'John',
        email: '',
        phone: '',
        address: '',
      };

      const result = toApiFormat(frontendCustomer);
      expect(result).toEqual({
        firstName: 'John',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        country: 'USA',
      });
    });
  });

  describe('fromApiFormat', () => {
    it('converts API format to frontend format', () => {
      const apiCustomer = {
        accountId: 123,
        id: 123,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        dateCreated: '2024-01-15T10:30:00.000Z',
      };

      const result = fromApiFormat(apiCustomer);
      expect(result).toMatchObject({
        id: 123,
        accountId: 123,
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        addressDisplay: '123 Main St, New York',
      });
      expect(result.phoneNumber).toBe('1234567890');
      expect(result.dateCreated).toBeTruthy();
    });

    it('formats 10-digit phone number', () => {
      const apiCustomer = {
        accountId: 123,
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
      };

      const result = fromApiFormat(apiCustomer);
      // The phone number is formatted to +1 (123) 456-7890, so check for the digits
      expect(result.phone.replace(/\D/g, '')).toContain('1234567890');
    });

    it('handles missing accountId', () => {
      const apiCustomer = {
        id: 456,
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = fromApiFormat(apiCustomer);
      expect(result.id).toBe(456);
      expect(result.accountId).toBe(456);
    });

    it('handles missing dateCreated', () => {
      const apiCustomer = {
        accountId: 123,
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = fromApiFormat(apiCustomer);
      expect(result.dateCreated).toBe('');
      expect(result.joined).toBe('');
    });
  });
});

