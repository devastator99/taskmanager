import axios from 'axios';
import { Task } from '@/types';

export interface NewTaskData {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'Low' | 'Medium' | 'High';
  projectId?: number | null; // Add projectId
}

export const fetchTasksApi = async (): Promise<Task[]> => {
  const response = await axios.get('/api/tasks/');
  return response.data;
};

export const createTaskApi = async (taskData: NewTaskData): Promise<Task> => {
  // Map priority strings to integers expected by backend
  const priorityMap = {
    'Low': 1,
    'Medium': 2,
    'High': 3
  };

  try {
    const response = await axios.post('/api/tasks/', {
      ...taskData,
      due_date: taskData.dueDate ? taskData.dueDate.toISOString().split('T')[0] : null,
      priority: priorityMap[taskData.priority],
      project: taskData.projectId || null, // Include project ID
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Axios error: server responded with a status code outside 2xx
      console.error('Task creation failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.error ||
        `Failed to create task (status ${error.response?.status}): ${error.message}`
      );
    } else {
      // Non-Axios error
      console.error('Unexpected error during task creation:', error);
      throw new Error('Unexpected error during task creation');
    }
  }
};

export const updateTaskApi = async (id: string, updates: Partial<NewTaskData>): Promise<Task> => {
  const response = await axios.patch(`/api/tasks/${id}/`, {
    ...updates,
    due_date: updates.dueDate ? updates.dueDate.toISOString().split('T')[0] : undefined,
    priority: updates.priority ? updates.priority.toUpperCase() : undefined,
    project: updates.projectId !== undefined ? updates.projectId : undefined, // Include project ID
  });
  return response.data;
};

export const deleteTaskApi = async (id: string): Promise<void> => {
  await axios.delete(`/api/tasks/${id}/`);
};


