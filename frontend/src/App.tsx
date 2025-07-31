
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { ProjectProvider } from './contexts/ProjectContext';

import { Header } from './components/layout/Header';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/dashboard/TaskList';
import { KanbanBoard } from './components/tasks/KanbanBoard';
import { CalendarView } from './components/dashboard/CalendarView';
import { AuthPage } from './components/auth/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminDashboard } from './components/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <TaskProvider>
            <ProjectProvider>
              <Toaster />
              <MainApp />
            </ProjectProvider>
          </TaskProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          {/* Add other protected routes here */}
          <Route path="/kanban" element={<ProtectedRoute><KanbanBoard /></ProtectedRoute>} />
          <Route path="/list" element={<ProtectedRoute><TaskList filters={{ status: [], priority: [], assignee: [], dateRange: 'all', tags: [], project: [] }} searchQuery="" /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarView/></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;