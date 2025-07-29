import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  FolderOpen, 
  Calendar, 
  BarChart3, 
  Settings, 
  Plus,
  ChevronRight,
  Inbox,
  Star,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTask } from '@/contexts/TaskContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { projects, selectedProject, setSelectedProject, metrics } = useTask();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/', badge: null },
    { icon: Inbox, label: 'My Tasks', href: '/tasks', badge: metrics.tasksInProgress },
    { icon: Star, label: 'Important', href: '/important', badge: null },
    { icon: Clock, label: 'Due Today', href: '/due-today', badge: metrics.tasksDueToday },
    { icon: Calendar, label: 'Calendar', href: '/calendar', badge: null },
    { icon: BarChart3, label: 'Reports', href: '/reports', badge: null },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-card border-r border-border h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FolderOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="font-semibold text-lg">TaskFlow</h1>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-10",
              collapsed && "px-2"
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge !== null && item.badge > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Button>
        ))}

        {/* Projects Section */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-3">
            {!collapsed && (
              <h3 className="text-sm font-medium text-muted-foreground">Projects</h3>
            )}
            <Button size="sm" variant="ghost" className="w-6 h-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="space-y-1">
            {projects.map((project) => (
              <Button
                key={project.id}
                variant={selectedProject?.id === project.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-9",
                  collapsed && "px-2"
                )}
                onClick={() => setSelectedProject(project)}
              >
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{project.name}</span>
                    <ChevronRight className="w-3 h-3 opacity-50" />
                  </>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-10",
            collapsed && "px-2"
          )}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Button>
      </div>
    </motion.div>
  );
};