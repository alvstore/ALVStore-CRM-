'use client';

import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Button,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PaymentFilters, Invoice } from '../types';
import dayjs from 'dayjs';

interface PaymentFiltersProps {
  filters: PaymentFilters;
  onFiltersChange: (filters: Partial<PaymentFilters>) => void;
  onClearFilters: () => void;
  invoices: Invoice[];
  clients: Array<{ id: string; name: string }>;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

const paymentMethodOptions = [
  { value: 'all', label: 'All Payment Methods' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'check', label: 'Check' },
  { value: 'online', label: 'Online Payment' },
];

const PaymentFiltersComponent: React.FC<PaymentFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  invoices,
  clients,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: event.target.value });
  };

  const handleInvoiceChange = (event: any) => {
    onFiltersChange({ invoiceId: event.target.value });
  };

  const handleClientChange = (event: any) => {
    onFiltersChange({ clientId: event.target.value });
  };

  const handleStatusChange = (event: any) => {
    onFiltersChange({ status: event.target.value });
  };

  const handlePaymentMethodChange = (event: any) => {
    onFiltersChange({ paymentMethod: event.target.value });
  };

  const handleStartDateChange = (date: any) => {
    onFiltersChange({ 
      dateRange: { 
        ...filters.dateRange, 
        start: date ? date.toISOString() : undefined 
      } 
    });
  };

  const handleEndDateChange = (date: any) => {
    onFiltersChange({ 
      dateRange: { 
        ...filters.dateRange, 
        end: date ? date.toISOString() : undefined 
      } 
    });
  };

  const handleMinAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseFloat(event.target.value) : undefined;
    onFiltersChange({ 
      amountRange: { 
        ...filters.amountRange, 
        min: value 
      } 
    });
  };

  const handleMaxAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseFloat(event.target.value) : undefined;
    onFiltersChange({ 
      amountRange: { 
        ...filters.amountRange, 
        max: value 
      } 
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.invoiceId !== 'all' || 
    filters.clientId !== 'all' ||
    filters.status !== 'all' ||
    filters.paymentMethod !== 'all' ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.amountRange.min !== undefined ||
    filters.amountRange.max !== undefined;

  const invoiceOptions = [
    { value: 'all', label: 'All Invoices' },
    ...invoices.map(invoice => ({ value: invoice.id, label: invoice.number })),
  ];

  const clientOptions = [
    { value: 'all', label: 'All Clients' },
    ...clients.map(client => ({ value: client.id, label: client.name })),
  ];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            placeholder="Search payments..."
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Invoice</InputLabel>
            <Select
              value={filters.invoiceId}
              onChange={handleInvoiceChange}
              label="Invoice"
            >
              {invoiceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Client</InputLabel>
            <Select
              value={filters.clientId}
              onChange={handleClientChange}
              label="Client"
            >
              {clientOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={handleStatusChange}
              label="Status"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={filters.paymentMethod}
              onChange={handlePaymentMethodChange}
              label="Payment Method"
            >
              {paymentMethodOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            startIcon={<ClearIcon />}
          >
            Clear
          </Button>
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
          <TextField
            fullWidth
            label="Min Amount"
            type="number"
            value={filters.amountRange.min || ''}
            onChange={handleMinAmountChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Max Amount"
            type="number"
            value={filters.amountRange.max || ''}
            onChange={handleMaxAmountChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PaymentFiltersComponent;