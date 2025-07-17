'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Badge,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Label as LabelIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { Task, KanbanColumn } from '../types';

interface KanbanViewProps {
  columns: KanbanColumn[];
  onTaskClick: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onMoveToStatus: (taskId: string, newStatus: Task['status']) => void;
}

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onMoveToStatus: (taskId: string, newStatus: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onTaskClick,
  onEditTask,
  onDeleteTask,
  onMoveToStatus,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEditTask(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDeleteTask(task);
    handleMenuClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    return <FlagIcon fontSize="small" color={getPriorityColor(priority)} />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else if (taskDate < today) {
      return `Overdue: ${date.toLocaleDateString()}`;
    }
    
    return date.toLocaleDateString();
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    return taskDate < today && (task.status === 'pending' || task.status === 'in-progress');
  };

  const statusOptions = ['pending', 'in-progress', 'completed', 'cancelled'];

  return (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        '&:hover': { boxShadow: 3 },
        transition: 'box-shadow 0.2s',
        border: isOverdue(task.dueDate) ? '1px solid #f44336' : 'none',
      }}
      onClick={() => onTaskClick(task)}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="subtitle2" fontWeight="bold">
            {task.title}
          </Typography>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {task.description && (
          <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
            {task.description}
          </Typography>
        )}

        <Box display="flex" alignItems="center" gap={0.5} mb={1}>
          {getPriorityIcon(task.priority)}
          <Chip
            label={task.priority}
            color={getPriorityColor(task.priority)}
            size="small"
            variant="outlined"
          />
        </Box>

        {task.assignedToName && (
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {task.assignedToName}
            </Typography>
          </Box>
        )}

        {task.dueDate && (
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            <ScheduleIcon fontSize="small" color={isOverdue(task.dueDate) ? 'error' : 'action'} />
            <Typography 
              variant="body2" 
              color={isOverdue(task.dueDate) ? 'error.main' : 'text.secondary'}
              fontWeight={isOverdue(task.dueDate) ? 'bold' : 'normal'}
            >
              {formatDate(task.dueDate)}
            </Typography>
          </Box>
        )}

        {task.tags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
            {task.tags.slice(0, 2).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            ))}
            {task.tags.length > 2 && (
              <Chip
                label={`+${task.tags.length - 2}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            )}
          </Box>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          {statusOptions
            .filter(status => status !== task.status)
            .map((status) => (
              <MenuItem 
                key={status}
                onClick={() => {
                  onMoveToStatus(task.id, status as Task['status']);
                  handleMenuClose();
                }}
              >
                Move to {status === 'pending' ? 'To Do' : 
                         status === 'in-progress' ? 'In Progress' : 
                         status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

const KanbanView: React.FC<KanbanViewProps> = ({
  columns,
  onTaskClick,
  onEditTask,
  onDeleteTask,
  onMoveToStatus,
}) => {
  return (
    <Box sx={{ overflowX: 'auto', pb: 2 }}>
      <Grid container spacing={2} sx={{ minWidth: 1000 }}>
        {columns.map((column) => (
          <Grid item xs={12} sm={6} md={3} key={column.id}>
            <Paper 
              sx={{ 
                p: 2, 
                bgcolor: column.color,
                minHeight: 600,
                maxHeight: 600,
                overflow: 'auto'
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  {column.title}
                </Typography>
                <Badge 
                  badgeContent={column.tasks.length} 
                  color={
                    column.status === 'pending' ? 'warning' :
                    column.status === 'in-progress' ? 'info' :
                    column.status === 'completed' ? 'success' :
                    'error'
                  }
                />
              </Box>
              
              <Box>
                {column.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onTaskClick={onTaskClick}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onMoveToStatus={onMoveToStatus}
                  />
                ))}
                
                {column.tasks.length === 0 && (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 4,
                      color: 'text.secondary'
                    }}
                  >
                    <Typography variant="body2">
                      No tasks in this column
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KanbanView;