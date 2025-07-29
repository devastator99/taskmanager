import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ArrowUpDown, List, Grid } from 'lucide-react';

export default function TaskFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}) {
  return (
    <div className="bg-card text-card-foreground p-4 mb-6 rounded-lg shadow-sm">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 min-w-[200px]"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[120px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
          <SelectTrigger className="w-[120px]">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="3">High</SelectItem>
            <SelectItem value="2">Medium</SelectItem>
            <SelectItem value="1">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px]">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="due_date">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="created_at">Created</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>

        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(newMode) => newMode && onViewModeChange(newMode)}
          className="ml-auto"
        >
          <ToggleGroupItem value="list" aria-label="list view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="grid view">
            <Grid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilter !== 'all' && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Status: {statusFilter.replace('_', ' ')}
            <button
              onClick={() => onStatusFilterChange('all')}
              className="ml-1 text-xs opacity-50 hover:opacity-100"
            >
              &times;
            </button>
          </Badge>
        )}
        {priorityFilter !== 'all' && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Priority: {priorityFilter === '3' ? 'High' : priorityFilter === '2' ? 'Medium' : 'Low'}
            <button
              onClick={() => onPriorityFilterChange('all')}
              className="ml-1 text-xs opacity-50 hover:opacity-100"
            >
              &times;
            </button>
          </Badge>
        )}
        {searchTerm && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Search: &ldquo;{searchTerm}&rdquo;
            <button
              onClick={() => onSearchChange('')}
              className="ml-1 text-xs opacity-50 hover:opacity-100"
            >
              &times;
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
}
