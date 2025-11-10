# CRM System - Frontend

A modern, responsive React web application for managing customer accounts. Built with React, Redux Toolkit, and Vite.

## Features

- 🎨 Responsive design that works on all devices
- 🔄 Redux Toolkit for state management
- 🧭 React Router for navigation
- 📦 Comprehensive UI component library
- ✅ Form validation
- 🔔 Toast notifications
- 📊 Data tables
- 🎯 Type-safe with JSDoc comments
- 🧪 Unit testing with Vitest
- 📝 ESLint and Prettier for code quality

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Backend API Server** - The backend should be running on `http://localhost:3000`

## Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd crm-system-project-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install all required dependencies listed in `package.json`.

## Environment Variables

Create a `.env` file in the root directory to configure the API base URL:

```env
VITE_API_BASE_URL=http://localhost:3000
```

**Note:** If you don't create a `.env` file, the application will default to `http://localhost:3000`.

## Running the Application

### Development Server

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is occupied).

**Important:** Make sure your backend API server is running on `http://localhost:3000` before starting the frontend.

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build |
| `npm test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code using Prettier |

## Testing

### Run Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

This will generate a coverage report in the `coverage` directory. Open `coverage/index.html` in your browser to view the detailed coverage report.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button/         # Button component
│   ├── Input/          # Input component
│   ├── Select/         # Select dropdown component
│   ├── Textarea/       # Textarea component
│   ├── Modal/          # Modal dialog component
│   ├── Table/          # Table component
│   ├── Toast/          # Toast notification components
│   └── ...
├── pages/              # Page components
│   └── Customers/      # Customer accounts page
├── store/              # Redux store and slices
│   ├── store.js        # Redux store configuration
│   └── slices/         # Redux slices
│       └── customerSlice.js
├── services/           # API services
│   └── api/
│       ├── axiosClient.js      # Axios configuration
│       └── customerService.js  # Customer API service
├── context/            # React context providers
│   └── ToastContext.jsx
├── utils/              # Utility functions
│   └── customerDataMapper.js
├── App.jsx             # Main App component
└── main.jsx            # Application entry point

test/                   # Test files
├── components/         # Component tests
├── pages/              # Page tests
├── services/           # Service tests
└── setup.js            # Test setup configuration
```

## Technologies Used

- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **CSS Modules** - Scoped styling

## API Configuration

The application communicates with a backend API. By default, it expects the API to be running at `http://localhost:3000`.

### API Endpoints

The application uses the following API endpoints:

- `GET /customer-accounts` - Fetch all customers
- `POST /customer-accounts` - Create a new customer
- `PATCH /customer-accounts/:id` - Update a customer
- `DELETE /customer-accounts/:id` - Delete a customer

### Proxy Configuration

During development, Vite is configured to proxy API requests from `/api` to `http://localhost:3000`. This helps avoid CORS issues.

## Development Workflow

1. **Start the backend server** on `http://localhost:3000`
2. **Start the frontend development server**:
   ```bash
   npm run dev
   ```
3. **Open your browser** and navigate to `http://localhost:5173`
4. **Make changes** to the code - the development server will automatically reload

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port. Check the terminal output for the actual port number.

### Backend Connection Issues

If you see connection errors:

1. **Verify the backend is running** on `http://localhost:3000`
2. **Check the API base URL** in your `.env` file
3. **Verify CORS settings** on the backend server
4. **Check the browser console** for detailed error messages

### Module Not Found Errors

If you encounter module not found errors:

1. **Delete `node_modules` folder**:
   ```bash
   rm -rf node_modules
   ```
2. **Delete `package-lock.json`**:
   ```bash
   rm package-lock.json
   ```
3. **Reinstall dependencies**:
   ```bash
   npm install
   ```

### Build Errors

If you encounter build errors:

1. **Check for linting errors**:
   ```bash
   npm run lint
   ```
2. **Fix formatting issues**:
   ```bash
   npm run format
   ```
3. **Clear the build cache** and rebuild:
   ```bash
   rm -rf dist
   npm run build
   ```

## Code Quality

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

### Formatting

Format your code using Prettier:

```bash
npm run format
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Ensure all tests pass before submitting
4. Run linting and formatting before committing

## Support

For issues or questions, please check the troubleshooting section above or contact the developer.


