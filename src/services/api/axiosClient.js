import axios from 'axios';

/**
 * Get API base URL from environment variable or use default
 */
const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
};

/**
 * Axios instance with base configuration
 */
const axiosClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Set to false to avoid CORS issues with credentials
});

/**
 * Request interceptor for logging and adding common headers
 */
axiosClient.interceptors.request.use(
  (config) => {
    // Log request in development
    if (import.meta.env.DEV) {
      const fullUrl = `${config.baseURL}${config.url}`;
      console.log(`[API Request] ${config.method?.toUpperCase()} ${fullUrl}`, config.data || '');
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    // Return a properly formatted error object
    return Promise.reject({
      status: 0,
      message: error.message || 'Request setup failed',
      originalError: error,
    });
  }
);

/**
 * Response interceptor for error handling and logging
 */
axiosClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      const fullUrl = `${response.config.baseURL}${response.config.url}`;
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${fullUrl}`,
        `Status: ${response.status}`,
        response.data || ''
      );
    }
    return response;
  },
  (error) => {
    const requestUrl = error.config
      ? `${error.config.baseURL || ''}${error.config.url || ''}`
      : 'Unknown URL';
    const requestMethod = error.config?.method?.toUpperCase() || 'UNKNOWN';

    // Handle error responses
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const errorMessage =
        data?.message ||
        data?.error ||
        `Request failed with status ${status}`;

      console.error(
        `[API Error] ${requestMethod} ${requestUrl}`,
        `Status: ${status}`,
        data
      );

      // Return error with status and message
      return Promise.reject({
        status,
        message: errorMessage,
        data,
        url: requestUrl,
        method: requestMethod,
        originalError: error,
      });
    } else if (error.request) {
      // Request was made but no response received
      // This typically means:
      // 1. Network error (connection refused, no internet)
      // 2. CORS error (blocked by browser)
      // 3. Timeout
      // 4. Backend not running

      let errorMessage = 'Network error. Please check your connection.';
      let status = 0;

      // Check for specific error types
      if (error.code === 'ECONNREFUSED') {
        errorMessage = `Connection refused. Please ensure the backend server is running at ${getApiBaseUrl()}`;
        status = 0;
      } else if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
        errorMessage = 'Request timeout. The server took too long to respond.';
        status = 0;
      } else if (error.message?.includes('Network Error') || error.message?.includes('CORS')) {
        errorMessage = `CORS error or network issue. Please check if the backend at ${getApiBaseUrl()} is running and CORS is configured correctly.`;
        status = 0;
      } else if (!error.request.response) {
        errorMessage = `No response from server. Please ensure the backend at ${getApiBaseUrl()} is running and accessible.`;
        status = 0;
      }

      console.error(
        `[API Network Error] ${requestMethod} ${requestUrl}`,
        errorMessage,
        error.code || '',
        error.message || ''
      );

      return Promise.reject({
        status,
        message: errorMessage,
        url: requestUrl,
        method: requestMethod,
        code: error.code,
        originalError: error,
      });
    } else {
      // Error setting up the request
      console.error(
        `[API Request Setup Error] ${requestMethod} ${requestUrl}`,
        error.message || 'Unknown error'
      );

      return Promise.reject({
        status: 0,
        message: error.message || 'An unexpected error occurred',
        url: requestUrl,
        method: requestMethod,
        originalError: error,
      });
    }
  }
);

export default axiosClient;

