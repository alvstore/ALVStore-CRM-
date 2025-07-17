'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountBalance as AccountIcon,
  TrendingUp as DepositIcon,
  TrendingDown as WithdrawIcon,
  SwapHoriz as TransferIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import BankAccountForm from '@/modules/banking/components/BankAccountForm';
import TransactionForm from '@/modules/banking/components/TransactionForm';
import BankingFilters from '@/modules/banking/components/BankingFilters';
import { useBankingStore } from '@/modules/banking/store/bankingStore';
import { BankAccount, BankAccountFormData, TransactionFormData, BankTransaction } from '@/modules/banking/types';
import { DataTableColumn } from '@/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`banking-tabpanel-${index}`}
      aria-labelledby={`banking-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const BankingPage: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    bankAccounts,
    bankTransactions,
    loading,
    error,
    filters,
    fetchBankAccounts,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
    fetchBankTransactions,
    createTransaction,
    setFilters,
    clearError,
  } = useBankingStore();

  const [tabValue, setTabValue] = React.useState(0);
  const [accountFormOpen, setAccountFormOpen] = React.useState(false);
  const [transactionFormOpen, setTransactionFormOpen] = React.useState(false);
  const [editingAccount, setEditingAccount] = React.useState<BankAccount | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [accountToDelete, setAccountToDelete] = React.useState<BankAccount | null>(null);
  const [menuAnchor, setMenuAnchor] = React.useState<{ [key: string]: HTMLElement | null }>({});

  React.useEffect(() => {
    fetchBankAccounts();
    fetchBankTransactions();
  }, [fetchBankAccounts, fetchBankTransactions, filters]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreateAccount = async (data: BankAccountFormData) => {
    try {
      await createBankAccount(data);
      enqueueSnackbar('Bank account created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create bank account', { variant: 'error' });
      throw error;
    }
  };

  const handleUpdateAccount = async (data: BankAccountFormData) => {
    if (!editingAccount) return;
    
    try {
      await updateBankAccount(editingAccount.id, data);
      enqueueSnackbar('Bank account updated successfully', { variant: 'success' });
      setEditingAccount(null);
    } catch (error) {
      enqueueSnackbar('Failed to update bank account', { variant: 'error' });
      throw error;
    }
  };

  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;
    
    try {
      await deleteBankAccount(accountToDelete.id);
      enqueueSnackbar('Bank account deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete bank account', { variant: 'error' });
    }
  };

  const handleCreateTransaction = async (data: TransactionFormData) => {
    try {
      await createTransaction(data);
      enqueueSnackbar('Transaction recorded successfully', { variant: 'success' });
      // Refresh accounts to show updated balances
      fetchBankAccounts();
    } catch (error) {
      enqueueSnackbar('Failed to record transaction', { variant: 'error' });
      throw error;
    }
  };

  const handleEditAccount = (account: BankAccount) => {
    const formData: BankAccountFormData = {
      name: account.name,
      accountNumber: account.accountNumber,
      bankName: account.bankName,
      accountType: account.accountType,
      currency: account.currency,
      openingBalance: account.openingBalance,
      openingDate: account.openingDate,
      description: account.description || '',
    };
    setEditingAccount(account);
    setAccountFormOpen(true);
  };

  const openDeleteDialog = (account: BankAccount) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, accountId: string) => {
    event.stopPropagation();
    setMenuAnchor({ ...menuAnchor, [accountId]: event.currentTarget });
  };

  const closeMenu = (accountId: string) => {
    setMenuAnchor({ ...menuAnchor, [accountId]: null });
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      accountId: 'all',
      type: 'all',
      category: 'all',
      dateRange: {},
      amountRange: {},
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getAccountTypeColor = (type: BankAccount['accountType']) => {
    switch (type) {
      case 'checking': return 'primary';
      case 'savings': return 'success';
      case 'credit': return 'warning';
      case 'loan': return 'error';
      case 'investment': return 'info';
      default: return 'default';
    }
  };

  const getTransactionTypeColor = (type: BankTransaction['type']) => {
    switch (type) {
      case 'deposit': return 'success';
      case 'withdraw': return 'error';
      case 'transfer_in': return 'info';
      case 'transfer_out': return 'warning';
      default: return 'default';
    }
  };

  const getTransactionTypeIcon = (type: BankTransaction['type']) => {
    switch (type) {
      case 'deposit': return <DepositIcon />;
      case 'withdraw': return <WithdrawIcon />;
      case 'transfer_in': return <TransferIcon />;
      case 'transfer_out': return <TransferIcon />;
      default: return <AccountIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const accountColumns: DataTableColumn[] = [
    {
      id: 'name',
      label: 'Account Name',
      minWidth: 200,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="medium">
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.bankName} • {row.accountNumber}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'accountType',
      label: 'Type',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={getAccountTypeColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'balance',
      label: 'Balance',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value) => (
        <Typography 
          variant="subtitle2" 
          fontWeight="bold"
          color={value >= 0 ? 'success.main' : 'error.main'}
        >
          {formatCurrency(value)}
        </Typography>
      ),
    },
    {
      id: 'currency',
      label: 'Currency',
      minWidth: 80,
      align: 'center',
    },
    {
      id: 'openingDate',
      label: 'Opened',
      minWidth: 120,
      format: (value) => formatDate(value),
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
            <MenuItem onClick={() => { handleEditAccount(row); closeMenu(row.id); }}>
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

  const transactionColumns: DataTableColumn[] = [
    {
      id: 'date',
      label: 'Date',
      minWidth: 100,
      sortable: true,
      format: (value) => formatDate(value),
    },
    {
      id: 'accountName',
      label: 'Account',
      minWidth: 150,
      sortable: true,
    },
    {
      id: 'type',
      label: 'Type',
      minWidth: 120,
      format: (value) => (
        <Box display="flex" alignItems="center" gap={1}>
          {getTransactionTypeIcon(value)}
          <Chip
            label={value.replace('_', ' ').toUpperCase()}
            color={getTransactionTypeColor(value)}
            size="small"
          />
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
          {row.reference && (
            <Typography variant="caption" color="text.secondary">
              Ref: {row.reference}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'category',
      label: 'Category',
      minWidth: 120,
      format: (value) => value || '-',
    },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value, row) => (
        <Typography 
          variant="subtitle2" 
          fontWeight="medium"
          color={
            row.type === 'deposit' || row.type === 'transfer_in' 
              ? 'success.main' 
              : 'error.main'
          }
        >
          {row.type === 'deposit' || row.type === 'transfer_in' ? '+' : '-'}
          {formatCurrency(value)}
        </Typography>
      ),
    },
    {
      id: 'balance',
      label: 'Balance',
      minWidth: 120,
      align: 'right',
      format: (value) => formatCurrency(value),
    },
  ];

  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);

  if (loading && bankAccounts.length === 0) {
    return <LoadingSpinner fullScreen message="Loading banking data..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Banking & Cash Management
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<TransferIcon />}
              onClick={() => setTransactionFormOpen(true)}
            >
              Record Transaction
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAccountFormOpen(true)}
            >
              Add Bank Account
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <AccountIcon color="primary" />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {bankAccounts.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bank Accounts
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <DepositIcon color="success" />
                  <Box>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold"
                      color={totalBalance >= 0 ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(totalBalance)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Balance
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <TransferIcon color="info" />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {bankTransactions.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Transactions
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <WithdrawIcon color="warning" />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {bankTransactions.filter(t => t.type === 'withdraw').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Withdrawals
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={`Bank Accounts (${bankAccounts.length})`} />
              <Tab label={`Transactions (${bankTransactions.length})`} />
            </Tabs>
          </Box>
          
          <CardContent sx={{ p: 0 }}>
            <TabPanel value={tabValue} index={0}>
              <Box p={3}>
                <DataTable
                  columns={accountColumns}
                  data={bankAccounts}
                  loading={loading}
                  searchable={true}
                  pageable={true}
                  pageSize={10}
                />
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Box p={3}>
                <BankingFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  bankAccounts={bankAccounts}
                />
                
                <DataTable
                  columns={transactionColumns}
                  data={bankTransactions}
                  loading={loading}
                  searchable={false} // We have custom filters
                  pageable={true}
                  pageSize={15}
                />
              </Box>
            </TabPanel>
          </CardContent>
        </Card>

        <BankAccountForm
          open={accountFormOpen}
          onClose={() => {
            setAccountFormOpen(false);
            setEditingAccount(null);
          }}
          onSubmit={editingAccount ? handleUpdateAccount : handleCreateAccount}
          initialData={editingAccount ? {
            name: editingAccount.name,
            accountNumber: editingAccount.accountNumber,
            bankName: editingAccount.bankName,
            accountType: editingAccount.accountType,
            currency: editingAccount.currency,
            openingBalance: editingAccount.openingBalance,
            openingDate: editingAccount.openingDate,
            description: editingAccount.description || '',
          } : undefined}
          loading={loading}
        />

        <TransactionForm
          open={transactionFormOpen}
          onClose={() => setTransactionFormOpen(false)}
          onSubmit={handleCreateTransaction}
          loading={loading}
          bankAccounts={bankAccounts}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Bank Account"
          message={`Are you sure you want to delete "${accountToDelete?.name}"? This action cannot be undone. If the account has transactions, it will be marked as inactive instead.`}
          onConfirm={handleDeleteAccount}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setAccountToDelete(null);
          }}
          severity="error"
          confirmText="Delete"
          loading={loading}
        />
      </Box>
    </RoleBasedRoute>
  );
};

export default BankingPage;