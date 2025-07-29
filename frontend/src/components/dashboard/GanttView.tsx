import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTask } from '@/contexts/TaskContext';

interface GanttViewProps {
  className?: string;
}

export const GanttView: React.FC<GanttViewProps> = ({ className }) => {
  const { tasks } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeScale, setTimeScale] = useState<'days' | 'weeks' | 'months'>('weeks');

  const navigateTime = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      switch (timeScale) {
        case 'days':
          newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
          break;
        case 'weeks':
          newDate.setDate(prev.getDate() + (direction === 'next' ? 28 : -28));
          break;
        case 'months':
          newDate.setMonth(prev.getMonth() + (direction === 'next' ? 3 : -3));
          break;
      }
      return newDate;
    });
  };

  const getTimeColumns = () => {
    const columns = [];
    const startDate = new Date(currentDate);
    
    switch (timeScale) {
      case 'days':
        for (let i = 0; i < 14; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          columns.push({
            date,
            label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            isWeekend: date.getDay() === 0 || date.getDay() === 6
          });
        }
        break;
      case 'weeks':
        for (let i = 0; i < 8; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + (i * 7));
          const endDate = new Date(date);
          endDate.setDate(date.getDate() + 6);
          columns.push({
            date,
            label: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
            isWeekend: false
          });
        }
        break;
      case 'months':
        for (let i = 0; i < 6; i++) {
          const date = new Date(startDate);
          date.setMonth(startDate.getMonth() + i);
          columns.push({
            date,
            label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            isWeekend: false
          });
        }
        break;
    }
    
    return columns;
  };

  const timeColumns = getTimeColumns();

  const getTaskPosition = (task: any, columnDate: Date) => {
    if (!task.dueDate) return null;
    
    const taskDate = new Date(task.dueDate);
    const columnStart = new Date(columnDate);
    const columnEnd = new Date(columnDate);
    
    switch (timeScale) {
      case 'days':
        columnEnd.setDate(columnStart.getDate() + 1);
        break;
      case 'weeks':
        columnEnd.setDate(columnStart.getDate() + 7);
        break;
      case 'months':
        columnEnd.setMonth(columnStart.getMonth() + 1);
        break;
    }
    
    if (taskDate >= columnStart && taskDate < columnEnd) {
      return {
        inColumn: true,
        progress: task.progress || 0
      };
    }
    
    return null;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 border-red-600';
      case 'high': return 'bg-orange-500 border-orange-600';
      case 'medium': return 'bg-yellow-500 border-yellow-600';
      case 'low': return 'bg-green-500 border-green-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'todo': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTasks = tasks.filter(task => task.dueDate);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold">Project Timeline</CardTitle>
            <div className="flex items-center gap-2">
              {/* Time Scale Selector */}
              <div className="flex rounded-lg border p-1">
                {(['days', 'weeks', 'months'] as const).map((scale) => (
                  <Button
                    key={scale}
                    variant={timeScale === scale ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setTimeScale(scale)}
                    className="h-7 px-3 text-xs"
                  >
                    {scale.charAt(0).toUpperCase() + scale.slice(1)}
                  </Button>
                ))}
              </div>
              
              {/* Navigation */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTime('prev')}
                className="h-8 w-8 p-0"
              >
                <FiChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                className="h-8 px-3"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTime('next')}
                className="h-8 w-8 p-0"
              >
                <FiChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Timeline Header */}
              <div className="grid grid-cols-[300px_1fr] border-b">
                <div className="p-3 font-medium border-r">Tasks</div>
                <div className={`grid grid-cols-${timeColumns.length} gap-1`}>
                  {timeColumns.map((column, index) => (
                    <div
                      key={index}
                      className={`p-2 text-xs font-medium text-center border-r last:border-r-0 ${
                        column.isWeekend ? 'bg-muted/50' : ''
                      }`}
                    >
                      {column.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Task Rows */}
              <div className="space-y-1">
                {filteredTasks.map((task, taskIndex) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: taskIndex * 0.05 }}
                    className="grid grid-cols-[300px_1fr] border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    {/* Task Info */}
                    <div className="p-3 border-r flex flex-col gap-2">
                      <div className="font-medium text-sm truncate" title={task.title}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getStatusColor(task.status)}`}
                        >
                          {task.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getPriorityColor(task.priority)} text-white`}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      {task.assignee && (
                        <div className="text-xs text-muted-foreground">
                          Assigned to: {typeof task.assignee === 'string' ? task.assignee : 'Unknown'}
                        </div>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className={`grid grid-cols-${timeColumns.length} gap-1 items-center`}>
                      {timeColumns.map((column, columnIndex) => {
                        const position = getTaskPosition(task, column.date);
                        return (
                          <div
                            key={columnIndex}
                            className={`h-12 border-r last:border-r-0 relative ${
                              column.isWeekend ? 'bg-muted/30' : ''
                            }`}
                          >
                            {position?.inColumn && (
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.5, delay: taskIndex * 0.1 }}
                                className={`
                                  absolute inset-1 rounded border-2
                                  ${getPriorityColor(task.priority)}
                                  flex items-center justify-center
                                `}
                              >
                                <div className="text-white text-xs font-medium">
                                  {position.progress}%
                                </div>
                                {position.progress > 0 && (
                                  <div
                                    className="absolute left-0 top-0 h-full bg-white/30 rounded-sm"
                                    style={{ width: `${position.progress}%` }}
                                  />
                                )}
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredTasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FiCalendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks with due dates found</p>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs border-t pt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded border border-red-600"></div>
              <span>Urgent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded border border-orange-600"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded border border-yellow-600"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded border border-green-600"></div>
              <span>Low Priority</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
