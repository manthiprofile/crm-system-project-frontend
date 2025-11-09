/**
 * Utility functions for mapping customer data between frontend and API formats
 */

/**
 * Parse address string to extract address, city, state, and country
 * Format: "123 Street, City, State ZIP" or "123 Street, City, State, Country"
 * @param {string} addressString - Full address string
 * @returns {Object} Object with address, city, state, country
 */
export const parseAddress = (addressString) => {
  if (!addressString) {
    return {
      address: '',
      city: '',
      state: '',
      country: 'USA',
    };
  }

  // Try to parse address format: "123 Street, City, State ZIP" or "123 Street, City, State, Country"
  const parts = addressString.split(',').map((part) => part.trim());

  if (parts.length >= 3) {
    // Format: "Street, City, State ZIP" or "Street, City, State, Country"
    const address = parts[0];
    const city = parts[1];
    const statePart = parts[2];
    
    // Extract state and ZIP (if present) - remove ZIP code
    const stateMatch = statePart.match(/^([A-Z]{2})(?:\s+\d{5})?$/);
    const state = stateMatch ? stateMatch[1] : statePart.split(' ')[0];
    
    // Check if country is provided
    const country = parts.length >= 4 ? parts[3] : 'USA';

    return {
      address,
      city,
      state,
      country,
    };
  } else if (parts.length === 2) {
    // Format: "Street, City"
    return {
      address: parts[0],
      city: parts[1],
      state: '',
      country: 'USA',
    };
  } else {
    // Just address, no parsing possible
    return {
      address: addressString,
      city: '',
      state: '',
      country: 'USA',
    };
  }
};

/**
 * Combine address components into a single address string
 * @param {string} address - Street address
 * @param {string} city - City
 * @param {string} state - State
 * @param {string} country - Country
 * @returns {string} Combined address string
 */
export const combineAddress = (address, city, state, country) => {
  const parts = [address, city, state].filter((part) => part && part.trim());
  return parts.join(', ') + (country && country !== 'USA' ? `, ${country}` : '');
};

/**
 * Split full name into first name and last name
 * @param {string} fullName - Full name string
 * @returns {Object} Object with firstName and lastName
 */
export const splitFullName = (fullName) => {
  if (!fullName) {
    return {
      firstName: '',
      lastName: '',
    };
  }

  const nameParts = fullName.trim().split(/\s+/);
  if (nameParts.length === 1) {
    return {
      firstName: nameParts[0],
      lastName: '',
    };
  }

  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return {
    firstName,
    lastName,
  };
};

/**
 * Combine first name and last name into full name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Full name
 */
export const combineFullName = (firstName, lastName) => {
  return [firstName, lastName].filter((part) => part && part.trim()).join(' ');
};

/**
 * Parse phone number with country code format (+1234567890) to extract country code and phone number
 * The first 2 digits after + are treated as country code (displayed as +XX, 3 chars total)
 * @param {string} phoneNumber - Phone number in format +1234567890
 * @returns {Object} Object with countryCode and phoneNumber
 */
export const parsePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return {
      countryCode: '11',
      phoneNumber: '',
    };
  }

  // Remove all non-digit characters except the leading +
  const cleaned = phoneNumber.trim();
  
  // If it starts with +, extract first 2 digits as country code
  if (cleaned.startsWith('+')) {
    const digitsOnly = cleaned.substring(1).replace(/\D/g, '');
    
    if (digitsOnly.length >= 2) {
      // Extract first 2 digits as country code (first 3 chars including + = +XX)
      const countryCode = digitsOnly.substring(0, 2);
      const phone = digitsOnly.substring(2);
      
      return {
        countryCode,
        phoneNumber: phone,
      };
    } else if (digitsOnly.length === 1) {
      // If only 1 digit after +, pad with 1 to make it 2 digits (default to 11)
      return {
        countryCode: digitsOnly + '1',
        phoneNumber: '',
      };
    } else {
      // No digits after +
      return {
        countryCode: '11',
        phoneNumber: '',
      };
    }
  }
  
  // If no + prefix, assume it's just the phone number (default country code 11)
  const digitsOnly = cleaned.replace(/\D/g, '');
  return {
    countryCode: '11',
    phoneNumber: digitsOnly,
  };
};

/**
 * Convert frontend customer data to API format
 * @param {Object} customer - Customer object in frontend format
 * @returns {Object} Customer object in API format
 */
export const toApiFormat = (customer) => {
  const { firstName, lastName } = splitFullName(customer.fullName || '');
  const { address, city, state, country } = parseAddress(customer.address || '');
  
  // Remove +, spaces, dashes, and parentheses from phone number
  const phoneNumber = (customer.phone || '').replace(/[+\s\-()]/g, '');

  return {
    firstName,
    lastName,
    email: customer.email || '',
    phoneNumber,
    address,
    city,
    state,
    country,
  };
};

/**
 * Format date from ISO string to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Convert API customer data to frontend format
 * @param {Object} customer - Customer object in API format
 * @returns {Object} Customer object in frontend format
 */
export const fromApiFormat = (customer) => {
  // Use accountId if available, otherwise fall back to id
  const id = customer.accountId || customer.id;
  
  // Concatenate firstName and lastName for full name
  const fullName = combineFullName(customer.firstName || '', customer.lastName || '');
  
  // Concatenate address and city (not the full address with state/country)
  const addressParts = [customer.address || '', customer.city || ''].filter((part) => part.trim());
  const address = addressParts.join(', ');
  
  // Format phone number: convert to +1 (555) 123-4567 format if it's 10 digits
  let phone = customer.phoneNumber || '';
  if (phone.length === 10 && /^\d+$/.test(phone)) {
    phone = `+1 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
  }

  // Format dateCreated from ISO string
  const dateCreated = formatDate(customer.dateCreated || customer.createdAt || customer.joined);

  return {
    id,
    accountId: customer.accountId || customer.id,
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    fullName,
    email: customer.email || '',
    phone,
    phoneNumber: customer.phoneNumber || '',
    address: customer.address || '',
    city: customer.city || '',
    state: customer.state || '',
    country: customer.country || 'USA',
    addressDisplay: address, // For display in table (address + city)
    company: customer.company || '',
    status: customer.status || 'Active',
    balance: customer.balance || 0,
    joined: dateCreated,
    dateCreated,
  };
};

