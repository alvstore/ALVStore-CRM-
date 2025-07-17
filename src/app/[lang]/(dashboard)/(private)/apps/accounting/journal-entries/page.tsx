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
  Menu,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as PostIcon,
  Undo as ReverseIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import JournalEntryForm from '@/modules/accounting/components/JournalEntryForm';
import JournalEntryFilters from '@/modules/accounting/components/JournalEntryFilters';
import { useAccountingStore } from '@/modules/accounting/hooks/useAccountingStore';
import { JournalEntry, JournalEntryFormData } from '@/modules/accounting/types';
import { DataTableColumn } from '@/types';

const JournalEntriesPage: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    journalEntries,
    chartOfAccounts,
    loading,
    error,
    filters,
    fetchJournalEntries,
    fetchChartOfAccounts,
    createJournalEntry,
    postJournalEntry,
    deleteJournalEntry,
    setFilters,
    clearError,
  } = useAccountingStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState<JournalEntry | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [entryToDelete, setEntryToDelete] = React.useState<JournalEntry | null>(null);
  const [postDialogOpen, setPostDialogOpen] = React.useState(false);
  const [entryToPost, setEntryToPost] = React.useState<JournalEntry | null>(null);
  const [menuAnchor, setMenuAnchor] = React.useState<{ [key: string]: HTMLElement | null }>({});

  React.useEffect(() => {
    fetchJournalEntries();
    fetchChartOfAccounts();
  }, [fetchJournalEntries, fetchChartOfAccounts, filters]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreateEntry = async (data: JournalEntryFormData) => {
    try {
      // Enrich the data with account details
      const enrichedEntries = data.entries.map(entry => {
        const account = chartOfAccounts.find(acc => acc.id === entry.accountId);
        return {
          ...entry,
          accountCode: account?.code || '',
          accountName: account?.name || '',
        };
      });
      
      await createJournalEntry({
        ...data,
        entries: enrichedEntries,
        status: 'draft',
      });
      enqueueSnackbar('Journal entry created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create journal entry', { variant: 'error' });
      throw error;
    }
  };

  const handlePostEntry = async () => {
    if (!entryToPost) return;
    
    try {
      await postJournalEntry(entryToPost.id);
      enqueueSnackbar('Journal entry posted successfully', { variant: 'success' });
      setPostDialogOpen(false);
      setEntryToPost(null);
    } catch (error) {
      enqueueSnackbar('Failed to post journal entry: ' + (error instanceof Error ? error.message : 'Unknown error'), { variant: 'error' });
    }
  };

  const handleDeleteEntry = async () => {
    if (!entryToDelete) return;
    
    try {
      await deleteJournalEntry(entryToDelete.id);
      enqueueSnackbar('Journal entry deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete journal entry: ' + (error instanceof Error ? error.message : 'Unknown error'), { variant: 'error' });
    }
  };

  const handleViewEntry = (entry: JournalEntry) => {
    router.push(`/accounting/journal-entries/${entry.id}`);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    if (entry.status !== 'draft') {
      enqueueSnackbar('Only draft entries can be edited', { variant: 'warning' });
      return;
    }
    
    const formData: JournalEntryFormData = {
      date: entry.date,
      description: entry.description,
      reference: entry.reference || '',
      entries: entry.entries.map(line => ({
        accountId: line.accountId,
        description: line.description || '',
        debit: line.debit,
        credit: line.credit,
        reference: line.reference || '',
      })),
    };
    setEditingEntry(entry);
    setFormOpen(true);
  };

  const openPostDialog = (entry: JournalEntry) => {
    if (entry.status !== 'draft') {
      enqueueSnackbar('Only draft entries can be posted', { variant: 'warning' });
      return;
    }
    
    setEntryToPost(entry);
    setPostDialogOpen(true);
  };

  const openDeleteDialog = (entry: JournalEntry) => {
    if (entry.status !== 'draft') {
      enqueueSnackbar('Only draft entries can be deleted', { variant: 'warning' });
      return;
    }
    
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, entryId: string) => {
    event.stopPropagation();
    setMenuAnchor({ ...menuAnchor, [entryId]: event.currentTarget });
  };

  const closeMenu = (entryId: string) => {
    setMenuAnchor({ ...menuAnchor, [entryId]: null });
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      status: 'all',
      dateRange: {},
    });
  };

  const getStatusColor = (status: JournalEntry['status']) => {
    switch (status) {
      case 'draft': return 'default';
      case 'posted': return 'success';
      case 'reversed': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const columns: DataTableColumn[] = [
    {
      id: 'number',
      label: 'Entry #',
      minWidth: 120,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="medium">
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(row.date)}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 250,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="body2">{value}</Typography>
          {row.reference && (
            <Typography variant="caption" color="text.secondary">
              Ref: {row.reference}
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
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'totalDebit',
      label: 'Debit',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value) => formatCurrency(value),
    },
    {
      id: 'totalCredit',
      label: 'Credit',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value) => formatCurrency(value),
    },
    {
      id: 'createdByName',
      label: 'Created By',
      minWidth: 150,
      format: (value, row) => (
        <Box>
          <Typography variant="body2">{value}</Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(row.createdAt).toLocaleString()}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 80,
      align: 'center',
      format: (value, row) => (
        <Box>
          <IconButton
            size="small"
            onClick={(e) => openMenu(e, row.id)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor[row.id]}
            open={Boolean(menuAnchor[row.id])}
            onClose={() => closeMenu(row.id)}
          >
            <MenuItem onClick={() => { handleViewEntry(row); closeMenu(row.id); }}>
              <ViewIcon sx={{ mr: 1 }} /> View
            </MenuItem>
            {row.status === 'draft' && (
              <>
                <MenuItem onClick={() => { handleEditEntry(row); closeMenu(row.id); }}>
                  <EditIcon sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => { openPostDialog(row); closeMenu(row.id); }}>
                  <PostIcon sx={{ mr: 1 }} /> Post
                </MenuItem>
                <MenuItem 
                  onClick={() => { openDeleteDialog(row); closeMenu(row.id); }}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon sx={{ mr: 1 }} /> Delete
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      ),
    },
  ];

  if (loading && journalEntries.length === 0) {
    return <LoadingSpinner fullScreen message="Loading journal entries..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Journal Entries
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Create Journal Entry
          </Button>
        </Box>

        <JournalEntryFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        <Card>
          <CardContent sx={{ p: 0 }}>
            <DataTable
              columns={columns}
              data={journalEntries}
              loading={loading}
              onRowClick={handleViewEntry}
              searchable={false} // We have custom filters
              pageable={true}
              pageSize={15}
            />
          </CardContent>
        </Card>

        <JournalEntryForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingEntry(null);
          }}
          onSubmit={handleCreateEntry}
          initialData={editingEntry ? {
            date: editingEntry.date,
            description: editingEntry.description,
            reference: editingEntry.reference || '',
            entries: editingEntry.entries.map(line => ({
              accountId: line.accountId,
              description: line.description || '',
              debit: line.debit,
              credit: line.credit,
              reference: line.reference || '',
            })),
          } : undefined}
          loading={loading}
          accounts={chartOfAccounts}
        />

        <ConfirmationDialog
          open={postDialogOpen}
          title="Post Journal Entry"
          message={`Are you sure you want to post journal entry ${entryToPost?.number}? This action cannot be undone. Once posted, the entry will affect account balances and can only be reversed, not deleted.`}
          onConfirm={handlePostEntry}
          onCancel={() => {
            setPostDialogOpen(false);
            setEntryToPost(null);
          }}
          severity="warning"
          confirmText="Post Entry"
          loading={loading}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Journal Entry"
          message={`Are you sure you want to delete journal entry ${entryToDelete?.number}? This action cannot be undone.`}
          onConfirm={handleDeleteEntry}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setEntryToDelete(null);
          }}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default JournalEntriesPage;