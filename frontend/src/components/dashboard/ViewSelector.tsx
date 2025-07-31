import React from 'react';
import { motion } from 'framer-motion';
import { FiGrid, FiCalendar, FiList } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

export type ViewType = 'overview' | 'kanban' | 'list' | 'calendar';

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  currentView,
  onViewChange,
}) => {
  const views = [
    {
      id: 'overview' as ViewType,
      label: 'Overview',
      icon: FiGrid,
      description: 'List + summary overview'
    },
    {
      id: 'kanban' as ViewType,
      label: 'Kanban',
      icon: FiGrid,
      description: 'Kanban board'
    },
    {
      id: 'list' as ViewType,
      label: 'List',
      icon: FiList,
      description: 'List view'
    },
    {
      id: 'calendar' as ViewType,
      label: 'Calendar',
      icon: FiCalendar,
      description: 'Calendar view'
    },

  ];

  return (
    <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg">
      {views.map((view) => (
        <motion.div
          key={view.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant={currentView === view.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange(view.id)}
            className={`flex items-center gap-2 transition-all duration-200 ${
              currentView === view.id
                ? 'bg-background shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            <view.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{view.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
