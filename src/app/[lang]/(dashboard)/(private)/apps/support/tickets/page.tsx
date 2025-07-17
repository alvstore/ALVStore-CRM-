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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import TicketForm from '@/modules/support/components/TicketForm';
import TicketFilters from '@/modules/support/components/TicketFilters';
import { useTicketStore } from '@/modules/support/store/ticketStore';
import { useClientStore } from '@/modules/clients/store/clientStore';
import { SupportTicket, SupportTicketFormData } from '@/modules/support/types';
import { DataTableColumn } from '@/types';

const TicketsPage: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    tickets,
    loading,
    error,
    filters,
    categories,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    setFilters,
    clearError,
    fetchCategories,
  } = useTicketStore();

  const {
    clients,
    fetchClients,
  } = useClientStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingTicket, setEditingTicket] = React.useState<SupportTicket | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [ticketToDelete, setTicketToDelete] = React.useState<SupportTicket | null>(null);

  // Mock staff data - in a real app, this would come from a staff/users store
  const staff = [
    { id: '1', name: 'John Admin', role: 'admin' },
    { id: '2', name: 'Jane Staff', role: 'staff' },
    { id: '3', name: 'Mike Technician', role: 'technician' },
  ];

  React.useEffect(() => {
    fetchTickets();
    fetchClients();
    fetchCategories();
  }, [fetchTickets, fetchClients, fetchCategories, filters]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreateTicket = async (data: SupportTicketFormData) => {
    try {
      const client = clients.find(c => c.id === data.clientId);
      if (!client) {
        throw new Error('Client not found');
      }
      
      const ticketData = {
        ...data,
        clientName: client.name,
        clientEmail: client.email,
        createdBy: client.id, // In a real app, this would be the current user's ID
      };
      
      await createTicket(ticketData);
      enqueueSnackbar('Ticket created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create ticket', { variant: 'error' });
      throw error;
    }
  };

  const handleUpdateTicket = async (data: SupportTicketFormData) => {
    if (!editingTicket) return;
    
    try {
      await updateTicket(editingTicket.id, data);
      enqueueSnackbar('Ticket updated successfully', { variant: 'success' });
      setEditingTicket(null);
    } catch (error) {
      enqueueSnackbar('Failed to update ticket', { variant: 'error' });
      throw error;
    }
  };

  const handleDeleteTicket = async () => {
    if (!ticketToDelete) return;
    
    try {
      await deleteTicket(ticketToDelete.id);
      enqueueSnackbar('Ticket deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete ticket', { variant: 'error' });
    }
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    router.push(`/support/tickets/${ticket.id}`);
  };

  const handleEditTicket = (ticket: SupportTicket) => {
    setEditingTicket(ticket);
    setFormOpen(true);
  };

  const openDeleteDialog = (ticket: SupportTicket) => {
    setTicketToDelete(ticket);
    setDeleteDialogOpen(true);
  };

  const handleFiltersChange = (newFilters: Partial<any>) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      assignedTo: 'all',
      category: 'all',
      clientId: 'all',
      dateRange: {},
    });
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
    return new Date(dateString).toLocaleDateString();
  };

  const columns: DataTableColumn[] = [
    {
      id: 'id',
      label: 'Ticket ID',
      minWidth: 100,
      format: (value) => `#${value}`,
    },
    {
      id: 'subject',
      label: 'Subject',
      minWidth: 200,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="medium">
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.category}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'clientName',
      label: 'Client',
      minWidth: 150,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="body2">{value}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.clientEmail}
          </Typography>
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
          label={value.replace('_', ' ').toUpperCase()}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'priority',
      label: 'Priority',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Chip
          label={value.toUpperCase()}
          color={getPriorityColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'assignedToName',
      label: 'Assigned To',
      minWidth: 150,
      format: (value) => value || 'Unassigned',
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 120,
      sortable: true,
      format: (value) => formatDate(value),
    },
  ];

  if (loading && tickets.length === 0) {
    return <LoadingSpinner fullScreen message="Loading tickets..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff', 'technician']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Support Tickets
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Create Ticket
          </Button>
        </Box>

        <TicketFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          categories={categories}
          clients={clients}
          staff={staff}
        />

        <Card>
          <CardContent sx={{ p: 0 }}>
            <DataTable
              columns={columns}
              data={tickets}
              loading={loading}
              onRowClick={handleViewTicket}
              onEdit={handleEditTicket}
              onDelete={openDeleteDialog}
              searchable={false} // We have custom filters
              pageable={true}
              pageSize={10}
            />
          </CardContent>
        </Card>

        <TicketForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingTicket(null);
          }}
          onSubmit={editingTicket ? handleUpdateTicket : handleCreateTicket}
          initialData={editingTicket ? {
            clientId: editingTicket.clientId,
            subject: editingTicket.subject,
            description: editingTicket.description,
            status: editingTicket.status,
            priority: editingTicket.priority,
            assignedTo: editingTicket.assignedTo,
            category: editingTicket.category,
          } : undefined}
          loading={loading}
          clients={clients}
          staff={staff}
          categories={categories}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Ticket"
          message={`Are you sure you want to delete ticket #${ticketToDelete?.id}? This action cannot be undone and will remove all associated comments and history.`}
          onConfirm={handleDeleteTicket}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setTicketToDelete(null);
          }}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default TicketsPage;