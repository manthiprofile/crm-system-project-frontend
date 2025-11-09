import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/Toast/ToastContainer';
import store from './store/store';
import CustomerAccounts from './pages/Customers/CustomerAccounts';
import './App.css';

/**
 * Main App component with routing and Redux provider
 * @returns {JSX.Element} App component
 */
function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<CustomerAccounts />} />
              <Route path="/customers" element={<CustomerAccounts />} />
            </Routes>
            <ToastContainer />
          </div>
        </Router>
      </ToastProvider>
    </Provider>
  );
}

export default App;

