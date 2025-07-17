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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  Receipt as InvoiceIcon,
  Send as SendIcon,
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import QuoteForm from '@/modules/quotes/components/QuoteForm';
import QuoteFilters from '@/modules/quotes/components/QuoteFilters';
import ConvertToInvoiceDialog from '@/modules/quotes/components/ConvertToInvoiceDialog';
import { useQuoteStore } from '@/modules/quotes/store/quoteStore';
import { Quote, QuoteFormData, ConvertToInvoiceData } from '@/modules/quotes/types';
import { DataTableColumn } from '@/types';

const QuotesPage: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    quotes,
    loading,
    error,
    filters,
    clients,
    fetchQuotes,
    createQuote,
    updateQuote,
    deleteQuote,
    convertToInvoice,
    updateQuoteStatus,
    setFilters,
    clearError,
    fetchClients,
  } = useQuoteStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingQuote, setEditingQuote] = React.useState<Quote | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [quoteToDelete, setQuoteToDelete] = React.useState<Quote | null>(null);
  const [convertDialogOpen, setConvertDialogOpen] = React.useState(false);
  const [quoteToConvert, setQuoteToConvert] = React.useState<Quote | null>(null);
  const [menuAnchor, setMenuAnchor] = React.useState<{ [key: string]: HTMLElement | null }>({});

  React.useEffect(() => {
    fetchQuotes();
    fetchClients();
  }, [fetchQuotes, fetchClients, filters]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreateQuote = async (data: QuoteFormData) => {
    try {
      await createQuote(data);
      enqueueSnackbar('Quote created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create quote', { variant: 'error' });
      throw error;
    }
  };

  const handleUpdateQuote = async (data: QuoteFormData) => {
    if (!editingQuote) return;
    
    try {
      await updateQuote(editingQuote.id, data);
      enqueueSnackbar('Quote updated successfully', { variant: 'success' });
      setEditingQuote(null);
    } catch (error) {
      enqueueSnackbar('Failed to update quote', { variant: 'error' });
      throw error;
    }
  };

  const handleDeleteQuote = async () => {
    if (!quoteToDelete) return;
    
    try {
      await deleteQuote(quoteToDelete.id);
      enqueueSnackbar('Quote deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setQuoteToDelete(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete quote', { variant: 'error' });
    }
  };

  const handleConvertToInvoice = async (data: ConvertToInvoiceData) => {
    try {
      const result = await convertToInvoice(data);
      enqueueSnackbar(`Quote converted to invoice successfully! Invoice ID: ${result.invoiceId}`, { 
        variant: 'success' 
      });
      setConvertDialogOpen(false);
      setQuoteToConvert(null);
    } catch (error) {
      enqueueSnackbar('Failed to convert quote to invoice', { variant: 'error' });
      throw error;
    }
  };

  const handleStatusChange = async (quote: Quote, newStatus: Quote['status']) => {
    try {
      await updateQuoteStatus(quote.id, newStatus);
      enqueueSnackbar(`Quote ${newStatus} successfully`, { variant: 'success' });
      closeMenu(quote.id);
    } catch (error) {
      enqueueSnackbar(`Failed to ${newStatus} quote`, { variant: 'error' });
    }
  };

  const handleViewQuote = (quote: Quote) => {
    router.push(`/quotes/${quote.id}`);
  };

  const handleEditQuote = (quote: Quote) => {
    const formData: QuoteFormData = {
      clientId: quote.clientId,
      items: quote.items,
      taxRate: quote.taxRate,
      discountType: quote.discountType,
      discountValue: quote.discountValue,
      validUntil: quote.validUntil.split('T')[0],
      notes: quote.notes || '',
      terms: quote.terms || '',
      status: quote.status === 'sent' ? 'sent' : 'draft',
    };
    setEditingQuote(quote);
    setFormOpen(true);
  };

  const openDeleteDialog = (quote: Quote) => {
    setQuoteToDelete(quote);
    setDeleteDialogOpen(true);
  };

  const openConvertDialog = (quote: Quote) => {
    setQuoteToConvert(quote);
    setConvertDialogOpen(true);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, quoteId: string) => {
    event.stopPropagation();
    setMenuAnchor({ ...menuAnchor, [quoteId]: event.currentTarget });
  };

  const closeMenu = (quoteId: string) => {
    setMenuAnchor({ ...menuAnchor, [quoteId]: null });
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      clientId: 'all',
      dateRange: {},
    });
  };

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'draft': return 'default';
      case 'sent': return 'info';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      case 'expired': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns: DataTableColumn[] = [
    {
      id: 'number',
      label: 'Quote #',
      minWidth: 120,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="medium">
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(row.createdAt)}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'clientName',
      label: 'Client',
      minWidth: 200,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2">{value}</Typography>
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
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'total',
      label: 'Total',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value) => `$${value.toFixed(2)}`,
    },
    {
      id: 'validUntil',
      label: 'Valid Until',
      minWidth: 120,
      format: (value) => formatDate(value),
    },
    {
      id: 'convertedToInvoice',
      label: 'Converted',
      minWidth: 100,
      align: 'center',
      format: (value, row) => (
        value ? (
          <Chip
            label="Invoiced"
            color="success"
            size="small"
            icon={<InvoiceIcon />}
          />
        ) : null
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
            <MenuItem onClick={() => { handleViewQuote(row); closeMenu(row.id); }}>
              <ViewIcon sx={{ mr: 1 }} /> View
            </MenuItem>
            <MenuItem onClick={() => { handleEditQuote(row); closeMenu(row.id); }}>
              <EditIcon sx={{ mr: 1 }} /> Edit
            </MenuItem>
            {row.status === 'draft' && (
              <MenuItem onClick={() => handleStatusChange(row, 'sent')}>
                <SendIcon sx={{ mr: 1 }} /> Send to Client
              </MenuItem>
            )}
            {row.status === 'sent' && (
              <>
                <MenuItem onClick={() => handleStatusChange(row, 'accepted')}>
                  <AcceptIcon sx={{ mr: 1 }} /> Mark Accepted
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange(row, 'rejected')}>
                  <RejectIcon sx={{ mr: 1 }} /> Mark Rejected
                </MenuItem>
              </>
            )}
            {row.status === 'accepted' && !row.convertedToInvoice && (
              <MenuItem onClick={() => { openConvertDialog(row); closeMenu(row.id); }}>
                <InvoiceIcon sx={{ mr: 1 }} /> Convert to Invoice
              </MenuItem>
            )}
            <MenuItem 
              onClick={() => { openDeleteDialog(row); closeMenu(row.id); }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  if (loading && quotes.length === 0) {
    return <LoadingSpinner fullScreen message="Loading quotes..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Quotes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Create Quote
          </Button>
        </Box>

        <QuoteFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          clients={clients}
        />

        <Card>
          <CardContent sx={{ p: 0 }}>
            <DataTable
              columns={columns}
              data={quotes}
              loading={loading}
              onRowClick={handleViewQuote}
              searchable={false} // We have custom filters
              pageable={true}
              pageSize={10}
            />
          </CardContent>
        </Card>

        <QuoteForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingQuote(null);
          }}
          onSubmit={editingQuote ? handleUpdateQuote : handleCreateQuote}
          initialData={editingQuote ? {
            clientId: editingQuote.clientId,
            items: editingQuote.items,
            taxRate: editingQuote.taxRate,
            discountType: editingQuote.discountType,
            discountValue: editingQuote.discountValue,
            validUntil: editingQuote.validUntil.split('T')[0],
            notes: editingQuote.notes || '',
            terms: editingQuote.terms || '',
            status: editingQuote.status === 'sent' ? 'sent' : 'draft',
          } : undefined}
          loading={loading}
          clients={clients}
        />

        <ConvertToInvoiceDialog
          open={convertDialogOpen}
          onClose={() => {
            setConvertDialogOpen(false);
            setQuoteToConvert(null);
          }}
          onConfirm={handleConvertToInvoice}
          quote={quoteToConvert}
          loading={loading}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Quote"
          message={`Are you sure you want to delete quote ${quoteToDelete?.number}? This action cannot be undone.`}
          onConfirm={handleDeleteQuote}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setQuoteToDelete(null);
          }}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default QuotesPage;