import React from 'react';
import styles from './Textarea.module.css';

/**
 * Textarea component for multi-line text input
 * @param {Object} props - Component props
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Textarea value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Label text
 * @param {boolean} props.required - Required field indicator
 * @param {string} props.error - Error message
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.rows - Number of rows
 * @param {string} props.id - Textarea id
 * @param {string} props.name - Textarea name
 * @returns {JSX.Element} Textarea component
 */
const Textarea = ({
  placeholder = '',
  value,
  onChange,
  label = '',
  required = false,
  error = '',
  className = '',
  rows = 4,
  id,
  name,
}) => {
  const textareaClasses = `${styles.textarea} ${error ? styles.error : ''} ${className}`.trim();

  return (
    <div className={styles.textareaContainer}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        className={textareaClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Textarea;

