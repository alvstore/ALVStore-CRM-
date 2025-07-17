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
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import ExpenseForm from '@/modules/expenses/components/ExpenseForm';
import ExpenseFilters from '@/modules/expenses/components/ExpenseFilters';
import { useExpenseStore } from '@/modules/expenses/store/expenseStore';
import { Expense, ExpenseFormData } from '@/modules/expenses/types';
import { DataTableColumn } from '@/types';

const ExpensesPage: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    expenses,
    categories,
    loading,
    error,
    filters,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    approveExpense,
    rejectExpense,
    setFilters,
    clearError,
    fetchCategories,
  } = useExpenseStore();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [expenseToDelete, setExpenseToDelete] = React.useState<Expense | null>(null);
  const [menuAnchor, setMenuAnchor] = React.useState<{ [key: string]: HTMLElement | null }>({});

  React.useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [fetchExpenses, fetchCategories, filters]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreateExpense = async (data: ExpenseFormData) => {
    try {
      await createExpense(data);
      enqueueSnackbar('Expense added successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to add expense', { variant: 'error' });
      throw error;
    }
  };

  const handleUpdateExpense = async (data: ExpenseFormData) => {
    if (!editingExpense) return;
    
    try {
      await updateExpense(editingExpense.id, data);
      enqueueSnackbar('Expense updated successfully', { variant: 'success' });
      setEditingExpense(null);
    } catch (error) {
      enqueueSnackbar('Failed to update expense', { variant: 'error' });
      throw error;
    }
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;
    
    try {
      await deleteExpense(expenseToDelete.id);
      enqueueSnackbar('Expense deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete expense', { variant: 'error' });
    }
  };

  const handleApproveExpense = async (expense: Expense) => {
    try {
      await approveExpense(expense.id);
      enqueueSnackbar('Expense approved successfully', { variant: 'success' });
      closeMenu(expense.id);
    } catch (error) {
      enqueueSnackbar('Failed to approve expense', { variant: 'error' });
    }
  };

  const handleRejectExpense = async (expense: Expense) => {
    try {
      await rejectExpense(expense.id);
      enqueueSnackbar('Expense rejected', { variant: 'info' });
      closeMenu(expense.id);
    } catch (error) {
      enqueueSnackbar('Failed to reject expense', { variant: 'error' });
    }
  };

  const handleViewExpense = (expense: Expense) => {
    router.push(`/expenses/${expense.id}`);
  };

  const handleEditExpense = (expense: Expense) => {
    const formData: ExpenseFormData = {
      date: expense.date,
      amount: expense.amount,
      vendor: expense.vendor,
      category: expense.category,
      description: expense.description,
      notes: expense.notes || '',
      paymentMethod: expense.paymentMethod,
      reference: expense.reference || '',
      status: expense.status === 'rejected' ? 'pending' : expense.status,
    };
    setEditingExpense(expense);
    setFormOpen(true);
  };

  const openDeleteDialog = (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, expenseId: string) => {
    event.stopPropagation();
    setMenuAnchor({ ...menuAnchor, [expenseId]: event.currentTarget });
  };

  const closeMenu = (expenseId: string) => {
    setMenuAnchor({ ...menuAnchor, [expenseId]: null });
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      status: 'all',
      paymentMethod: 'all',
      dateRange: {},
      amountRange: {},
    });
  };

  const getStatusColor = (status: Expense['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card': return 'Card';
      case 'cash': return 'Cash';
      case 'bank_transfer': return 'Bank Transfer';
      case 'check': return 'Check';
      default: return method;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns: DataTableColumn[] = [
    {
      id: 'date',
      label: 'Date',
      minWidth: 100,
      sortable: true,
      format: (value) => formatDate(value),
    },
    {
      id: 'vendor',
      label: 'Vendor',
      minWidth: 150,
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
      id: 'description',
      label: 'Description',
      minWidth: 200,
      format: (value, row) => (
        <Box>
          <Typography variant="body2">{value}</Typography>
          {row.notes && (
            <Typography variant="caption" color="text.secondary">
              {row.notes.length > 50 ? `${row.notes.substring(0, 50)}...` : row.notes}
            </Typography>
          )}
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
      label: 'Payment',
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
      label: 'Created By',
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
            <MenuItem onClick={() => { handleViewExpense(row); closeMenu(row.id); }}>
              <ViewIcon sx={{ mr: 1 }} /> View
            </MenuItem>
            <MenuItem onClick={() => { handleEditExpense(row); closeMenu(row.id); }}>
              <EditIcon sx={{ mr: 1 }} /> Edit
            </MenuItem>
            {row.status === 'pending' && (
              <>
                <MenuItem onClick={() => handleApproveExpense(row)}>
                  <ApproveIcon sx={{ mr: 1 }} /> Approve
                </MenuItem>
                <MenuItem onClick={() => handleRejectExpense(row)}>
                  <RejectIcon sx={{ mr: 1 }} /> Reject
                </MenuItem>
              </>
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

  if (loading && expenses.length === 0) {
    return <LoadingSpinner fullScreen message="Loading expenses..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Expenses
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Add Expense
          </Button>
        </Box>

        <ExpenseFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          categories={categories}
        />

        <Card>
          <CardContent sx={{ p: 0 }}>
            <DataTable
              columns={columns}
              data={expenses}
              loading={loading}
              onRowClick={handleViewExpense}
              searchable={false} // We have custom filters
              pageable={true}
              pageSize={10}
            />
          </CardContent>
        </Card>

        <ExpenseForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingExpense(null);
          }}
          onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
          initialData={editingExpense ? {
            date: editingExpense.date,
            amount: editingExpense.amount,
            vendor: editingExpense.vendor,
            category: editingExpense.category,
            description: editingExpense.description,
            notes: editingExpense.notes || '',
            paymentMethod: editingExpense.paymentMethod,
            reference: editingExpense.reference || '',
            status: editingExpense.status === 'rejected' ? 'pending' : editingExpense.status,
          } : undefined}
          loading={loading}
          categories={categories}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Expense"
          message={`Are you sure you want to delete this expense for ${expenseToDelete?.vendor}? This action cannot be undone.`}
          onConfirm={handleDeleteExpense}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setExpenseToDelete(null);
          }}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default ExpensesPage;