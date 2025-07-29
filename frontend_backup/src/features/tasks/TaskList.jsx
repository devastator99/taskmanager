import React, { useState, useMemo, useEffect } from 'react';
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '../../api/tasksApi';
import TaskCard from '../../components/TaskCard';
import TaskFilters from '../../components/TaskFilters';
import TaskFormDialog from '../../components/TaskFormDialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { PlusCircle, Info } from 'lucide-react';

export default function TaskList() {
  const { data: tasks = [], isLoading, error, refetch } = useGetTasksQuery();
  const [createTask, { isLoading: isCreating, error: createError }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating, error: updateError }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  // UI State
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Filter and Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('due_date');
  const [viewMode, setViewMode] = useState('list');

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === 'all' || task.priority.toString() === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'due_date':
          return new Date(a.due_date) - new Date(b.due_date);
        case 'priority':
          return b.priority - a.priority; // High to low
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created_at':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case 'status': {
          const statusOrder = { todo: 0, in_progress: 1, completed: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, searchTerm, statusFilter, priorityFilter, sortBy]);

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData).unwrap();
      setFormDialogOpen(false);
      setSnackbar({ open: true, message: 'Task created successfully!', severity: 'success' });
      refetch();
    } catch (error) {
      console.error('Failed to create task:', error);
      setSnackbar({ open: true, message: 'Failed to create task', severity: 'error' });
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask({ id: editingTask.id, ...taskData }).unwrap();
      setEditingTask(null);
      setFormDialogOpen(false);
      setSnackbar({ open: true, message: 'Task updated successfully!', severity: 'success' });
      refetch();
    } catch (error) {
      console.error('Failed to update task:', error);
      setSnackbar({ open: true, message: 'Failed to update task', severity: 'error' });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId).unwrap();
      setSnackbar({ open: true, message: 'Task deleted successfully!', severity: 'success' });
      refetch();
    } catch (error) {
      console.error('Failed to delete task:', error);
      setSnackbar({ open: true, message: 'Failed to delete task', severity: 'error' });
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      try {
        await updateTask({ id: taskId, ...task, status: newStatus }).unwrap();
        setSnackbar({
          open: true,
          message: `Task marked as ${newStatus.replace('_', ' ')}!`,
          severity: 'success',
        });
        refetch();
      } catch (error) {
        console.error('Failed to update task status:', error);
        setSnackbar({ open: true, message: 'Failed to update task status', severity: 'error' });
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setFormDialogOpen(false);
    setEditingTask(null);
  };

  // const { toast } = useToast();

  useEffect(() => {
    if (snackbar.open) {
      toast({
        title: snackbar.severity === 'error' ? 'Error' : 'Success',
        description: snackbar.message,
        variant: snackbar.severity === 'error' ? 'destructive' : 'default',
      });
      setSnackbar({ ...snackbar, open: false });
    }
  }, [snackbar, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Error loading tasks: {error.message || 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Your Tasks ({filteredTasks.length})
        </h1>

        <TaskFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {filteredTasks.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )
      ) : (
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'No tasks match your filters'
              : 'No tasks yet'}
          </h2>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your filters or create a new task'
              : 'Create your first task to get started!'}
          </p>
        </Card>
      )}

      <Button
        className="fixed bottom-4 right-4 rounded-full p-3 shadow-lg"
        onClick={() => setFormDialogOpen(true)}
      >
        <PlusCircle className="h-6 w-6" />
      </Button>

      <TaskFormDialog
        open={formDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        isLoading={isCreating || isUpdating}
        error={createError || updateError}
        task={editingTask}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      />
    </div>
  );
}
