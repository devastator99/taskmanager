interface NewTaskData {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'Low' | 'Medium' | 'High';
}

export const createTaskApi = async (taskData: NewTaskData) => {
  const response = await fetch('http://localhost:8000/api/tasks/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add authorization header if needed
      // 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({
      ...taskData,
      due_date: taskData.dueDate ? taskData.dueDate.toISOString().split('T')[0] : null, // Format date for Django
      priority: taskData.priority.toUpperCase(), // Ensure priority matches Django's expected format
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create task');
  }

  return response.json();
};
