import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from '@mui/material';
import { Search, FilterList, Sort, ViewList, ViewModule } from '@mui/icons-material';

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
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 200, flex: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Priority"
            onChange={(e) => onPriorityFilterChange(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="3">High</MenuItem>
            <MenuItem value="2">Medium</MenuItem>
            <MenuItem value="1">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => onSortChange(e.target.value)}
            startAdornment={<Sort sx={{ mr: 1 }} />}
          >
            <MenuItem value="due_date">Due Date</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="created_at">Created</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => newMode && onViewModeChange(newMode)}
          size="small"
        >
          <ToggleButton value="list" aria-label="list view">
            <ViewList />
          </ToggleButton>
          <ToggleButton value="grid" aria-label="grid view">
            <ViewModule />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {statusFilter !== 'all' && (
          <Chip
            label={`Status: ${statusFilter.replace('_', ' ')}`}
            onDelete={() => onStatusFilterChange('all')}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
        {priorityFilter !== 'all' && (
          <Chip
            label={`Priority: ${priorityFilter === '3' ? 'High' : priorityFilter === '2' ? 'Medium' : 'Low'}`}
            onDelete={() => onPriorityFilterChange('all')}
            size="small"
            color="secondary"
            variant="outlined"
          />
        )}
        {searchTerm && (
          <Chip
            label={`Search: "${searchTerm}"`}
            onDelete={() => onSearchChange('')}
            size="small"
            color="info"
            variant="outlined"
          />
        )}
      </Box>
    </Paper>
  );
}
