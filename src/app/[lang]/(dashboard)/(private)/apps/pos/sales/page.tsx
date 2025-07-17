'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import { usePOSStore } from '@/modules/pos/store/posStore';
import { Sale } from '@/modules/pos/types';

const SalesPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    sales,
    loading,
    error,
    filters,
    fetchSales,
    setFilters,
  } = usePOSStore();

  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');

  useEffect(() => {
    fetchSales();
  }, [fetchSales, filters]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const handleSearch = () => {
    setFilters({
      search: searchTerm,
      dateRange: {
        start: startDate?.format('YYYY-MM-DD'),
        end: endDate?.format('YYYY-MM-DD'),
      },
      paymentMethod: paymentMethod !== 'all' ? paymentMethod : undefined,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate(dayjs().subtract(7, 'day'));
    setEndDate(dayjs());
    setPaymentMethod('all');
    setMinAmount('');
    setMaxAmount('');
    
    setFilters({
      search: '',
      dateRange: {
        start: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD'),
      },
      paymentMethod: undefined,
      minAmount: undefined,
      maxAmount: undefined,
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Card';
      case 'upi': return 'UPI';
      case 'bank_transfer': return 'Bank Transfer';
      case 'check': return 'Check';
      case 'multiple': return 'Multiple';
      default: return method;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'success';
      case 'card': return 'primary';
      case 'upi': return 'secondary';
      case 'bank_transfer': return 'info';
      case 'check': return 'warning';
      case 'multiple': return 'default';
      default: return 'default';
    }
  };

  // Calculate summary statistics
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Payment method breakdown
  const paymentMethods = ['cash', 'card', 'upi', 'bank_transfer', 'check', 'multiple'];
  const paymentBreakdown = paymentMethods.map(method => {
    const methodSales = sales.filter(sale => sale.paymentMethod === method);
    return {
      method,
      count: methodSales.length,
      amount: methodSales.reduce((sum, sale) => sum + sale.total, 0),
    };
  }).filter(item => item.count > 0);

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Sales History
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Search & Filter
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
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
                  value={endDate}
                  onChange={setEndDate}
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
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="all">All Methods</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="check">Check</MenuItem>
                  <MenuItem value="multiple">Multiple</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Min Amount"
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Max Amount"
                    type="number"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Summary Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <ReceiptIcon fontSize="large" color="primary" />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {totalSales}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sales
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <MoneyIcon fontSize="large" color="success" />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {formatCurrency(totalRevenue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <TrendingUpIcon fontSize="large" color="info" />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {formatCurrency(averageSale)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Sale
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Payment Method Breakdown */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Payment Method Breakdown
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            {paymentBreakdown.map((method) => (
              <Grid item xs={6} sm={4} md={2} key={method.method}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    borderRadius: 1,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="subtitle2">
                    {getPaymentMethodText(method.method)}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatCurrency(method.amount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {method.count} {method.count === 1 ? 'sale' : 'sales'}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Sales Table */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Sales List
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {sales.length === 0 ? (
            <Box textAlign="center" py={4}>
              <CartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                No sales found for the selected filters.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Receipt #</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id} hover>
                      <TableCell>{sale.number}</TableCell>
                      <TableCell>{formatDate(sale.date)}</TableCell>
                      <TableCell>{sale.customerName || 'Walk-in Customer'}</TableCell>
                      <TableCell>
                        {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getPaymentMethodText(sale.paymentMethod)} 
                          color={getPaymentMethodColor(sale.paymentMethod)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">{formatCurrency(sale.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </RoleBasedRoute>
  );
};

export default SalesPage;