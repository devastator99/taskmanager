import React from 'react';
import { motion } from 'framer-motion';
import { DashboardMetrics } from './dashboard/DashboardMetrics';
import { RecentActivity } from './dashboard/RecentActivity';
import { QuickActions } from './dashboard/QuickActions';
import { useTask } from '@/contexts/TaskContext';

export const Dashboard: React.FC = () => {
  const { getSuggestedTasks } = useTask();
  const suggestedTasks = getSuggestedTasks();

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Good morning, John! 👋</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your projects today.
        </p>
      </motion.div>

      {/* Metrics */}
      <DashboardMetrics />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Suggested Tasks */}
      {suggestedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            🎯 Suggested Next Tasks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-gray-900 rounded-lg p-4 border hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium mb-2">{task.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {task.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full bg-${task.priority === 'urgent' ? 'red' : task.priority === 'high' ? 'orange' : 'yellow'}-100 text-${task.priority === 'urgent' ? 'red' : task.priority === 'high' ? 'orange' : 'yellow'}-800`}>
                    {task.priority}
                  </span>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Start →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};