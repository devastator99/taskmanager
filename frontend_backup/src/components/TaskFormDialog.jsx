import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { X, Loader2 } from 'lucide-react';

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
    watch,
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error?.data?.detail || error?.data?.message || 'An error occurred'}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title')}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register('description')}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="datetime-local"
              {...register('due_date')}
              className={errors.due_date ? 'border-destructive' : ''}
            />
            {errors.due_date && (
              <p className="text-sm text-destructive">{errors.due_date.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={String(watch('priority'))}
                onValueChange={(value) => setValue('priority', Number(value))}
              >
                <SelectTrigger className={errors.priority ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Low</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">High</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-destructive">{errors.priority.message}</p>
              )}
            </div>

            {task && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value) => setValue('status', value)}
                >
                  <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status.message}</p>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="assigned_to">Assigned To (User ID)</Label>
            <Input
              id="assigned_to"
              type="number"
              {...register('assigned_to')}
              className={errors.assigned_to ? 'border-destructive' : ''}
            />
            {errors.assigned_to && (
              <p className="text-sm text-destructive">{errors.assigned_to.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading || isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading || isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Add Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
