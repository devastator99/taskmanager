import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { FiCheckCircle, FiMessageCircle, FiUserPlus, FiFileText, FiClock } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ActivityItem {
  id: string;
  type: 'task_completed' | 'comment_added' | 'user_assigned' | 'task_created';
  title: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  taskTitle?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

const mockActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'task_completed',
    title: 'Task Completed',
    description: 'Design homepage mockup',
    user: { name: 'John Doe', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    taskTitle: 'Design homepage mockup',
    priority: 'high'
  },
  {
    id: '2',
    type: 'comment_added',
    title: 'New Comment',
    description: 'Added feedback on the authentication flow',
    user: { name: 'Jane Smith', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    taskTitle: 'Implement user authentication'
  },
  {
    id: '3',
    type: 'user_assigned',
    title: 'Task Assigned',
    description: 'You were assigned to "API Integration"',
    user: { name: 'Mike Johnson', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    taskTitle: 'API Integration',
    priority: 'urgent'
  },
  {
    id: '4',
    type: 'task_created',
    title: 'New Task',
    description: 'Created "Database optimization"',
    user: { name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    taskTitle: 'Database optimization',
    priority: 'medium'
  }
];

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'task_completed':
      return FiCheckCircle;
    case 'comment_added':
      return FiMessageCircle;
    case 'user_assigned':
      return FiUserPlus;
    case 'task_created':
      return FiFileText;
    default:
      return FiClock;
  }
};

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'task_completed':
      return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    case 'comment_added':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    case 'user_assigned':
      return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
    case 'task_created':
      return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
  }
};

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const RecentActivity: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FiClock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivity.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          const colorClasses = getActivityColor(activity.type);
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={`p-2 rounded-full ${colorClasses}`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  {activity.priority && (
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(activity.priority)}`} />
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Avatar className="w-4 h-4">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback className="text-xs">
                      {activity.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{activity.user.name}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        <div className="text-center pt-2">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View all activity
          </button>
        </div>
      </CardContent>
    </Card>
  );
};