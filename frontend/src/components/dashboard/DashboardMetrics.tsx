import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiAlertTriangle, FiTrendingUp, FiCalendar, FiTarget } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTask } from '@/contexts/TaskContext';

export const DashboardMetrics: React.FC = () => {
  const { metrics } = useTask();

  const metricCards = [
    {
      title: 'Total Tasks',
      value: metrics.totalTasks,
      icon: FiTarget,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Completed',
      value: metrics.completedTasks,
      icon: FiCheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'In Progress',
      value: metrics.tasksInProgress,
      icon: FiClock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      change: '+3%',
      changeType: 'positive' as const
    },
    {
      title: 'Overdue',
      value: metrics.overdueTasks,
      icon: FiAlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      change: '-2%',
      changeType: 'negative' as const
    },
    {
      title: 'Due Today',
      value: metrics.tasksDueToday,
      icon: FiCalendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      change: '+5%',
      changeType: 'positive' as const
    },
    {
      title: 'Completion Rate',
      value: `${Math.round(metrics.completionRate)}%`,
      icon: FiTrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
      change: '+15%',
      changeType: 'positive' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metricCards.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`text-xs flex items-center gap-1 ${
                  metric.changeType === 'positive' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  <FiTrendingUp className="w-3 h-3" />
                  {metric.change}
                </div>
              </div>
              {metric.title === 'Completion Rate' && (
                <div className="mt-3">
                  <Progress value={metrics.completionRate} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};