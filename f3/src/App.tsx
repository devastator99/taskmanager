import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/tasks/KanbanBoard';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { Toaster } from './components/ui/toaster';
import { useTask } from './contexts/TaskContext';
import { Task } from './types';

const AppContent: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { currentView } = useTask();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'kanban':
        return <KanbanBoard />;
      case 'list':
        return <div className="p-6">List view coming soon...</div>;
      case 'calendar':
        return <div className="p-6">Calendar view coming soon...</div>;
      case 'gantt':
        return <div className="p-6">Gantt view coming soon...</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background ">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <main className="flex-1 overflow-auto">
          {currentView === 'kanban' ? renderCurrentView() : <Dashboard />}
        </main>
      </div>

      <TaskDetailModal
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
      
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <Router>
            <AppContent />
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;