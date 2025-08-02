import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Notification, Template, FilterOptions, DashboardMetrics } from '@/types';

interface TaskContextType {
  // Data
  tasks: Task[];
  notifications: Notification[];
  templates: Template[];
  metrics: DashboardMetrics;
  
  // Current state
  currentView: 'overview' | 'list' | 'kanban' | 'calendar' | 'gantt';
  filters: FilterOptions;
  searchQuery: string;
  
  // Actions
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setCurrentView: (view: 'overview' | 'list' | 'kanban' | 'calendar' | 'gantt') => void;
  setFilters: (filters: FilterOptions) => void;
  setSearchQuery: (query: string) => void;
  markNotificationRead: (id: string) => void;
  // Smart features
  getSuggestedTasks: () => Task[];
  getRecurringTasks: () => Task[];
  createFromTemplate: (templateId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentView, setCurrentView] = useState<'overview' | 'list' | 'kanban' | 'calendar' | 'gantt'>('overview');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState('');

  const metrics: DashboardMetrics = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    overdueTasks: tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed').length,
    tasksInProgress: tasks.filter(t => t.status === 'in-progress').length,
    tasksDueToday: tasks.filter(t => {
      if (!t.due_date) return false;
      const today = new Date();
      const dueDate = new Date(t.due_date);
      return dueDate.toDateString() === today.toDateString();
    }).length,
    tasksDueThisWeek: tasks.filter(t => {
      if (!t.due_date) return false;
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const dueDate = new Date(t.due_date);
      return dueDate >= today && dueDate <= weekFromNow;
    }).length,
    completionRate: tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0,
    averageCompletionTime: 3.5 // Mock value in days
  };

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getSuggestedTasks = (): Task[] => {
    // Smart algorithm to suggest next tasks based on priority, dependencies, etc.
    return tasks
      .filter(task => task.status === 'todo')
      .sort((a, b) => {
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      })
      .slice(0, 3);
  };

  const getRecurringTasks = (): Task[] => {
    // Mock implementation - in real app, this would check for recurring patterns
    return [];
  };

  const createFromTemplate = (templateId: string) => {
    // Mock implementation
    console.log('Creating tasks from template:', templateId);
  };

  const value = {
    tasks,
    notifications,
    templates,
    metrics,
    currentView,
    filters,
    searchQuery,
    createTask,
    updateTask,
    deleteTask,
    setCurrentView,
    setFilters,
    setSearchQuery,
    markNotificationRead,
    getSuggestedTasks,
    getRecurringTasks,
    createFromTemplate
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};