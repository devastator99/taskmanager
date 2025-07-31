import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardMetrics } from './dashboard/DashboardMetrics';
import { TaskList } from './dashboard/TaskList';
import { KanbanBoard } from './tasks/KanbanBoard';
import { QuickActions } from './dashboard/QuickActions';
import { AddProjectButton } from './dashboard/AddProjectButton';
import { AddProjectForm } from './dashboard/AddProjectForm';
import { Modal } from './Modal';

import { DashboardFilters, FilterOptions } from './dashboard/DashboardFilters';

import { useTask } from '@/contexts/TaskContext';
import { useProject } from '@/contexts/ProjectContext';

export const Dashboard: React.FC = () => {
  const { getSuggestedTasks, searchQuery } = useTask();
  const suggestedTasks = getSuggestedTasks();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const { addProject } = useProject();

  const handleSaveNewProject = (project: any) => {
    addProject(project);
    console.log('New project added:', project);
  };

  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    priority: [],
    assignee: [],
    dateRange: 'all',
    tags: [],
    project: [],
  });

  const overviewContent = (
    <div className="flex flex-col gap-4 sm:gap-6 h-full">
      <div className="flex-1 flex flex-col overflow-auto">
        <TaskList filters={filters} searchQuery={searchQuery} className="flex-1" />
      </div>
      {suggestedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 sm:p-6 border border-blue-200 dark:border-blue-800"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            🎯 Suggested Next Tasks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedTasks.map((task) => (
              <div key={task.id} className="bg-white dark:bg-gray-900 rounded-lg p-4 border hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2 text-sm sm:text-base truncate">{task.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full bg-${task.priority === 'urgent' ? 'red' : task.priority === 'high' ? 'orange' : 'yellow'}-100 text-${task.priority === 'urgent' ? 'red' : task.priority === 'high' ? 'orange' : 'yellow'}-800 flex-shrink-0`}>
                    {task.priority}
                  </span>
                  <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex-shrink-0">Start →</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header Section */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 truncate">Good morning, John! 👋</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Here's what's happening with your projects today.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <DashboardFilters filters={filters} onFiltersChange={setFilters} isOpen={isFiltersOpen} onToggle={() => setIsFiltersOpen(!isFiltersOpen)} />
            <AddProjectButton onClick={() => setIsAddProjectModalOpen(true)} />
          </div>
        </motion.div>
        <div className="mt-4 sm:mt-6">
          <DashboardMetrics />
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 overflow-auto">
        {overviewContent}
      </div>

      <Modal isOpen={isAddProjectModalOpen} onClose={() => setIsAddProjectModalOpen(false)}>
        <AddProjectForm
          onClose={() => setIsAddProjectModalOpen(false)}
          onSave={handleSaveNewProject}
        />
      </Modal>
    </div>
  );
};