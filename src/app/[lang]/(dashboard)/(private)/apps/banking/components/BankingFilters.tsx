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
import { BankingFilters, BankAccount } from '../types';
import dayjs from 'dayjs';

interface BankingFiltersProps {
  filters: BankingFilters;
  onFiltersChange: (filters: Partial<BankingFilters>) => void;
  onClearFilters: () => void;
  bankAccounts: BankAccount[];
}

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'deposit', label: 'Deposits' },
  { value: 'withdraw', label: 'Withdrawals' },
  { value: 'transfer_in', label: 'Transfers In' },
  { value: 'transfer_out', label: 'Transfers Out' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'Revenue', label: 'Revenue' },
  { value: 'Office Supplies', label: 'Office Supplies' },
  { value: 'Rent', label: 'Rent' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Transfer', label: 'Transfer' },
  { value: 'Other', label: 'Other' },
];

const BankingFiltersComponent: React.FC<BankingFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  bankAccounts,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: event.target.value });
  };

  const handleAccountChange = (event: any) => {
    onFiltersChange({ accountId: event.target.value });
  };

  const handleTypeChange = (event: any) => {
    onFiltersChange({ type: event.target.value });
  };

  const handleCategoryChange = (event: any) => {
    onFiltersChange({ category: event.target.value });
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
    filters.accountId !== 'all' || 
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.amountRange.min !== undefined ||
    filters.amountRange.max !== undefined;

  const accountOptions = [
    { value: 'all', label: 'All Accounts' },
    ...bankAccounts.map(account => ({ value: account.id, label: account.name })),
  ];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            placeholder="Search transactions..."
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Account</InputLabel>
            <Select
              value={filters.accountId}
              onChange={handleAccountChange}
              label="Account"
            >
              {accountOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              onChange={handleTypeChange}
              label="Type"
            >
              {typeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              onChange={handleCategoryChange}
              label="Category"
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
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

export default BankingFiltersComponent;