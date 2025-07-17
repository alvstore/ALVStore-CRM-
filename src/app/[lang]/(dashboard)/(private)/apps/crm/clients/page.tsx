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
import ClientForm from '@/modules/clients/components/ClientForm';
import ClientFilters from '@/modules/clients/components/ClientFilters';
import { useClientStore } from '@/modules/clients/store/clientStore';
import { Client, ClientFormData } from '@/modules/clients/types';
import { DataTableColumn } from '@/types';

const ClientsPage: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    clients,
    loading,
    error,
    filters,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    setFilters,
    clearError,
  } = useClientStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [clientToDelete, setClientToDelete] = React.useState<Client | null>(null);

  React.useEffect(() => {
    fetchClients();
  }, [fetchClients, filters]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreateClient = async (data: ClientFormData) => {
    try {
      const clientData = {
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        notes: data.notes,
        status: data.status,
        tags: data.tags,
      };
      await createClient(clientData);
      enqueueSnackbar('Client created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create client', { variant: 'error' });
      throw error;
    }
  };

  const handleUpdateClient = async (data: ClientFormData) => {
    if (!editingClient) return;
    
    try {
      const clientData = {
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        notes: data.notes,
        status: data.status,
        tags: data.tags,
      };
      await updateClient(editingClient.id, clientData);
      enqueueSnackbar('Client updated successfully', { variant: 'success' });
      setEditingClient(null);
    } catch (error) {
      enqueueSnackbar('Failed to update client', { variant: 'error' });
      throw error;
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    
    try {
      await deleteClient(clientToDelete.id);
      enqueueSnackbar('Client deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete client', { variant: 'error' });
    }
  };

  const handleViewClient = (client: Client) => {
    router.push(`/clients/${client.id}`);
  };

  const handleEditClient = (client: Client) => {
    const formData: ClientFormData = {
      name: client.name,
      company: client.company || '',
      email: client.email,
      phone: client.phone,
      street: client.address.street,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
      country: client.address.country,
      notes: client.notes || '',
      status: client.status,
      tags: client.tags,
    };
    setEditingClient(client);
    setFormOpen(true);
  };

  const openDeleteDialog = (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      tags: [],
      dateRange: {},
    });
  };

  const columns: DataTableColumn[] = [
    {
      id: 'avatar',
      label: '',
      minWidth: 60,
      format: (value, row) => (
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {row.name.charAt(0)}
        </Avatar>
      ),
    },
    {
      id: 'name',
      label: 'Name',
      minWidth: 200,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="medium">
            {row.name}
          </Typography>
          {row.company && (
            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
              <BusinessIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {row.company}
              </Typography>
            </Box>
          )}
        </Box>
      ),
    },
    {
      id: 'contact',
      label: 'Contact',
      minWidth: 200,
      format: (value, row) => (
        <Box>
          <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2">{row.email}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2">{row.phone}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      sortable: true,
      format: (value) => {
        const colors = {
          active: 'success',
          inactive: 'default',
          lead: 'warning',
        } as const;
        return (
          <Chip
            label={value.charAt(0).toUpperCase() + value.slice(1)}
            color={colors[value as keyof typeof colors]}
            size="small"
          />
        );
      },
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
      id: 'totalValue',
      label: 'Total Value',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value) => `$${value.toLocaleString()}`,
    },
    {
      id: 'totalOrders',
      label: 'Orders',
      minWidth: 80,
      align: 'center',
      sortable: true,
    },
  ];

  if (loading && clients.length === 0) {
    return <LoadingSpinner fullScreen message="Loading clients..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Clients
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Add Client
          </Button>
        </Box>

        <ClientFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        <Card>
          <CardContent sx={{ p: 0 }}>
            <DataTable
              columns={columns}
              data={clients}
              loading={loading}
              onRowClick={handleViewClient}
              onEdit={handleEditClient}
              onDelete={openDeleteDialog}
              searchable={false} // We have custom filters
              pageable={true}
              pageSize={10}
            />
          </CardContent>
        </Card>

        <ClientForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingClient(null);
          }}
          onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
          initialData={editingClient ? {
            name: editingClient.name,
            company: editingClient.company || '',
            email: editingClient.email,
            phone: editingClient.phone,
            street: editingClient.address.street,
            city: editingClient.address.city,
            state: editingClient.address.state,
            zipCode: editingClient.address.zipCode,
            country: editingClient.address.country,
            notes: editingClient.notes || '',
            status: editingClient.status,
            tags: editingClient.tags,
          } : undefined}
          loading={loading}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Client"
          message={`Are you sure you want to delete ${clientToDelete?.name}? This action cannot be undone and will remove all associated data.`}
          onConfirm={handleDeleteClient}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setClientToDelete(null);
          }}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default ClientsPage;