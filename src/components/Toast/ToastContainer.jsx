import React from 'react';
import { useToast } from '../../context/ToastContext';
import Toast from './Toast';
import styles from './ToastContainer.module.css';

/**
 * ToastContainer component for rendering all active toasts
 * @returns {JSX.Element} ToastContainer component
 */
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.toastContainer} aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;

