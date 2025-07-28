import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Box,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

const schema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: yup.string().max(1000, 'Description must be less than 1000 characters'),
  due_date: yup.string().required('Due date is required'),
  priority: yup.number().required('Priority is required').oneOf([1, 2, 3]),
  assigned_to: yup.number().required('User ID is required').positive('User ID must be positive'),
  status: yup.string().oneOf(['todo', 'in_progress', 'completed']).default('todo'),
});

export default function TaskFormDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
  error,
  task = null,
  title = 'Add New Task',
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      due_date: '',
      priority: 2,
      assigned_to: 1,
      status: 'todo',
    },
  });

  useEffect(() => {
    if (task) {
      // Populate form with task data for editing
      setValue('title', task.title);
      setValue('description', task.description || '');
      setValue('priority', task.priority);
      setValue('assigned_to', task.assigned_to);
      setValue('status', task.status || 'todo');

      // Format datetime for input
      const dueDate = new Date(task.due_date);
      const formattedDate = dueDate.toISOString().slice(0, 16);
      setValue('due_date', formattedDate);
    } else {
      // Reset form for new task
      reset({
        title: '',
        description: '',
        due_date: '',
        priority: 2,
        assigned_to: 1,
        status: 'todo',
      });
    }
  }, [task, setValue, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit({
        ...data,
        priority: Number(data.priority),
        assigned_to: Number(data.assigned_to),
      });
      if (!task) {
        reset(); // Only reset for new tasks
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error?.data?.detail || error?.data?.message || 'An error occurred'}
            </Alert>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Title"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            required
            autoFocus
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Due Date"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            {...register('due_date')}
            error={!!errors.due_date}
            helperText={errors.due_date?.message}
            required
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Priority</InputLabel>
              <Select label="Priority" {...register('priority')} error={!!errors.priority}>
                <MenuItem value={1}>Low</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>High</MenuItem>
              </Select>
            </FormControl>

            {task && (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" {...register('status')} error={!!errors.status}>
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>

          <TextField
            fullWidth
            margin="normal"
            label="Assigned To (User ID)"
            type="number"
            {...register('assigned_to')}
            error={!!errors.assigned_to}
            helperText={errors.assigned_to?.message}
            required
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={isLoading || isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || isSubmitting}
            startIcon={isLoading || isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isLoading || isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Add Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
