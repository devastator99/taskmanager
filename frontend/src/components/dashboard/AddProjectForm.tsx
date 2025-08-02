import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../contexts/ProjectContext'; // Import Project interface

interface AddProjectFormProps {
  onClose: () => void;
  onSave: (project: Project) => void;
}

export const AddProjectForm: React.FC<AddProjectFormProps> = ({ onClose, onSave }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [due_date, setDueDate] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed' | 'archived'>('pending'); // Default status
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium'); // Default priority
  const [color, setColor] = useState('#000000'); // Default color

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!projectName.trim() || !due_date.trim()) {
      alert('Project Name and Due Date are required!');
      return;
    }

    const newProject: Project = {
      id: Date.now(),
      name: projectName,
      description,
      due_date,
      status,
      priority,
      color,
      owner: { id: "1", name: 'Demo User', email: 'demo@example.com', role: 'member' }, // Replace with real user if available
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onSave(newProject);
    onClose(); // Close modal after saving
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
          <input
            type="text"
            id="projectName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
          <input
            type="date"
            id="dueDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={due_date}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select
            id="status"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'pending' | 'in-progress' | 'completed' | 'archived')}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
          <input
            type="color"
            id="color"
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
          <select
            id="priority"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | 'urgent')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Project
          </button>
        </div>
      </form>
    </motion.div>
  );
};
