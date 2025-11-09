import React from 'react';
import styles from './Button.module.css';

/**
 * Button component with different variants and sizes
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant: 'primary', 'secondary', 'danger'
 * @param {string} props.size - Button size: 'small', 'medium', 'large'
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.type - Button type: 'button', 'submit', 'reset'
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Button component
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  const buttonClasses = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

