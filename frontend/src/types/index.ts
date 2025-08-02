export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'member';
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  due_date: string;
  color: string;
  status: 'pending' | 'in-progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  owner: User;
  created_at: string;
  updated_at: string;

}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectId: string;
  assignee?: User;
  reporter: User;
  createdAt: Date;
  updatedAt: Date;
  due_date?: string;
  start_date?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  dependencies: string[];
  subtasks: Task[];
  parentId?: string;
  attachments: Attachment[];
  comments: Comment[];
  position: number;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  taskId: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: User;
  uploadedAt: Date;
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'comment_added' | 'due_soon' | 'overdue';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  userId: string;
  taskId?: string;
  projectId?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  tasks: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[];
  createdBy: User;
  isPublic: boolean;
}

export type ViewType = 'list' | 'kanban' | 'calendar' | 'gantt' | 'timeline';

export interface FilterOptions {
  status?: Task['status'][];
  priority?: Task['priority'][];
  assignee?: string[];
  project?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  tasksInProgress: number;
  tasksDueToday: number;
  tasksDueThisWeek: number;
  completionRate: number;
  averageCompletionTime: number;
}