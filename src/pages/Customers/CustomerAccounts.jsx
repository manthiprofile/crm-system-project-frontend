import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchTerm,
  setViewMode,
  deleteCustomerAsync,
  fetchCustomersAsync,
  clearError,
} from '../../store/slices/customerSlice';
import { useToast } from '../../context/ToastContext';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import AddCustomerModal from '../../components/AddCustomerModal/AddCustomerModal';
import EditCustomerModal from '../../components/EditCustomerModal/EditCustomerModal';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import styles from './CustomerAccounts.module.css';

/**
 * CustomerAccounts page component displaying customer list with search and add functionality
 * @returns {JSX.Element} CustomerAccounts component
 */
const CustomerAccounts = () => {
  const dispatch = useDispatch();
  const { customers, searchTerm, viewMode, loading, error } = useSelector(
    (state) => state.customers
  );
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);

  /**
   * Fetch customers on component mount
   */
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        await dispatch(fetchCustomersAsync()).unwrap();
      } catch (error) {
        const errorStatus = error?.status || 500;
        let errorMessage = 'Failed to load customers';

        if (errorStatus === 0) {
          errorMessage = 'Network error. Please check your connection';
        } else if (errorStatus >= 500) {
          errorMessage = 'Server error. Please try again later';
        } else if (error?.message) {
          errorMessage = error.message;
        }
      }
    };

    loadCustomers();
  }, [dispatch]);

  /**
   * Filter and sort customers based on search term and account ID
   */
  const filteredCustomers = useMemo(() => {
    let result = customers;

    // Apply search filter if search term exists
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = customers.filter(
        (customer) => {
          const fullName = customer.fullName || 
            `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
          
          // Convert accountId to string for search (accountId is numeric)
          const accountIdStr = customer.accountId 
            ? String(customer.accountId) 
            : '';
          const idStr = customer.id 
            ? String(customer.id) 
            : '';
          
          return (
            fullName.toLowerCase().includes(term) ||
            (customer.email && customer.email.toLowerCase().includes(term)) ||
            (customer.phone && customer.phone && customer.phone.toLowerCase().includes(term)) ||
            (customer.phoneNumber && String(customer.phoneNumber).includes(term)) ||
            (accountIdStr && accountIdStr.toLowerCase().includes(term)) ||
            (idStr && idStr.toLowerCase().includes(term)) ||
            (customer.address && customer.address.toLowerCase().includes(term)) ||
            (customer.city && customer.city && customer.city.toLowerCase().includes(term))
          );
        }
      );
    }

    // Sort by accountId in ascending order (accountId is numeric)
    return [...result].sort((a, b) => {
      const accountIdA = a.accountId || a.id || 0;
      const accountIdB = b.accountId || b.id || 0;
      
      // Compare as numbers since accountId is always numeric
      return Number(accountIdA) - Number(accountIdB);
    });
  }, [customers, searchTerm]);

  /**
   * Handle search input change
   * @param {Object} event - Change event
   */
  const handleSearchChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };

  /**
   * Handle refresh customers list
   */
  const handleRefresh = async () => {
    try {
      await dispatch(fetchCustomersAsync()).unwrap();
      showToast('Customers refreshed successfully', 'success');
    } catch (error) {
      const errorStatus = error?.status || 500;
      let errorMessage = 'Failed to refresh customers';

      if (errorStatus === 0) {
        errorMessage = 'Network error. Please check your connection';
      } else if (errorStatus >= 500) {
        errorMessage = 'Server error. Please try again later';
      } else if (error?.message) {
        errorMessage = error.message;
      }
    }
  };

  /**
   * Handle delete button click - opens confirmation modal
   * @param {number|string} id - Customer id
   */
  const handleDelete = (id) => {
    setCustomerIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  /**
   * Confirm and execute delete customer with API call and toast notifications
   */
  const confirmDelete = async () => {
    if (!customerIdToDelete) return;

    try {
      await dispatch(deleteCustomerAsync(customerIdToDelete)).unwrap();
      // Success - customer deleted
      showToast('Customer deleted successfully', 'success');
      setCustomerIdToDelete(null);
    } catch (error) {
      // Error is handled by Redux and shown in useEffect
      // No need to show toast here - Redux will handle it
      setCustomerIdToDelete(null);
    }
  };

  /**
   * Effect to handle error state changes (fallback for errors not caught in specific handlers)
   * Only shows errors that aren't already handled by modals or specific handlers
   */
  useEffect(() => {
    if (error && !loading && typeof error === 'object' && error.message) {
      // Only show toast if error has a message and we're not currently loading
      // This is a fallback for errors that might occur outside of specific handlers
      const errorMessage = error.message || 'An error occurred. Please try again';
      showToast(errorMessage, 'error');
    }
  }, [error, loading, showToast, dispatch]);


  /**
   * Table columns configuration
   */
  const columns = [
    {
      key: 'accountId',
      label: 'Account ID',
      render: (value, row) => (
        <div className={styles.accountIdCell}>
          <span className={styles.accountIdValue}>{row.accountId || row.id}</span>
        </div>
      ),
    },
    {
      key: 'fullName',
      label: 'Full Name',
      render: (value, row) => {
        // Concatenate firstName and lastName if fullName is not available
        const displayName = row.fullName || 
          `${row.firstName || ''} ${row.lastName || ''}`.trim() || 
          'N/A';
        return (
          <div className={styles.fullNameCell}>
            <span className={styles.fullNameValue}>{displayName}</span>
          </div>
        );
      },
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (value, row) => (
        <div className={styles.contactCell}>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📧</span>
            <span>{row.email || 'N/A'}</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📞</span>
            <span>{row.phone || row.phoneNumber || 'N/A'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Address',
      render: (value, row) => {
        // Use addressDisplay if available (already concatenated address + city)
        // Otherwise concatenate address and city from row data
        const displayAddress = row.addressDisplay || 
          [row.address, row.city].filter((part) => part && part.trim()).join(', ') || 
          'N/A';
        return (
          <div className={styles.addressCell}>
            <span>{displayAddress}</span>
          </div>
        );
      },
    },
    {
      key: 'country',
      label: 'Country',
      render: (value, row) => (
        <div className={styles.countryCell}>
          <span>{row.country || 'USA'}</span>
        </div>
      ),
    },
    {
      key: 'dateCreated',
      label: 'Date Created',
      render: (value, row) => (
        <div className={styles.dateCreatedCell}>
          <span>{row.dateCreated || row.joined || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className={styles.actionsCell}>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCustomer(row);
              setIsEditModalOpen(true);
            }}
            aria-label="Edit customer"
          >
            ✏️
          </button>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.accountId || row.id);
            }}
            aria-label="Delete customer"
            disabled={loading}
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  const totalCustomers = customers.length;

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.headerTitle}>Welcome to Your CRM System</h1>
            <p className={styles.headerDescription}>
              Manage all your customer relationships in one place. Track
              customer informations and keep your business organized.
            </p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.statsBox}>
              <div className={styles.statsLabel}>Total Customers</div>
              <div className={styles.statsValue}>{totalCustomers}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleWrapper}>
            <h2 className={styles.sectionTitle}>Customer Accounts</h2>
            <p className={styles.sectionDescription}>
              Manage your customer accounts and view their details.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className={styles.addButton}
          >
            <span>➕</span> Add Customer
          </Button>
        </div>

        {/* Search and View Controls */}
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className={`${styles.refreshButton} ${loading ? styles.refreshing : ''}`}
              onClick={handleRefresh}
              disabled={loading}
              aria-label="Refresh customers"
              title="Refresh customers list"
            >
              🔄
            </button>
          </div>
          <div className={styles.viewControls}>
            <span className={styles.customerCount}>
              {filteredCustomers.length} customers
            </span>
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewButton} ${
                  viewMode === 'table' ? styles.viewButtonActive : ''
                }`}
                onClick={() => dispatch(setViewMode('table'))}
                aria-label="Table view"
              >
                <span>📊</span> Table
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <Table columns={columns} data={filteredCustomers} />
        )}

      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Edit Customer Modal */}
      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setCustomerIdToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmText="OK"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
};

export default CustomerAccounts;

