import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  MoreVertical,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Flag,
  CheckCircle,
  CircleDot,
  CalendarClock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(task);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    onDelete(task.id);
    setDeleteDialogOpen(false);
  };

  const handleStatusToggle = () => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    onStatusChange(task.id, newStatus);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return 'success'; // Or a custom variant like 'priority-low'
      case 2:
        return 'warning'; // Or 'priority-medium'
      case 3:
        return 'destructive'; // Or 'priority-high'
      default:
        return 'secondary';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1:
        return 'Low';
      case 2:
        return 'Medium';
      case 3:
        return 'High';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'todo':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'todo':
        return 'To Do';
      default:
        return 'Unknown';
    }
  };

  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'completed';
  const dueDate = new Date(task.due_date);
  const now = new Date();
  const timeDiff = dueDate - now;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return (
    <>
      <Card
        className={cn(
          'mb-4 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg',
          task.status === 'completed' && 'opacity-80',
          isOverdue && 'border-l-4 border-destructive'
        )}
      >
        <CardHeader className="flex flex-row items-start justify-between space-x-4 p-4">
          <div className="flex items-center space-x-2 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStatusToggle}
              className={cn(
                task.status === 'completed' ? 'text-success' : 'text-muted-foreground',
                'hover:bg-transparent hover:text-success'
              )}
            >
              {task.status === 'completed' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <CircleDot className="h-5 w-5" />
              )}
            </Button>
            <h3
              className={cn(
                'text-lg font-semibold leading-none tracking-tight flex-1',
                task.status === 'completed' && 'line-through text-muted-foreground'
              )}
            >
              {task.title}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant={getPriorityColor(task.priority)} className="flex items-center gap-1">
              <Flag className="h-3 w-3" />
              {getPriorityLabel(task.priority)}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {getStatusLabel(task.status)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteClick}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {task.description && (
            <p className={cn('text-sm text-muted-foreground mb-2', !expanded && 'line-clamp-2')}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 items-center text-sm">
            <div className="flex items-center gap-1">
              {isOverdue ? (
                <CalendarClock className="h-4 w-4 text-destructive" />
              ) : (
                <Clock className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={cn(isOverdue ? 'text-destructive font-bold' : 'text-muted-foreground')}
              >
                {isOverdue ? 'Overdue: ' : 'Due: '}
                {dueDate.toLocaleDateString()}{' '}
                {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {daysDiff >= 0 && daysDiff <= 7 && task.status !== 'completed' && (
              <Badge
                variant={cn(
                  daysDiff <= 1 && 'destructive',
                  daysDiff <= 3 && daysDiff > 1 && 'warning',
                  daysDiff > 3 && 'info'
                )}
                className="text-xs"
              >
                {daysDiff === 0 ? 'Due Today' : `${daysDiff} days left`}
              </Badge>
            )}

            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{task.assigned_to_username}</span>
            </div>
          </div>

          {task.description && task.description.length > 100 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="px-0 mt-2"
            >
              {expanded ? 'Show Less' : 'Show More'}
              {expanded ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex justify-end p-4 pt-0">
          {/* Card actions can go here if needed */}
        </CardFooter>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{task.title}&rdquo;? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
