import React from 'react';
import styles from './Input.module.css';

/**
 * Input component for text input fields
 * @param {Object} props - Component props
 * @param {string} props.type - Input type: 'text', 'email', 'tel', 'number', etc.
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Label text
 * @param {boolean} props.required - Required field indicator
 * @param {string} props.error - Error message
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.id - Input id
 * @param {string} props.name - Input name
 * @returns {JSX.Element} Input component
 */
const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  label = '',
  required = false,
  error = '',
  className = '',
  id,
  name,
}) => {
  const inputClasses = `${styles.input} ${error ? styles.error : ''} ${className}`.trim();

  return (
    <div className={styles.inputContainer}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input;

