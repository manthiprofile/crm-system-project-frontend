import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateCustomerAsync, clearError } from '../../store/slices/customerSlice';
import { useToast } from '../../context/ToastContext';
import { splitFullName, parsePhoneNumber } from '../../utils/customerDataMapper';
import Modal from '../Modal/Modal';
import Input from '../Input/Input';
import Textarea from '../Textarea/Textarea';
import Button from '../Button/Button';
import styles from './EditCustomerModal.module.css';

/**
 * EditCustomerModal component for editing existing customers
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {Object} props.customer - Customer object to edit
 * @returns {JSX.Element} EditCustomerModal component
 */
const EditCustomerModal = ({ isOpen, onClose, customer }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '11',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: 'USA',
  });
  const [errors, setErrors] = useState({});

  /**
   * Initialize form data when customer changes
   */
  useEffect(() => {
    if (customer && isOpen) {
      // Use fullName if available, otherwise use firstName and lastName directly
      const { firstName: firstNameFromFull, lastName: lastNameFromFull } = splitFullName(customer.fullName || '');
      const firstName = customer.firstName || firstNameFromFull || '';
      const lastName = customer.lastName || lastNameFromFull || '';
      
      // Use separate fields directly from customer object (API provides separate address, city, state, country)
      // Fallback to parsing address string if separate fields are not available
      const address = customer.address || '';
      const city = customer.city || '';
      const state = customer.state || '';
      const country = customer.country || 'USA';
      
      // Parse phone number to extract country code and phone number
      const phoneData = parsePhoneNumber(customer.phoneNumber || customer.phone || '');

      setFormData({
        firstName,
        lastName,
        email: customer.email || '',
        countryCode: phoneData.countryCode,
        phoneNumber: phoneData.phoneNumber,
        address,
        city,
        state,
        country,
      });
      setErrors({});
    }
  }, [customer, isOpen]);

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Whether email is valid
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate phone format
   * @param {string} phone - Phone to validate
   * @returns {boolean} Whether phone is valid
   */
  const validatePhone = (phone, countryCode) => {
    const phoneRegex = /^[\d\s()-]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    const codeDigits = countryCode.replace(/\D/g, '');
    // Phone number should have exactly 9 digits (excluding country code)
    return phoneRegex.test(phone) && digitsOnly.length === 9 && codeDigits.length >= 1;
  };

  /**
   * Validate form data
   * @returns {boolean} Whether form is valid
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.countryCode.trim()) {
      newErrors.countryCode = 'Country code is required';
    } else {
      const codeDigits = formData.countryCode.replace(/\D/g, '');
      if (!/^\d+$/.test(codeDigits)) {
        newErrors.countryCode = 'Country code must contain only numbers';
      } else if (codeDigits.length !== 2) {
        newErrors.countryCode = 'Country code must be exactly 2 digits';
      }
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhone(formData.phoneNumber, formData.countryCode)) {
      const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
      if (phoneDigits.length !== 9) {
        newErrors.phoneNumber = 'Phone number must be exactly 9 digits';
      } else {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle input change
   * @param {Object} event - Change event
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle form submission
   * @param {Object} event - Form submit event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Concatenate country code and phone number with + prefix
      const countryCodeDigits = formData.countryCode.replace(/\D/g, '');
      const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
      const fullPhoneNumber = `+${countryCodeDigits}${phoneDigits}`;

      // Prepare API payload
      const apiPayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: fullPhoneNumber,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim() || 'USA',
      };

      await dispatch(updateCustomerAsync({ id: customer.accountId || customer.id, data: apiPayload })).unwrap();
      showToast('Customer updated successfully', 'success');
      handleClose();
    } catch (error) {
      const errorStatus = error?.status || 500;
      let errorMessage = 'Failed to update customer';

      if (errorStatus === 404) {
        errorMessage = 'Customer not found';
      } else if (errorStatus === 0) {
        errorMessage = 'Network error. Please check your connection';
      } else if (errorStatus >= 500) {
        errorMessage = 'Server error. Please try again later';
      } else if (error?.message) {
        errorMessage = error.message;
      }
    }
  };

  /**
   * Handle modal close and reset form
   */
  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      countryCode: '11',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      country: 'USA',
    });
    setErrors({});
    onClose();
  };

  if (!customer) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Customer"
      description="Update the customer information below."
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.nameRow}>
          <Input
            id="firstName"
            name="firstName"
            label="First Name"
            type="text"
            placeholder="Jane"
            value={formData.firstName}
            onChange={handleChange}
            required
            error={errors.firstName}
            className={styles.nameInput}
          />
          <Input
            id="lastName"
            name="lastName"
            label="Last Name"
            type="text"
            placeholder="Smith"
            value={formData.lastName}
            onChange={handleChange}
            required
            error={errors.lastName}
            className={styles.nameInput}
          />
        </div>

        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="jane.smith@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
        />

        <div className={styles.phoneRow}>
          <div className={styles.countryCodeWrapper}>
            <label htmlFor="countryCode" className={styles.phoneLabel}>
              Country Code
            </label>
            <div className={`${styles.countryCodeInput} ${errors.countryCode ? styles.inputError : ''}`}>
              <span className={styles.plusPrefix}>+</span>
              <input
                id="countryCode"
                name="countryCode"
                type="tel"
                placeholder="11"
                value={formData.countryCode}
                onChange={handleChange}
                className={styles.countryCodeField}
                maxLength={2}
              />
            </div>
            {errors.countryCode && (
              <span className={styles.errorMessage}>{errors.countryCode}</span>
            )}
          </div>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            placeholder="0987654321"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            error={errors.phoneNumber}
            className={styles.phoneNumberInput}
          />
        </div>

        <Input
          id="address"
          name="address"
          label="Address"
          type="text"
          placeholder="456 New St"
          value={formData.address}
          onChange={handleChange}
          required
          error={errors.address}
        />

        <div className={styles.locationRow}>
          <Input
            id="city"
            name="city"
            label="City"
            type="text"
            placeholder="Los Angeles"
            value={formData.city}
            onChange={handleChange}
            required
            error={errors.city}
            className={styles.locationInput}
          />
          <Input
            id="state"
            name="state"
            label="State"
            type="text"
            placeholder="CA"
            value={formData.state}
            onChange={handleChange}
            required
            error={errors.state}
            className={styles.locationInput}
          />
          <Input
            id="country"
            name="country"
            label="Country"
            type="text"
            placeholder="USA"
            value={formData.country}
            onChange={handleChange}
            className={styles.locationInput}
          />
        </div>

        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Update Customer
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditCustomerModal;
