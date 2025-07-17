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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  ViewList as ListViewIcon,
  ViewModule as KanbanViewIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import LeadForm from '@/modules/leads/components/LeadForm';
import LeadFilters from '@/modules/leads/components/LeadFilters';
import KanbanView from '@/modules/leads/components/KanbanView';
import { useLeadStore } from '@/modules/leads/store/leadStore';
import { Lead, LeadFormData } from '@/modules/leads/types';
import { DataTableColumn } from '@/types';

const LeadsPage: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    leads,
    loading,
    error,
    filters,
    staff,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
    convertToClient,
    setFilters,
    clearError,
    fetchStaff,
    getKanbanColumns,
    moveLeadToStatus,
  } = useLeadStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingLead, setEditingLead] = React.useState<Lead | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [leadToDelete, setLeadToDelete] = React.useState<Lead | null>(null);
  const [convertDialogOpen, setConvertDialogOpen] = React.useState(false);
  const [leadToConvert, setLeadToConvert] = React.useState<Lead | null>(null);
  const [viewMode, setViewMode] = React.useState<'list' | 'kanban'>('list');

  React.useEffect(() => {
    fetchLeads();
    fetchStaff();
  }, [fetchLeads, fetchStaff, filters]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreateLead = async (data: LeadFormData) => {
    try {
      const leadData = {
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        source: data.source,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
        estimatedValue: data.estimatedValue,
        expectedCloseDate: data.expectedCloseDate,
        notes: data.notes,
        tags: data.tags,
        nextFollowUpDate: data.nextFollowUpDate,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
      };
      await createLead(leadData);
      enqueueSnackbar('Lead created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create lead', { variant: 'error' });
      throw error;
    }
  };

  const handleUpdateLead = async (data: LeadFormData) => {
    if (!editingLead) return;
    
    try {
      const leadData = {
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        source: data.source,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
        estimatedValue: data.estimatedValue,
        expectedCloseDate: data.expectedCloseDate,
        notes: data.notes,
        tags: data.tags,
        nextFollowUpDate: data.nextFollowUpDate,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
      };
      await updateLead(editingLead.id, leadData);
      enqueueSnackbar('Lead updated successfully', { variant: 'success' });
      setEditingLead(null);
    } catch (error) {
      enqueueSnackbar('Failed to update lead', { variant: 'error' });
      throw error;
    }
  };

  const handleDeleteLead = async () => {
    if (!leadToDelete) return;
    
    try {
      await deleteLead(leadToDelete.id);
      enqueueSnackbar('Lead deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete lead', { variant: 'error' });
    }
  };

  const handleConvertToClient = async () => {
    if (!leadToConvert) return;
    
    try {
      const result = await convertToClient(leadToConvert.id);
      enqueueSnackbar('Lead converted to client successfully', { variant: 'success' });
      setConvertDialogOpen(false);
      setLeadToConvert(null);
      // Optionally redirect to the new client
      // router.push(`/clients/${result.clientId}`);
    } catch (error) {
      enqueueSnackbar('Failed to convert lead', { variant: 'error' });
    }
  };

  const handleViewLead = (lead: Lead) => {
    router.push(`/leads/${lead.id}`);
  };

  const handleEditLead = (lead: Lead) => {
    const formData: LeadFormData = {
      name: lead.name,
      company: lead.company || '',
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      priority: lead.priority,
      assignedTo: lead.assignedTo || '',
      estimatedValue: lead.estimatedValue,
      expectedCloseDate: lead.expectedCloseDate || '',
      notes: lead.notes || '',
      tags: lead.tags,
      street: lead.address?.street || '',
      city: lead.address?.city || '',
      state: lead.address?.state || '',
      zipCode: lead.address?.zipCode || '',
      country: lead.address?.country || 'USA',
      nextFollowUpDate: lead.nextFollowUpDate || '',
    };
    setEditingLead(lead);
    setFormOpen(true);
  };

  const openDeleteDialog = (lead: Lead) => {
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  const openConvertDialog = (lead: Lead) => {
    setLeadToConvert(lead);
    setConvertDialogOpen(true);
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
      source: 'all',
      tags: [],
      dateRange: {},
    });
  };

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newMode: 'list' | 'kanban') => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleMoveToStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      await moveLeadToStatus(leadId, newStatus);
      enqueueSnackbar('Lead status updated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update lead status', { variant: 'error' });
    }
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
      minWidth: 120,
      sortable: true,
      format: (value) => {
        const colors = {
          new: 'info',
          contacted: 'primary',
          qualified: 'success',
          proposal: 'warning',
          negotiation: 'secondary',
          won: 'success',
          lost: 'error',
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
      id: 'priority',
      label: 'Priority',
      minWidth: 100,
      sortable: true,
      format: (value) => {
        const colors = {
          high: 'error',
          medium: 'warning',
          low: 'success',
        } as const;
        return (
          <Chip
            label={value.charAt(0).toUpperCase() + value.slice(1)}
            color={colors[value as keyof typeof colors]}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      id: 'assignedToName',
      label: 'Assigned To',
      minWidth: 150,
      format: (value) => value || 'Unassigned',
    },
    {
      id: 'estimatedValue',
      label: 'Est. Value',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value) => value ? `$${value.toLocaleString()}` : '-',
    },
    {
      id: 'source',
      label: 'Source',
      minWidth: 100,
      format: (value) => (
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          size="small"
          variant="outlined"
        />
      ),
    },
  ];

  if (loading && leads.length === 0) {
    return <LoadingSpinner fullScreen message="Loading leads..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Leads
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
              Add Lead
            </Button>
          </Box>
        </Box>

        <LeadFilters
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
                data={leads}
                loading={loading}
                onRowClick={handleViewLead}
                onEdit={handleEditLead}
                onDelete={openDeleteDialog}
                searchable={false} // We have custom filters
                pageable={true}
                pageSize={10}
              />
            </CardContent>
          </Card>
        ) : (
          <KanbanView
            columns={getKanbanColumns()}
            onLeadClick={handleViewLead}
            onEditLead={handleEditLead}
            onDeleteLead={openDeleteDialog}
            onConvertToClient={openConvertDialog}
            onMoveToStatus={handleMoveToStatus}
          />
        )}

        <LeadForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingLead(null);
          }}
          onSubmit={editingLead ? handleUpdateLead : handleCreateLead}
          initialData={editingLead ? {
            name: editingLead.name,
            company: editingLead.company || '',
            email: editingLead.email,
            phone: editingLead.phone,
            source: editingLead.source,
            status: editingLead.status,
            priority: editingLead.priority,
            assignedTo: editingLead.assignedTo || '',
            estimatedValue: editingLead.estimatedValue,
            expectedCloseDate: editingLead.expectedCloseDate || '',
            notes: editingLead.notes || '',
            tags: editingLead.tags,
            street: editingLead.address?.street || '',
            city: editingLead.address?.city || '',
            state: editingLead.address?.state || '',
            zipCode: editingLead.address?.zipCode || '',
            country: editingLead.address?.country || 'USA',
            nextFollowUpDate: editingLead.nextFollowUpDate || '',
          } : undefined}
          loading={loading}
          staff={staff}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Lead"
          message={`Are you sure you want to delete ${leadToDelete?.name}? This action cannot be undone.`}
          onConfirm={handleDeleteLead}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setLeadToDelete(null);
          }}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />

        <ConfirmationDialog
          open={convertDialogOpen}
          title="Convert Lead to Client"
          message={`Are you sure you want to convert ${leadToConvert?.name} to a client? This will create a new client record and mark the lead as won.`}
          onConfirm={handleConvertToClient}
          onCancel={() => {
            setConvertDialogOpen(false);
            setLeadToConvert(null);
          }}
          severity="info"
          confirmText="Convert"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default LeadsPage;