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
  Grid,
  Paper,
  Divider,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import TicketForm from '@/modules/support/components/TicketForm';
import CommentList from '@/modules/support/components/CommentList';
import CommentForm from '@/modules/support/components/CommentForm';
import { useAppSelector } from '@/redux-store';
import { useTicketStore } from '@/modules/support/store/ticketStore';
import { useClientStore } from '@/modules/clients/store/clientStore';
import { SupportTicket, SupportTicketFormData, TicketCommentFormData } from '@/modules/support/types';

type RootState = {
  auth: {
    user: any; // Replace 'any' with your User type if available
  };
};

const TicketDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const user = useAppSelector((state: RootState) => state.auth.user);
  
  const {
    selectedTicket,
    ticketComments,
    categories,
    loading,
    error,
    fetchTicketById,
    updateTicket,
    deleteTicket,
    fetchTicketComments,
    addTicketComment,
    fetchCategories,
    clearError,
  } = useTicketStore();

  const {
    clients,
    fetchClients,
  } = useClientStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Mock staff data - in a real app, this would come from a staff/users store
  const staff = [
    { id: '1', name: 'John Admin', role: 'admin' },
    { id: '2', name: 'Jane Staff', role: 'staff' },
    { id: '3', name: 'Mike Technician', role: 'technician' },
  ];

  const ticketId = params.id as string;

  React.useEffect(() => {
    if (ticketId) {
      fetchTicketById(ticketId);
      fetchTicketComments(ticketId);
      fetchClients();
      fetchCategories();
    }
  }, [ticketId, fetchTicketById, fetchTicketComments, fetchClients, fetchCategories]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleUpdateTicket = async (data: SupportTicketFormData) => {
    if (!selectedTicket) return;
    
    try {
      await updateTicket(selectedTicket.id, data);
      enqueueSnackbar('Ticket updated successfully', { variant: 'success' });
      setFormOpen(false);
    } catch (error) {
      enqueueSnackbar('Failed to update ticket', { variant: 'error' });
      throw error;
    }
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicket) return;
    
    try {
      await deleteTicket(selectedTicket.id);
      enqueueSnackbar('Ticket deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      router.push('/support/tickets');
    } catch (error) {
      enqueueSnackbar('Failed to delete ticket', { variant: 'error' });
    }
  };

  const handleAddComment = async (data: TicketCommentFormData) => {
    if (!selectedTicket || !user) return;
    
    try {
      const commentData = {
        ...data,
        createdBy: user.id,
        createdByName: user.name,
        createdByRole: user.role,
      };
      
      await addTicketComment(selectedTicket.id, commentData);
      enqueueSnackbar('Comment added successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to add comment', { variant: 'error' });
      throw error;
    }
  };

  const handleStatusChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    if (!selectedTicket) return;
    
    try {
      await updateTicket(selectedTicket.id, { status: event.target.value as SupportTicket['status'] });
      enqueueSnackbar('Ticket status updated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update ticket status', { variant: 'error' });
    }
  };

  const handlePriorityChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    if (!selectedTicket) return;
    
    try {
      await updateTicket(selectedTicket.id, { priority: event.target.value as SupportTicket['priority'] });
      enqueueSnackbar('Ticket priority updated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update ticket priority', { variant: 'error' });
    }
  };

  const handleAssigneeChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    if (!selectedTicket) return;
    
    const assignedTo = event.target.value as string;
    const assignedToName = assignedTo ? 
      staff.find(s => s.id === assignedTo)?.name || 'Unknown' : 
      undefined;
    
    try {
      await updateTicket(selectedTicket.id, { 
        assignedTo: assignedTo || undefined,
        assignedToName: assignedToName,
      });
      enqueueSnackbar('Ticket assignee updated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update ticket assignee', { variant: 'error' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'info';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && !selectedTicket) {
    return <LoadingSpinner fullScreen message="Loading ticket details..." />;
  }

  if (!selectedTicket) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6" color="text.secondary">
          Ticket not found
        </Typography>
      </Box>
    );
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff', 'technician']}>
      <Box>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <IconButton onClick={() => router.back()}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }}>
            Ticket #{selectedTicket.id}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setFormOpen(true)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {/* Ticket Details */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {selectedTicket.subject}
                </Typography>
                
                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                  <Chip
                    label={selectedTicket.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(selectedTicket.status)}
                  />
                  <Chip
                    label={selectedTicket.priority.toUpperCase()}
                    color={getPriorityColor(selectedTicket.priority)}
                  />
                  <Chip
                    label={selectedTicket.category}
                    variant="outlined"
                  />
                </Box>
                
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description:
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedTicket.description}
                </Typography>
                
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Created: {formatDate(selectedTicket.createdAt)}
                  </Typography>
                </Box>
                
                {selectedTicket.resolvedAt && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Resolved: {formatDate(selectedTicket.resolvedAt)} by {selectedTicket.resolvedByName}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Comments */}
            <Typography variant="h6" gutterBottom>
              Comments & Activity
            </Typography>
            <CommentList comments={ticketComments} loading={loading} />
            <CommentForm onSubmit={handleAddComment} loading={loading} />
          </Grid>
          
          <Grid item xs={12} md={4}>
            {/* Client Information */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Client Information
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {selectedTicket.clientName.charAt(0)}
                  </Avatar>
                  <Typography variant="subtitle1">
                    {selectedTicket.clientName}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {selectedTicket.clientEmail}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Ticket Management */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ticket Management
                </Typography>
                
                <Box mb={2}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedTicket.status}
                      onChange={handleStatusChange}
                      label="Status"
                    >
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={selectedTicket.priority}
                      onChange={handlePriorityChange}
                      label="Priority"
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="urgent">Urgent</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth>
                    <InputLabel>Assigned To</InputLabel>
                    <Select
                      value={selectedTicket.assignedTo || ''}
                      onChange={handleAssigneeChange}
                      label="Assigned To"
                    >
                      <MenuItem value="">Unassigned</MenuItem>
                      {staff.map((member) => (
                        <MenuItem key={member.id} value={member.id}>
                          {member.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Ticket Information
                </Typography>
                
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <CategoryIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    Category: {selectedTicket.category}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <FlagIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    Created by: {selectedTicket.createdByName}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    Assigned to: {selectedTicket.assignedToName || 'Unassigned'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <TicketForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleUpdateTicket}
          initialData={{
            clientId: selectedTicket.clientId,
            subject: selectedTicket.subject,
            description: selectedTicket.description,
            status: selectedTicket.status,
            priority: selectedTicket.priority,
            assignedTo: selectedTicket.assignedTo,
            category: selectedTicket.category,
          }}
          loading={loading}
          clients={clients}
          staff={staff}
          categories={categories}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Ticket"
          message={`Are you sure you want to delete ticket #${selectedTicket.id}? This action cannot be undone and will remove all associated comments and history.`}
          onConfirm={handleDeleteTicket}
          onCancel={() => setDeleteDialogOpen(false)}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default TicketDetailPage;