import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiCalendar, FiUser, FiTag } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useProject } from '@/contexts/ProjectContext';

export interface FilterOptions {
  status: string[];
  priority: string[];
  assignee: string[];
  dateRange: string;
  tags: string[];
  project: string[]; // Add project filter
}

interface DashboardFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
}) => {
  const { projects } = useProject();
  const statusOptions = ['todo', 'in-progress', 'completed', 'on-hold'];
  const priorityOptions = ['low', 'medium', 'high', 'urgent'];
  const assigneeOptions = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'];
  const tagOptions = ['frontend', 'backend', 'design', 'bug', 'feature', 'urgent'];
  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'all', label: 'All Time' }
  ];

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'status' | 'priority' | 'assignee' | 'tags', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: [],
      priority: [],
      assignee: [],
      dateRange: 'all',
      tags: [],
      project: []
    });
  };

  const getActiveFilterCount = () => {
    return filters.status.length + 
           filters.priority.length + 
           filters.assignee.length + 
           filters.tags.length + 
           (filters.dateRange !== 'all' ? 1 : 0);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="flex items-center gap-2"
      >
        <FiFilter className="w-4 h-4" />
        <span className="hidden sm:inline">Filters</span>
        {getActiveFilterCount() > 0 && (
          <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
            {getActiveFilterCount()}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 z-50"
          >
            <Card className="w-80 shadow-lg border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Filters</CardTitle>
                  <div className="flex items-center gap-2">
                    {getActiveFilterCount() > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-xs h-6 px-2"
                      >
                        Clear all
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggle}
                      className="h-6 w-6 p-0"
                    >
                      <FiX className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    Date Range
                  </label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) => updateFilter('dateRange', value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRangeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className="space-y-1">
                    {statusOptions.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={filters.status.includes(status)}
                          onCheckedChange={() => toggleArrayFilter('status', status)}
                        />
                        <label
                          htmlFor={`status-${status}`}
                          className="text-sm capitalize cursor-pointer"
                        >
                          {status.replace('-', ' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <div className="space-y-1">
                    {priorityOptions.map((priority) => (
                      <div key={priority} className="flex items-center space-x-2">
                        <Checkbox
                          id={`priority-${priority}`}
                          checked={filters.priority.includes(priority)}
                          onCheckedChange={() => toggleArrayFilter('priority', priority)}
                        />
                        <label
                          htmlFor={`priority-${priority}`}
                          className="text-sm capitalize cursor-pointer"
                        >
                          {priority}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignee */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Assignee
                  </label>
                  <div className="space-y-1">
                    {assigneeOptions.map((assignee) => (
                      <div key={assignee} className="flex items-center space-x-2">
                        <Checkbox
                          id={`assignee-${assignee}`}
                          checked={filters.assignee.includes(assignee)}
                          onCheckedChange={() => toggleArrayFilter('assignee', assignee)}
                        />
                        <label
                          htmlFor={`assignee-${assignee}`}
                          className="text-sm cursor-pointer"
                        >
                          {assignee}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FiTag className="w-4 h-4" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {tagOptions.map((tag) => (
                      <Badge
                        key={tag}
                        variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer text-xs"
                        onClick={() => toggleArrayFilter('tags', tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FiTag className="w-4 h-4" />
                    Project
                  </label>
                  <Select
                    onValueChange={(value) => updateFilter('project', value ? [value] : [])}
                    value={filters.project.length > 0 ? filters.project[0] : ''}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Projects</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
