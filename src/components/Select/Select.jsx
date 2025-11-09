import React from 'react';
import styles from './Select.module.css';

/**
 * Select dropdown component
 * @param {Object} props - Component props
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {Array} props.options - Array of option objects: { value, label }
 * @param {string} props.label - Label text
 * @param {boolean} props.required - Required field indicator
 * @param {string} props.error - Error message
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.id - Select id
 * @param {string} props.name - Select name
 * @returns {JSX.Element} Select component
 */
const Select = ({
  value,
  onChange,
  options = [],
  label = '',
  required = false,
  error = '',
  className = '',
  id,
  name,
}) => {
  const selectClasses = `${styles.select} ${error ? styles.error : ''} ${className}`.trim();

  return (
    <div className={styles.selectContainer}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.selectWrapper}>
        <select
          id={id}
          name={name}
          className={selectClasses}
          value={value}
          onChange={onChange}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.arrow}>▼</span>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Select;

