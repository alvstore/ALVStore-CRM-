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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  CheckCircle as ProcessIcon,
  Receipt as PayslipIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import PayrollForm from '@/modules/payroll/components/PayrollForm';
import { usePayrollStore } from '@/modules/payroll/store/payrollStore';
import { useAppSelector } from '@/redux-store';
import { Payroll, PayrollItem, PayrollFormData } from '@/modules/payroll/types';
import { DataTableColumn } from '@/types';

type RootState = {
  auth: {
    user: any; // Replace 'any' with your User type if available
  };
};

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
      id={`payroll-tabpanel-${index}`}
      aria-labelledby={`payroll-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const PayrollPage: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const {
    payrolls,
    payrollItems,
    loading,
    error,
    filters,
    fetchPayrolls,
    fetchPayrollItems,
    createPayroll,
    processPayroll,
    updatePayrollItem,
    markPayrollItemAsPaid,
    setFilters,
    clearError,
  } = usePayrollStore();

  const [tabValue, setTabValue] = React.useState(0);
  const [formOpen, setFormOpen] = React.useState(false);
  const [processDialogOpen, setProcessDialogOpen] = React.useState(false);
  const [payrollToProcess, setPayrollToProcess] = React.useState<Payroll | null>(null);
  const [selectedPayrollId, setSelectedPayrollId] = React.useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [payrollItemToPay, setPayrollItemToPay] = React.useState<PayrollItem | null>(null);
  const [paymentMethod, setPaymentMethod] = React.useState('bank_transfer');
  const [paymentReference, setPaymentReference] = React.useState('');
  const [paymentDate, setPaymentDate] = React.useState(new Date().toISOString().split('T')[0]);

  React.useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls, filters]);

  React.useEffect(() => {
    if (selectedPayrollId) {
      fetchPayrollItems(selectedPayrollId);
    }
  }, [fetchPayrollItems, selectedPayrollId]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleCreatePayroll = async (data: PayrollFormData) => {
    try {
      if (!user) throw new Error('User not authenticated');
      await createPayroll(data, user.id, user.name);
      enqueueSnackbar('Payroll created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create payroll', { variant: 'error' });
      throw error;
    }
  };

  const handleProcessPayroll = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      if (!payrollToProcess) return;
      
      await processPayroll(payrollToProcess.id, user.id, user.name);
      enqueueSnackbar('Payroll processed successfully', { variant: 'success' });
      setProcessDialogOpen(false);
      setPayrollToProcess(null);
    } catch (error) {
      enqueueSnackbar('Failed to process payroll', { variant: 'error' });
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      if (!payrollItemToPay) return;
      
      await markPayrollItemAsPaid(
        payrollItemToPay.id,
        paymentMethod as 'bank_transfer' | 'cash' | 'check',
        paymentReference,
        paymentDate
      );
      
      enqueueSnackbar('Payment recorded successfully', { variant: 'success' });
      setPaymentDialogOpen(false);
      setPayrollItemToPay(null);
      setPaymentMethod('bank_transfer');
      setPaymentReference('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      enqueueSnackbar('Failed to record payment', { variant: 'error' });
    }
  };

  const openProcessDialog = (payroll: Payroll) => {
    setPayrollToProcess(payroll);
    setProcessDialogOpen(true);
  };

  const openPaymentDialog = (payrollItem: PayrollItem) => {
    setPayrollItemToPay(payrollItem);
    setPaymentDialogOpen(true);
  };

  const handleViewPayslip = (payrollItem: PayrollItem) => {
    router.push(`/payroll/payslips/${payrollItem.id}`);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: event.target.value });
  };

  const handleStatusChange = (event: any) => {
    setFilters({ status: event.target.value });
  };

  const handleStartDateChange = (date: any) => {
    setFilters({ 
      dateRange: { 
        ...filters.dateRange, 
        start: date ? date.format('YYYY-MM-DD') : undefined 
      } 
    });
  };

  const handleEndDateChange = (date: any) => {
    setFilters({ 
      dateRange: { 
        ...filters.dateRange, 
        end: date ? date.format('YYYY-MM-DD') : undefined 
      } 
    });
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateRange: {},
    });
  };

  const handlePayrollClick = (payroll: Payroll) => {
    setSelectedPayrollId(payroll.id);
    setTabValue(1); // Switch to Payroll Items tab
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'processing': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'paid': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatMonthYear = (month: number, year: number) => {
    return new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const payrollColumns: DataTableColumn[] = [
    {
      id: 'period',
      label: 'Pay Period',
      minWidth: 180,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="medium">
            {formatMonthYear(row.month, row.year)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(row.startDate)} - {formatDate(row.endDate)}
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
          label={value.toUpperCase()}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'employeeCount',
      label: 'Employees',
      minWidth: 100,
      align: 'center',
      sortable: true,
    },
    {
      id: 'totalAmount',
      label: 'Total Amount',
      minWidth: 150,
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
            {formatDate(row.createdAt)}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'processedByName',
      label: 'Processed By',
      minWidth: 150,
      format: (value, row) => (
        value ? (
          <Box>
            <Typography variant="body2">{value}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(row.processedAt)}
            </Typography>
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
      minWidth: 120,
      align: 'center',
      format: (value, row) => (
        <Box>
          {row.status === 'draft' && (
            <IconButton
              color="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                openProcessDialog(row);
              }}
              title="Process Payroll"
            >
              <ProcessIcon />
            </IconButton>
          )}
          <IconButton
            color="info"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handlePayrollClick(row);
            }}
            title="View Details"
          >
            <ViewIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const payrollItemColumns: DataTableColumn[] = [
    {
      id: 'employeeName',
      label: 'Employee',
      minWidth: 180,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="medium">
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.position} • {row.department}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'baseSalary',
      label: 'Base Salary',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value) => formatCurrency(value),
    },
    {
      id: 'allowances',
      label: 'Allowances',
      minWidth: 120,
      align: 'right',
      format: (value) => formatCurrency(value),
    },
    {
      id: 'deductions',
      label: 'Deductions',
      minWidth: 120,
      align: 'right',
      format: (value, row) => formatCurrency(value + row.tax),
    },
    {
      id: 'netSalary',
      label: 'Net Salary',
      minWidth: 150,
      align: 'right',
      sortable: true,
      format: (value) => (
        <Typography fontWeight="bold">
          {formatCurrency(value)}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Chip
          label={value.toUpperCase()}
          color={getPaymentStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 120,
      align: 'center',
      format: (value, row) => (
        <Box>
          <IconButton
            color="info"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleViewPayslip(row);
            }}
            title="View Payslip"
          >
            <PayslipIcon />
          </IconButton>
          {row.status === 'pending' && (
            <IconButton
              color="success"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                openPaymentDialog(row);
              }}
              title="Mark as Paid"
            >
              <PaymentIcon />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  const hasActiveFilters = 
    filters.search || 
    filters.status !== 'all' ||
    filters.dateRange.start ||
    filters.dateRange.end;

  if (loading && payrolls.length === 0) {
    return <LoadingSpinner fullScreen message="Loading payroll data..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Payroll Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Generate Payroll
          </Button>
        </Box>

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Payroll Periods" />
              {selectedPayrollId && <Tab label="Payroll Items" />}
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    placeholder="Search payrolls..."
                    value={filters.search}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      onChange={handleStatusChange}
                      label="Status"
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      value={filters.dateRange.start ? dayjs(filters.dateRange.start) : null}
                      onChange={handleStartDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'medium',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="End Date"
                      value={filters.dateRange.end ? dayjs(filters.dateRange.end) : null}
                      onChange={handleEndDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'medium',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleClearFilters}
                    disabled={!hasActiveFilters}
                    startIcon={<ClearIcon />}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            <DataTable
              columns={payrollColumns}
              data={payrolls}
              loading={loading}
              onRowClick={handlePayrollClick}
              searchable={false} // We have custom filters
              pageable={true}
              pageSize={10}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {selectedPayrollId && (
              <>
                <Box mb={3}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setTabValue(0)}
                    sx={{ mb: 2 }}
                  >
                    Back to Payroll List
                  </Button>
                  
                  {payrolls.find(p => p.id === selectedPayrollId) && (
                    <Typography variant="h6">
                      Payroll Details: {formatMonthYear(
                        payrolls.find(p => p.id === selectedPayrollId)!.month,
                        payrolls.find(p => p.id === selectedPayrollId)!.year
                      )}
                    </Typography>
                  )}
                </Box>
                
                <DataTable
                  columns={payrollItemColumns}
                  data={payrollItems}
                  loading={loading}
                  searchable={true}
                  pageable={true}
                  pageSize={15}
                />
              </>
            )}
          </TabPanel>
        </Card>

        <PayrollForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleCreatePayroll}
          loading={loading}
        />

        <ConfirmationDialog
          open={processDialogOpen}
          title="Process Payroll"
          message="Are you sure you want to process this payroll? This will generate payslips for all employees and cannot be undone."
          onConfirm={handleProcessPayroll}
          onCancel={() => {
            setProcessDialogOpen(false);
            setPayrollToProcess(null);
          }}
          severity="warning"
          confirmText="Process"
          loading={loading}
        />

        <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)}>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              {payrollItemToPay && (
                <Box mb={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Employee: {payrollItemToPay.employeeName}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Amount: {formatCurrency(payrollItemToPay.netSalary)}
                  </Typography>
                </Box>
              )}
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="check">Check</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Reference Number"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Payment Date"
                  value={dayjs(paymentDate)}
                  onChange={(date) => setPaymentDate(date ? date.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0])}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleMarkAsPaid} 
              variant="contained"
              disabled={!paymentReference}
            >
              Record Payment
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </RoleBasedRoute>
  );
};

export default PayrollPage;