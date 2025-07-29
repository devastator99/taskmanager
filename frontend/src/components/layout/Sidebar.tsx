import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTask } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { FiHome, FiInbox, FiStar, FiClock, FiCalendar, FiBarChart2, FiFolder, FiPlus, FiChevronRight, FiSettings } from 'react-icons/fi';

type FeatherIconType = typeof FiHome;

interface NavigationItem {
  icon: FeatherIconType;
  label: string;
  href: string;
  badge?: number | null;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { projects, selectedProject, setSelectedProject, metrics } = useTask();
  const { isAdmin } = useAuth();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    { icon: FiHome, label: 'Dashboard', href: '/', badge: null },
    { icon: FiInbox, label: 'My Tasks', href: '/tasks', badge: metrics.tasksInProgress },
    { icon: FiStar, label: 'Important', href: '/important', badge: null },
    { icon: FiClock, label: 'Due Today', href: '/due-today', badge: metrics.tasksDueToday },
    { icon: FiCalendar, label: 'Calendar', href: '/calendar', badge: null },
    { icon: FiBarChart2, label: 'Reports', href: '/reports', badge: null },
  ];

  const adminNavigationItem: NavigationItem = {
    icon: FiSettings, 
    label: 'Admin Dashboard',
    href: '/admin',
  };

  const NavLink: React.FC<{ item: NavigationItem }> = ({ item }) => {
    const isActive = location.pathname === item.href;
    const linkContent = (
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start gap-3 h-10',
          collapsed && 'px-2 justify-center',
          !isActive && 'hover:bg-muted/50'
        )}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
            {item.badge != null && item.badge > 0 && (
              <Badge variant="default" className="ml-auto h-5 px-2 text-xs">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Button>
    );

    return collapsed ? (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      linkContent
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-card border-r border-border h-screen flex flex-col fixed left-0 top-0 z-40"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3 h-16 shrink-0">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
          <FiFolder className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="overflow-hidden"
          >
            <h1 className="font-bold text-lg whitespace-nowrap">TaskFlow</h1>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationItems.map((item) => <NavLink key={item.href} item={item} />)}

        {isAdmin() && <NavLink item={adminNavigationItem} />}

        {/* Projects Section */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-3 px-2">
            {!collapsed && (
              <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Projects</h3>
            )}
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="ghost" className="w-7 h-7 p-0">
                    <FiPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>New Project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-1">
            {projects.map((project) => {
              const isSelected = selectedProject?.id === project.id;
              const projectContent = (
                <Button
                  key={project.id}
                  variant={isSelected ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 h-9',
                    collapsed && 'px-2 justify-center',
                    !isSelected && 'hover:bg-muted/50'
                  )}
                  onClick={() => setSelectedProject(project)}
                >
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  {!collapsed && (
                    <span className="flex-1 text-left truncate text-sm">{project.name}</span>
                  )}
                </Button>
              );

              return collapsed ? (
                <TooltipProvider key={project.id} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>{projectContent}</TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{project.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                projectContent
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <div className="p-4 border-t border-border flex items-center justify-center shrink-0 h-16">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-10 w-10 flex-shrink-0"
        >
          <FiChevronRight className={cn('h-5 w-5 transition-transform', !collapsed && 'rotate-180')} />
        </Button>
      </div>
    </motion.div>
  );
};