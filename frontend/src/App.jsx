import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress, Box, Alert } from '@mui/material';
import ThemeProvider, { useTheme } from './theme/ThemeProvider';
import Navigation from './components/Navigation';

// Lazy load components for better performance
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const TaskList = lazy(() => import('./features/tasks/TaskList'));

// Error Boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={3}>
          <Alert severity="error">Something went wrong. Please try refreshing the page.</Alert>
        </Box>
      );
    }
    return this.props.children;
  }
}

// Loading component
const Loader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

function RequireAuth({ children }) {
  const token = useSelector((state) => state.auth.accessToken);
  const isLoading = useSelector((state) => state.auth.isLoading);

  if (isLoading) {
    return <Loader />;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

function AppContent() {
  const { darkMode, toggleDarkMode } = useTheme();
  const token = useSelector((state) => state.auth.accessToken);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {token && <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route
              path="/login"
              element={
                <Suspense fallback={<Loader />}>
                  <LoginPage />
                </Suspense>
              }
            />
            <Route
              path="/tasks"
              element={
                <RequireAuth>
                  <Suspense fallback={<Loader />}>
                    <TaskList />
                  </Suspense>
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/tasks" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
