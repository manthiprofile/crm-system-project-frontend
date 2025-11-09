import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCustomer } from '../../store/slices/customerSlice';
import Modal from '../Modal/Modal';
import Input from '../Input/Input';
import Select from '../Select/Select';
import Textarea from '../Textarea/Textarea';
import Button from '../Button/Button';
import styles from './AddCustomerModal.module.css';

/**
 * AddCustomerModal component for adding new customers
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @returns {JSX.Element} AddCustomerModal component
 */
const AddCustomerModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    status: 'Active',
    balance: '0',
    address: '',
  });
  const [errors, setErrors] = useState({});

  /**
   * Status options for dropdown
   */
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Inactive', label: 'Inactive' },
  ];

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
  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s()-]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  /**
   * Validate form data
   * @returns {boolean} Whether form is valid
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData.balance && isNaN(parseFloat(formData.balance))) {
      newErrors.balance = 'Balance must be a valid number';
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
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(addCustomer(formData));
    handleClose();
  };

  /**
   * Handle modal close and reset form
   */
  const handleClose = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      status: 'Active',
      balance: '0',
      address: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Customer"
      description="Fill in the details to create a new customer account."
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          id="fullName"
          name="fullName"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          required
          error={errors.fullName}
        />

        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
        />

        <Input
          id="phone"
          name="phone"
          label="Phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={handleChange}
          required
          error={errors.phone}
        />

        <Input
          id="company"
          name="company"
          label="Company"
          type="text"
          placeholder="Acme Corporation"
          value={formData.company}
          onChange={handleChange}
          required
          error={errors.company}
        />

        <Select
          id="status"
          name="status"
          label="Status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          error={errors.status}
        />

        <Input
          id="balance"
          name="balance"
          label="Account Balance"
          type="number"
          placeholder="0"
          value={formData.balance}
          onChange={handleChange}
          error={errors.balance}
        />

        <Textarea
          id="address"
          name="address"
          label="Address"
          placeholder="123 Main Street, City, State ZIP"
          value={formData.address}
          onChange={handleChange}
          required
          error={errors.address}
          rows={3}
        />

        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Customer
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCustomerModal;

