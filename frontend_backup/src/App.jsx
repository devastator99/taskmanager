import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner'; // Placeholder for a custom spinner
import { useTheme } from './theme/ThemeProvider'; // Keep useTheme if it's custom and not MUI-dependent
import Navigation from './components/Navigation';
import ThemeProvider from './theme/ThemeProvider';

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
        <div className="p-3">
          <Alert variant="destructive">Something went wrong. Please try refreshing the page.</Alert>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading component
const Loader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Spinner />
  </div>
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
