'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  Label as LabelIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { Task } from '../types';

interface TaskDetailProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({
  open,
  onClose,
  task,
  onEdit,
  onDelete,
}) => {
  if (!task) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in-progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    return taskDate < today && (task.status === 'pending' || task.status === 'in-progress');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Task Details</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <Typography variant="h5" gutterBottom>
            {task.title}
          </Typography>
          <Box display="flex" gap={1} mb={2}>
            <Chip
              label={getStatusLabel(task.status)}
              color={getStatusColor(task.status)}
            />
            <Chip
              label={task.priority}
              color={getPriorityColor(task.priority)}
              icon={<FlagIcon />}
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {task.description || 'No description provided.'}
            </Typography>

            {task.tags.length > 0 && (
              <Box mb={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Tags
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {task.tags.map(tag => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}

            {task.relatedTo && (
              <Box mb={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Related To
                </Typography>
                <Chip
                  icon={<LinkIcon />}
                  label={`${task.relatedTo.type.charAt(0).toUpperCase() + task.relatedTo.type.slice(1)}: ${task.relatedTo.name}`}
                  variant="outlined"
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Box bgcolor="background.paper" p={2} borderRadius={1} boxShadow={1}>
              <Typography variant="subtitle2" gutterBottom>
                Assignment
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <PersonIcon color="action" />
                <Typography variant="body2">
                  {task.assignedToName || 'Unassigned'}
                </Typography>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Due Date
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <ScheduleIcon color={isOverdue(task.dueDate) ? 'error' : 'action'} />
                <Typography 
                  variant="body2" 
                  color={isOverdue(task.dueDate) ? 'error.main' : 'text.primary'}
                >
                  {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                  {isOverdue(task.dueDate) && ' (Overdue)'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Created By
              </Typography>
              <Typography variant="body2" mb={1}>
                {task.assignedByName}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                {formatDateTime(task.createdAt)}
              </Typography>

              {task.status === 'completed' && task.completedAt && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Completed On
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTime(task.completedAt)}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button 
          startIcon={<DeleteIcon />} 
          color="error" 
          onClick={() => {
            onDelete(task);
            onClose();
          }}
        >
          Delete
        </Button>
        <Button 
          startIcon={<EditIcon />} 
          variant="contained" 
          onClick={() => {
            onEdit(task);
            onClose();
          }}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetail;