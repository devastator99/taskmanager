import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateTaskMutation } from '../../api/tasksApi';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';

export default function TaskForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      priority: 2, // Default to Medium priority
    },
  });
  const [createTask, { isLoading, isSuccess, isError, error }] = useCreateTaskMutation();

  const onSubmit = async (data) => {
    try {
      await createTask({
        ...data,
        priority: Number(data.priority),
        assigned_to: Number(data.assigned_to),
      }).unwrap();
      reset();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleCloseSnackbar = () => {
    // Reset mutation state
    // This would typically be handled by the API slice
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to create task: {error?.data?.detail || error?.data?.message || 'Unknown error'}
        </Alert>
      )}

      <TextField
        fullWidth
        margin="normal"
        label="Title"
        {...register('title', { required: 'Title is required' })}
        error={!!errors.title}
        helperText={errors.title?.message}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Description"
        multiline
        rows={3}
        {...register('description')}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Due Date"
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
        {...register('due_date', { required: 'Due date is required' })}
        error={!!errors.due_date}
        helperText={errors.due_date?.message}
        required
      />

      <FormControl fullWidth margin="normal" required>
        <InputLabel>Priority</InputLabel>
        <Select
          label="Priority"
          {...register('priority', { required: 'Priority is required' })}
          defaultValue={2}
        >
          <MenuItem value={1}>Low</MenuItem>
          <MenuItem value={2}>Medium</MenuItem>
          <MenuItem value={3}>High</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="Assigned To (User ID)"
        type="number"
        {...register('assigned_to', {
          required: 'User ID is required',
          min: { value: 1, message: 'User ID must be a positive number' },
        })}
        error={!!errors.assigned_to}
        helperText={errors.assigned_to?.message}
        required
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2, mb: 2 }}
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        {isLoading ? 'Creating...' : 'Add Task'}
      </Button>

      <Snackbar
        open={isSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Task created successfully!"
      />
    </Box>
  );
}
