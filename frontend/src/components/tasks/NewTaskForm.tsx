import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiCalendar, FiTag, FiLoader } from 'react-icons/fi';
import { createTaskApi } from '@/api/tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const newTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
});

type NewTaskFormData = z.infer<typeof newTaskSchema>;

interface NewTaskFormProps {
  onClose: () => void;
  onTaskCreated: () => void;
}

export const NewTaskForm: React.FC<NewTaskFormProps> = ({ onClose, onTaskCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<NewTaskFormData>({
    resolver: zodResolver(newTaskSchema),
  });

  const onSubmit = async (data: NewTaskFormData) => {
    setIsLoading(true);
    try {
      await createTaskApi(data);
      onTaskCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold">Create New Task</h2>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !control._formValues.dueDate && "text-muted-foreground"
                )}
              >
                <FiCalendar className="mr-2 h-4 w-4" />
                {control._formValues.dueDate ? format(control._formValues.dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={control._formValues.dueDate}
                onSelect={(date) => setValue('dueDate', date as Date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select onValueChange={(value) => setValue('priority', value as 'Low' | 'Medium' | 'High')} defaultValue="Medium">
            <SelectTrigger className="w-full">
              <FiTag className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <FiLoader className="mr-2 h-4 w-4 animate-spin" />}
          Create Task
        </Button>
      </div>
    </form>
  );
};
