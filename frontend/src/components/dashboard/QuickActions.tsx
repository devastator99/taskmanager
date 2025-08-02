import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiUsers, FiFolderPlus, FiCalendar, FiZap, FiBook } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { NewTaskForm } from '@/components/tasks/NewTaskForm';


export const QuickActions: React.FC = () => {
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);

  const handleTaskCreated = () => {
    // Optionally refresh data or show a success message
    console.log('Task created successfully!');
  };

  const actions = [
    {
      title: 'New Task',
      description: 'Create a new task',
      icon: FiPlus,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
      action: () => setIsNewTaskDialogOpen(true)
    },
    {
      title: 'New Project',
      description: 'Start a new project',
      icon: FiFolderPlus,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
      action: () => console.log('New project')
    },
    {
      title: 'Schedule Meeting',
      description: 'Book a team meeting',
      icon: FiCalendar,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
      action: () => console.log('Schedule meeting')
    },
    {
      title: 'Invite Team',
      description: 'Add team members',
      icon: FiUsers,
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
      action: () => console.log('Invite team')
    },
    {
      title: 'Use Template',
      description: 'Create from template',
      icon: FiBook,
      color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20',
      action: () => console.log('Use template')
    },
    {
      title: 'Quick Add',
      description: 'Smart task creation',
      icon: FiZap,
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
      action: () => console.log('Quick add')
    }
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiZap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {actions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Button
                  variant="ghost"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                  onClick={action.action}
                >
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
        <DialogContent 
          className="sm:max-w-[425px]"
          aria-labelledby="quick-actions-title"
          aria-describedby="quick-actions-desc"
        >
          <DialogHeader>
            <DialogTitle id="quick-actions-title">Create New Task</DialogTitle>
            <DialogDescription id="quick-actions-desc">
              Fill in the details below to create a new task.
            </DialogDescription>
          </DialogHeader>
          <NewTaskForm
            onClose={() => setIsNewTaskDialogOpen(false)}
            onTaskCreated={handleTaskCreated}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};