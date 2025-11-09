import React, { useEffect } from 'react';
import styles from './Modal.module.css';

/**
 * Modal component for displaying content in a dialog
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {string} props.description - Modal description
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Modal component
 */
const Modal = ({
  isOpen,
  onClose,
  title = '',
  description = '',
  children,
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={`${styles.modal} ${className}`}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleSection}>
            <h2 className={styles.modalTitle}>{title}</h2>
            {description && (
              <p className={styles.modalDescription}>{description}</p>
            )}
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

