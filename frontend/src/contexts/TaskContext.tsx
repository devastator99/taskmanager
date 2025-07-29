import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Project, User, Notification, Template, FilterOptions, DashboardMetrics } from '@/types';

interface TaskContextType {
  // Data
  tasks: Task[];
  projects: Project[];
  notifications: Notification[];
  templates: Template[];
  metrics: DashboardMetrics;
  
  // Current state
  selectedProject: Project | null;
  currentView: 'list' | 'kanban' | 'calendar' | 'gantt';
  filters: FilterOptions;
  searchQuery: string;
  
  // Actions
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  setSelectedProject: (project: Project | null) => void;
  setCurrentView: (view: 'list' | 'kanban' | 'calendar' | 'gantt') => void;
  setFilters: (filters: FilterOptions) => void;
  setSearchQuery: (query: string) => void;
  markNotificationRead: (id: string) => void;
  
  // Smart features
  getSuggestedTasks: () => Task[];
  getRecurringTasks: () => Task[];
  createFromTemplate: (templateId: string, projectId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Mock data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
  role: 'admin'
};

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    color: '#3B82F6',
    status: 'active',
    owner: mockUser,
    members: [mockUser],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    dueDate: new Date('2024-03-01'),
    progress: 65
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native iOS and Android application',
    color: '#10B981',
    status: 'active',
    owner: mockUser,
    members: [mockUser],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    dueDate: new Date('2024-04-15'),
    progress: 30
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design homepage mockup',
    description: 'Create high-fidelity mockups for the new homepage design',
    status: 'in-progress',
    priority: 'high',
    projectId: '1',
    assignee: mockUser,
    reporter: mockUser,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    dueDate: new Date('2024-02-01'),
    estimatedHours: 8,
    actualHours: 5,
    tags: ['design', 'ui/ux'],
    dependencies: [],
    subtasks: [],
    attachments: [],
    comments: [],
    position: 0
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up JWT-based authentication system',
    status: 'todo',
    priority: 'urgent',
    projectId: '1',
    assignee: mockUser,
    reporter: mockUser,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    dueDate: new Date('2024-01-25'),
    estimatedHours: 12,
    tags: ['backend', 'security'],
    dependencies: [],
    subtasks: [],
    attachments: [],
    comments: [],
    position: 1
  }
];

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'kanban' | 'calendar' | 'gantt'>('kanban');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState('');

  const metrics: DashboardMetrics = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    overdueTasks: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
    tasksInProgress: tasks.filter(t => t.status === 'in-progress').length,
    tasksDueToday: tasks.filter(t => {
      if (!t.dueDate) return false;
      const today = new Date();
      const dueDate = new Date(t.dueDate);
      return dueDate.toDateString() === today.toDateString();
    }).length,
    tasksDueThisWeek: tasks.filter(t => {
      if (!t.dueDate) return false;
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const dueDate = new Date(t.dueDate);
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

  const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, ...updates, updatedAt: new Date() }
        : project
    ));
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

  const createFromTemplate = (templateId: string, projectId: string) => {
    // Mock implementation
    console.log('Creating tasks from template:', templateId, 'for project:', projectId);
  };

  const value = {
    tasks,
    projects,
    notifications,
    templates,
    metrics,
    selectedProject,
    currentView,
    filters,
    searchQuery,
    createTask,
    updateTask,
    deleteTask,
    createProject,
    updateProject,
    setSelectedProject,
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