'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  ViewList as ListViewIcon,
  ViewModule as KanbanViewIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import TaskForm from '@/modules/tasks/components/TaskForm';
import TaskFilters from '@/modules/tasks/components/TaskFilters';
import KanbanView from '@/modules/tasks/components/KanbanView';
import TaskDetail from '@/modules/tasks/components/TaskDetail';
import { useTaskStore } from '@/modules/tasks/store/taskStore';
import { Task, TaskFormData } from '@/modules/tasks/types';
import { DataTableColumn } from '@/types';

const TasksPage: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    tasks,
    loading,
    error,
    filters,
    staff,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    clearError,
    fetchStaff,
    getKanbanColumns,
    moveTaskToStatus,
  } = useTaskStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);
  const [viewMode, setViewMode] = React.useState<'list' | 'kanban'>('list');
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  React.useEffect(() => {
    fetchTasks();
    fetchStaff();
  }, [fetchTasks, fetchStaff, filters]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      await createTask(data);
      enqueueSnackbar('Task created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create task', { variant: 'error' });
      throw error;
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    
    try {
      await updateTask(editingTask.id, data);
      enqueueSnackbar('Task updated successfully', { variant: 'success' });
      setEditingTask(null);
    } catch (error) {
      enqueueSnackbar('Failed to update task', { variant: 'error' });
      throw error;
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTask(taskToDelete.id);
      enqueueSnackbar('Task deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete task', { variant: 'error' });
    }
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  const handleEditTask = (task: Task) => {
    const formData: TaskFormData = {
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo || '',
      dueDate: task.dueDate || '',
      tags: task.tags,
      relatedToType: task.relatedTo?.type,
      relatedToId: task.relatedTo?.id,
    };
    setEditingTask(task);
    setFormOpen(true);
  };

  const openDeleteDialog = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      assignedTo: 'all',
      tags: [],
      dateRange: {},
    });
  };

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newMode: 'list' | 'kanban') => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleMoveToStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      await moveTaskToStatus(taskId, newStatus);
      enqueueSnackbar('Task status updated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update task status', { variant: 'error' });
    }
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
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    return taskDate < today;
  };

  const columns: DataTableColumn[] = [
    {
      id: 'title',
      label: 'Task',
      minWidth: 250,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="medium">
            {value}
          </Typography>
          {row.description && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {row.description.length > 60 
                ? `${row.description.substring(0, 60)}...` 
                : row.description}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Chip
          label={getStatusLabel(value)}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'priority',
      label: 'Priority',
      minWidth: 100,
      sortable: true,
      format: (value) => (
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={getPriorityColor(value)}
          size="small"
          icon={<FlagIcon />}
        />
      ),
    },
    {
      id: 'assignedToName',
      label: 'Assigned To',
      minWidth: 150,
      format: (value, row) => (
        value ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 24, height: 24 }}>
              {value.charAt(0)}
            </Avatar>
            <Typography variant="body2">{value}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">Unassigned</Typography>
        )
      ),
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      minWidth: 120,
      sortable: true,
      format: (value, row) => (
        value ? (
          <Typography 
            variant="body2" 
            color={isOverdue(value) && row.status !== 'completed' ? 'error.main' : 'text.primary'}
            fontWeight={isOverdue(value) && row.status !== 'completed' ? 'bold' : 'normal'}
          >
            {formatDate(value)}
            {isOverdue(value) && row.status !== 'completed' && ' (Overdue)'}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">-</Typography>
        )
      ),
    },
    {
      id: 'tags',
      label: 'Tags',
      minWidth: 150,
      format: (value) => (
        <Box display="flex" flexWrap="wrap" gap={0.5}>
          {value.slice(0, 2).map((tag: string) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
          {value.length > 2 && (
            <Chip label={`+${value.length - 2}`} size="small" variant="outlined" />
          )}
        </Box>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 120,
      align: 'center',
      format: (value, row) => (
        <Box>
          <IconButton size="small" onClick={(e) => {
            e.stopPropagation();
            handleViewTask(row);
          }}>
            <ViewIcon />
          </IconButton>
          <IconButton size="small" onClick={(e) => {
            e.stopPropagation();
            handleEditTask(row);
          }}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" color="error" onClick={(e) => {
            e.stopPropagation();
            openDeleteDialog(row);
          }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading && tasks.length === 0) {
    return <LoadingSpinner fullScreen message="Loading tasks..." />;
  }

  // Calculate task statistics
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const overdueTasks = tasks.filter(t => 
    t.dueDate && 
    new Date(t.dueDate) < today && 
    (t.status === 'pending' || t.status === 'in-progress')
  ).length;

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff', 'technician']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Task Management
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
            >
              <ToggleButton value="list">
                <ListViewIcon />
              </ToggleButton>
              <ToggleButton value="kanban">
                <KanbanViewIcon />
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setFormOpen(true)}
            >
              Add Task
            </Button>
          </Box>
        </Box>

        {/* Task Statistics */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  {totalTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" color="warning.main">
                  {pendingTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  To Do
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" color="info.main">
                  {inProgressTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {completedTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" color="error.main">
                  {overdueTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overdue
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <TaskFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          staff={staff}
        />

        {viewMode === 'list' ? (
          <Card>
            <CardContent sx={{ p: 0 }}>
              <DataTable
                columns={columns}
                data={tasks}
                loading={loading}
                onRowClick={handleViewTask}
                searchable={false} // We have custom filters
                pageable={true}
                pageSize={10}
              />
            </CardContent>
          </Card>
        ) : (
          <KanbanView
            columns={getKanbanColumns()}
            onTaskClick={handleViewTask}
            onEditTask={handleEditTask}
            onDeleteTask={openDeleteDialog}
            onMoveToStatus={handleMoveToStatus}
          />
        )}

        <TaskForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialData={editingTask ? {
            title: editingTask.title,
            description: editingTask.description || '',
            status: editingTask.status,
            priority: editingTask.priority,
            assignedTo: editingTask.assignedTo || '',
            dueDate: editingTask.dueDate || '',
            tags: editingTask.tags,
            relatedToType: editingTask.relatedTo?.type,
            relatedToId: editingTask.relatedTo?.id,
          } : undefined}
          loading={loading}
          staff={staff}
        />

        <TaskDetail
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          task={selectedTask}
          onEdit={handleEditTask}
          onDelete={openDeleteDialog}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Task"
          message={`Are you sure you want to delete the task "${taskToDelete?.title}"? This action cannot be undone.`}
          onConfirm={handleDeleteTask}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setTaskToDelete(null);
          }}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default TasksPage;