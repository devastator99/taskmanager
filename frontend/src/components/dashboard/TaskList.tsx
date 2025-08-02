import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { FiClock, FiUser, FiCalendar, FiMoreVertical } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTask } from '@/contexts/TaskContext';
import { Task } from '@/types';
import { FilterOptions } from './DashboardFilters';
import { useProject } from '@/contexts/ProjectContext';

interface TaskListProps {
  filters: FilterOptions;
  searchQuery: string;
  className?: string;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500 text-red-50';
    case 'high':
      return 'bg-orange-500 text-orange-50';
    case 'medium':
      return 'bg-yellow-500 text-yellow-50';
    case 'low':
      return 'bg-green-500 text-green-50';
    default:
      return 'bg-gray-500 text-gray-50';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'on-hold':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'todo':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

export const TaskList: React.FC<TaskListProps> = ({ filters, searchQuery, className = '' }) => {
  const { tasks, updateTask, deleteTask} = useTask();
  const {projects} = useProject();

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority));
    }

    // Apply assignee filter
    if (filters.assignee.length > 0) {
      filtered = filtered.filter(task => 
        task.assignee && filters.assignee.includes(task.assignee.name)
      );
    }

    // Apply tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(task => 
        task.tags.some(tag => filters.tags.includes(tag))
      );
    }

    // Apply project filter
    if (filters.project.length > 0) {
      filtered = filtered.filter(task => 
        task.projectId && filters.project.includes(task.projectId)
      );
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(task => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        
        switch (filters.dateRange) {
          case 'today':
            return dueDate.toDateString() === today.toDateString();
          case 'week':
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            return dueDate >= today && dueDate <= weekFromNow;
          case 'month':
            const monthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
            return dueDate >= today && dueDate <= monthFromNow;
          case 'quarter':
            const quarterFromNow = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
            return dueDate >= today && dueDate <= quarterFromNow;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // Then by due date
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      
      return 0;
    });
  }, [tasks, filters, searchQuery]);

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { status: newStatus });
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === Number(projectId));
    return project?.name || 'Unknown Project';
  };

  if (filteredTasks.length === 0) {
    return (
      <Card className={`${className} p-6`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiClock className="w-5 h-5" />
            Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FiClock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No tasks found</p>
            <p className="text-sm">
              {searchQuery || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== 'all') 
                ? 'Try adjusting your search or filters'
                : 'Create your first task to get started'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiClock className="w-5 h-5" />
            Tasks
          </div>
          <Badge variant="secondary" className="text-xs">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group p-4 rounded-lg border hover:shadow-md transition-all duration-200 bg-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-sm truncate">{task.title}</h3>
                    <Badge 
                      className={`text-xs px-2 py-0.5 ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FiUser className="w-3 h-3" />
                      <span>{getProjectName(task.projectId)}</span>
                    </div>
                    
                    {task.assignee && (
                      <div className="flex items-center gap-1">
                        <Avatar className="w-4 h-4">
                          <AvatarImage src={task.assignee.avatar} />
                          <AvatarFallback className="text-xs">
                            {task.assignee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{task.assignee.name}</span>
                      </div>
                    )}
                    
                    {task.due_date && (
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}</span>
                      </div>
                    )}
                  </div>
                  
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiMoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'todo')}>
                        Mark as To Do
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'in-progress')}>
                        Mark as In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'completed')}>
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'todo')}>
                        Mark as On Hold
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteTask(task.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};