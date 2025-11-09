import React, { useEffect } from 'react';
import styles from './Toast.module.css';

/**
 * Toast component for displaying notification messages
 * @param {Object} props - Component props
 * @param {string} props.message - Toast message
 * @param {string} props.type - Toast type: 'success', 'error', 'info', 'warning'
 * @param {Function} props.onClose - Close handler
 * @param {number} props.duration - Auto-dismiss duration in milliseconds
 * @param {string} props.id - Unique toast identifier
 * @returns {JSX.Element} Toast component
 */
const Toast = ({ message, type = 'info', onClose, duration = 5000, id }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div
      className={`${styles.toast} ${styles[type]}`}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.toastContent}>
        <span className={styles.toastIcon}>{getIcon()}</span>
        <span className={styles.toastMessage}>{message}</span>
      </div>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;

