import React, { useState, useMemo } from 'react';
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '../../api/tasksApi';
import TaskCard from '../../components/TaskCard';
import TaskFilters from '../../components/TaskFilters';
import TaskFormDialog from '../../components/TaskFormDialog';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Box,
  Fab,
  Grid,
  Snackbar,
  Skeleton,
} from '@mui/material';
import { Add } from '@mui/icons-material';

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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" height={80} sx={{ mb: 2 }} />
        </Box>
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={120} sx={{ mb: 2 }} />
        ))}
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading tasks: {error.message || 'Unknown error'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Tasks ({filteredTasks.length})
        </Typography>

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
      </Box>

      {filteredTasks.length > 0 ? (
        viewMode === 'grid' ? (
          <Grid container spacing={2}>
            {filteredTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <TaskCard
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </Box>
        )
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'No tasks match your filters'
              : 'No tasks yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your filters or create a new task'
              : 'Create your first task to get started!'}
          </Typography>
        </Paper>
      )}

      <Fab
        color="primary"
        aria-label="add task"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setFormDialogOpen(true)}
      >
        <Add />
      </Fab>

      <TaskFormDialog
        open={formDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        isLoading={isCreating || isUpdating}
        error={createError || updateError}
        task={editingTask}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Container>
  );
}
