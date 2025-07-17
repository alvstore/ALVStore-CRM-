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
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { GeneralLedgerFilters, ChartOfAccount } from '../types';
import dayjs from 'dayjs';

interface LedgerFiltersProps {
  filters: GeneralLedgerFilters;
  onFiltersChange: (filters: Partial<GeneralLedgerFilters>) => void;
  onClearFilters: () => void;
  accounts: ChartOfAccount[];
}

const LedgerFiltersComponent: React.FC<LedgerFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  accounts,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: event.target.value });
  };

  const handleAccountChange = (event: any) => {
    onFiltersChange({ accountId: event.target.value });
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

  const hasActiveFilters = 
    filters.search || 
    filters.accountId !== 'all' ||
    filters.dateRange.start ||
    filters.dateRange.end;

  const accountOptions = [
    { value: 'all', label: 'All Accounts' },
    ...accounts
      .filter(account => account.level > 0) // Only include non-header accounts
      .map(account => ({ 
        value: account.id, 
        label: `${account.code} - ${account.name}` 
      })),
  ];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            placeholder="Search ledger entries..."
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
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
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            startIcon={<ClearIcon />}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LedgerFiltersComponent;