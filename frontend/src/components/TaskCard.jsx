import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Collapse,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  AccessTime,
  Person,
  PriorityHigh,
  CheckCircle,
  RadioButtonUnchecked,
  Schedule,
} from '@mui/icons-material';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(task);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    onDelete(task.id);
    setDeleteDialogOpen(false);
  };

  const handleStatusToggle = () => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    onStatusChange(task.id, newStatus);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1:
        return 'Low';
      case 2:
        return 'Medium';
      case 3:
        return 'High';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'todo':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'todo':
        return 'To Do';
      default:
        return 'Unknown';
    }
  };

  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'completed';
  const dueDate = new Date(task.due_date);
  const now = new Date();
  const timeDiff = dueDate - now;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return (
    <>
      <Card
        sx={{
          mb: 2,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
          },
          opacity: task.status === 'completed' ? 0.8 : 1,
          borderLeft: isOverdue ? '4px solid #f44336' : 'none',
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <IconButton
                size="small"
                onClick={handleStatusToggle}
                color={task.status === 'completed' ? 'success' : 'default'}
              >
                {task.status === 'completed' ? <CheckCircle /> : <RadioButtonUnchecked />}
              </IconButton>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  flex: 1,
                }}
              >
                {task.title}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={getPriorityLabel(task.priority)}
                color={getPriorityColor(task.priority)}
                size="small"
                icon={<PriorityHigh />}
              />
              <Chip
                label={getStatusLabel(task.status)}
                color={getStatusColor(task.status)}
                size="small"
                variant="outlined"
              />
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
            </Box>
          </Box>

          {task.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: expanded ? 'none' : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {task.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isOverdue ? (
                <Schedule color="error" fontSize="small" />
              ) : (
                <AccessTime fontSize="small" />
              )}
              <Typography
                variant="caption"
                color={isOverdue ? 'error' : 'text.secondary'}
                sx={{ fontWeight: isOverdue ? 'bold' : 'normal' }}
              >
                {isOverdue ? 'Overdue: ' : 'Due: '}
                {dueDate.toLocaleDateString()}{' '}
                {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>

            {daysDiff >= 0 && daysDiff <= 7 && task.status !== 'completed' && (
              <Chip
                label={daysDiff === 0 ? 'Due Today' : `${daysDiff} days left`}
                color={daysDiff <= 1 ? 'error' : daysDiff <= 3 ? 'warning' : 'info'}
                size="small"
                variant="outlined"
              />
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Person fontSize="small" />
              <Typography variant="caption" color="text.secondary">
                {task.assigned_to_username}
              </Typography>
            </Box>
          </Box>

          {task.description && task.description.length > 100 && (
            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                onClick={() => setExpanded(!expanded)}
                endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              >
                {expanded ? 'Show Less' : 'Show More'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{task.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
