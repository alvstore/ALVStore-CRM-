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
  CheckCircle as CompleteIcon,
  Pending as PendingIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import PaymentForm from '@/modules/payments/components/PaymentForm';
import PaymentFilters from '@/modules/payments/components/PaymentFilters';
import { usePaymentStore } from '@/modules/payments/store/paymentStore';
import { Payment, PaymentFormData } from '@/modules/payments/types';
import { DataTableColumn } from '@/types';

const PaymentsPage: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    payments,
    invoices,
    clients,
    loading,
    error,
    filters,
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment,
    setFilters,
    clearError,
    fetchInvoices,
    fetchClients,
  } = usePaymentStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingPayment, setEditingPayment] = React.useState<Payment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [paymentToDelete, setPaymentToDelete] = React.useState<Payment | null>(null);
  const [menuAnchor, setMenuAnchor] = React.useState<{ [key: string]: HTMLElement | null }>({});

  React.useEffect(() => {
    fetchPayments();
    fetchInvoices();
    fetchClients();
  }, [fetchPayments, fetchInvoices, fetchClients, filters]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreatePayment = async (data: PaymentFormData) => {
    try {
      await createPayment(data);
      enqueueSnackbar('Payment recorded successfully', { variant: 'success' });
      // Refresh invoices to get updated balances
      fetchInvoices();
    } catch (error) {
      enqueueSnackbar('Failed to record payment', { variant: 'error' });
      throw error;
    }
  };

  const handleUpdatePayment = async (data: PaymentFormData) => {
    if (!editingPayment) return;
    
    try {
      await updatePayment(editingPayment.id, data);
      enqueueSnackbar('Payment updated successfully', { variant: 'success' });
      setEditingPayment(null);
      // Refresh invoices to get updated balances
      fetchInvoices();
    } catch (error) {
      enqueueSnackbar('Failed to update payment', { variant: 'error' });
      throw error;
    }
  };

  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;
    
    try {
      await deletePayment(paymentToDelete.id);
      enqueueSnackbar('Payment deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setPaymentToDelete(null);
      // Refresh invoices to get updated balances
      fetchInvoices();
    } catch (error) {
      enqueueSnackbar('Failed to delete payment', { variant: 'error' });
    }
  };

  const handleViewPayment = (payment: Payment) => {
    router.push(`/payments/${payment.id}`);
  };

  const handleEditPayment = (payment: Payment) => {
    const formData: PaymentFormData = {
      invoiceId: payment.invoiceId,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod,
      reference: payment.reference || '',
      notes: payment.notes || '',
      status: payment.status === 'failed' ? 'pending' : payment.status,
    };
    setEditingPayment(payment);
    setFormOpen(true);
  };

  const openDeleteDialog = (payment: Payment) => {
    setPaymentToDelete(payment);
    setDeleteDialogOpen(true);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, paymentId: string) => {
    event.stopPropagation();
    setMenuAnchor({ ...menuAnchor, [paymentId]: event.currentTarget });
  };

  const closeMenu = (paymentId: string) => {
    setMenuAnchor({ ...menuAnchor, [paymentId]: null });
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      invoiceId: 'all',
      clientId: 'all',
      status: 'all',
      paymentMethod: 'all',
      dateRange: {},
      amountRange: {},
    });
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'refunded': return 'info';
      default: return 'default';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card': return 'Card';
      case 'cash': return 'Cash';
      case 'bank_transfer': return 'Bank Transfer';
      case 'check': return 'Check';
      case 'online': return 'Online';
      default: return method;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns: DataTableColumn[] = [
    {
      id: 'paymentDate',
      label: 'Date',
      minWidth: 100,
      sortable: true,
      format: (value) => formatDate(value),
    },
    {
      id: 'invoiceNumber',
      label: 'Invoice',
      minWidth: 120,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="medium">
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.clientName}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value) => `$${value.toFixed(2)}`,
    },
    {
      id: 'paymentMethod',
      label: 'Method',
      minWidth: 120,
      format: (value, row) => (
        <Box>
          <Typography variant="body2">
            {getPaymentMethodLabel(value)}
          </Typography>
          {row.reference && (
            <Typography variant="caption" color="text.secondary">
              {row.reference}
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
      id: 'createdByName',
      label: 'Recorded By',
      minWidth: 120,
      format: (value, row) => (
        <Box>
          <Typography variant="body2">{value}</Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(row.createdAt)}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'processedByName',
      label: 'Processed By',
      minWidth: 120,
      format: (value, row) => (
        value ? (
          <Box>
            <Typography variant="body2">{value}</Typography>
            {row.processedAt && (
              <Typography variant="caption" color="text.secondary">
                {formatDate(row.processedAt)}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Not processed
          </Typography>
        )
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
            <MenuItem onClick={() => { handleViewPayment(row); closeMenu(row.id); }}>
              <ViewIcon sx={{ mr: 1 }} /> View
            </MenuItem>
            <MenuItem onClick={() => { handleEditPayment(row); closeMenu(row.id); }}>
              <EditIcon sx={{ mr: 1 }} /> Edit
            </MenuItem>
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

  if (loading && payments.length === 0) {
    return <LoadingSpinner fullScreen message="Loading payments..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Payments Received
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Record Payment
          </Button>
        </Box>

        <PaymentFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          invoices={invoices}
          clients={clients}
        />

        <Card>
          <CardContent sx={{ p: 0 }}>
            <DataTable
              columns={columns}
              data={payments}
              loading={loading}
              onRowClick={handleViewPayment}
              searchable={false} // We have custom filters
              pageable={true}
              pageSize={10}
            />
          </CardContent>
        </Card>

        <PaymentForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingPayment(null);
          }}
          onSubmit={editingPayment ? handleUpdatePayment : handleCreatePayment}
          initialData={editingPayment ? {
            invoiceId: editingPayment.invoiceId,
            amount: editingPayment.amount,
            paymentDate: editingPayment.paymentDate,
            paymentMethod: editingPayment.paymentMethod,
            reference: editingPayment.reference || '',
            notes: editingPayment.notes || '',
            status: editingPayment.status === 'failed' ? 'pending' : editingPayment.status,
          } : undefined}
          loading={loading}
          invoices={invoices}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Payment"
          message={`Are you sure you want to delete this payment of $${paymentToDelete?.amount.toFixed(2)}? This action cannot be undone and will affect the invoice balance.`}
          onConfirm={handleDeletePayment}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setPaymentToDelete(null);
          }}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default PaymentsPage;