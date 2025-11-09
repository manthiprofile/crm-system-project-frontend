import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchTerm,
  setViewMode,
  deleteCustomer,
} from '../../store/slices/customerSlice';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import AddCustomerModal from '../../components/AddCustomerModal/AddCustomerModal';
import styles from './CustomerAccounts.module.css';

/**
 * CustomerAccounts page component displaying customer list with search and add functionality
 * @returns {JSX.Element} CustomerAccounts component
 */
const CustomerAccounts = () => {
  const dispatch = useDispatch();
  const { customers, searchTerm, viewMode } = useSelector(
    (state) => state.customers
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Filter customers based on search term
   */
  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;

    const term = searchTerm.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.fullName.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.company.toLowerCase().includes(term) ||
        customer.phone.includes(term)
    );
  }, [customers, searchTerm]);

  /**
   * Format currency value
   * @param {number} value - Currency value
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  /**
   * Handle search input change
   * @param {Object} event - Change event
   */
  const handleSearchChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };

  /**
   * Handle delete customer
   * @param {number} id - Customer id
   */
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(deleteCustomer(id));
    }
  };

  /**
   * Get status badge class
   * @param {string} status - Customer status
   * @returns {string} Status badge class
   */
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return styles.statusActive;
      case 'Pending':
        return styles.statusPending;
      case 'Inactive':
        return styles.statusInactive;
      default:
        return styles.statusDefault;
    }
  };

  /**
   * Table columns configuration
   */
  const columns = [
    {
      key: 'fullName',
      label: 'Customer',
      render: (value, row) => (
        <div className={styles.customerCell}>
          <div className={styles.customerName}>{value}</div>
          <div className={styles.customerId}>ID: {row.id}</div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (value, row) => (
        <div className={styles.contactCell}>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📧</span>
            <span>{row.email}</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📞</span>
            <span>{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'company',
      label: 'Company',
      render: (value) => (
        <div className={styles.companyCell}>
          <span className={styles.companyIcon}>🏢</span>
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`${styles.statusBadge} ${getStatusClass(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (value) => (
        <span className={styles.balanceCell}>{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'joined',
      label: 'Joined',
      render: (value) => <span className={styles.joinedCell}>{value}</span>,
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
              // Handle edit - can be implemented later
              alert('Edit functionality coming soon');
            }}
            aria-label="Edit customer"
          >
            ✏️
          </button>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            aria-label="Delete customer"
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
              accounts, monitor balances, and keep your business organized.
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
              <button
                className={`${styles.viewButton} ${
                  viewMode === 'cards' ? styles.viewButtonActive : ''
                }`}
                onClick={() => dispatch(setViewMode('cards'))}
                aria-label="Cards view"
              >
                <span>🃏</span> Cards
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <Table columns={columns} data={filteredCustomers} />
        )}

        {/* Cards View - Placeholder for future implementation */}
        {viewMode === 'cards' && (
          <div className={styles.cardsPlaceholder}>
            Cards view coming soon...
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CustomerAccounts;

