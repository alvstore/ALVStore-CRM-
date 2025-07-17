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
import { QuoteFilters } from '../types';
import dayjs from 'dayjs';

interface QuoteFiltersProps {
  filters: QuoteFilters;
  onFiltersChange: (filters: Partial<QuoteFilters>) => void;
  onClearFilters: () => void;
  clients: Array<{ id: string; name: string; email: string }>;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
];

const QuoteFiltersComponent: React.FC<QuoteFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  clients,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: event.target.value });
  };

  const handleStatusChange = (event: any) => {
    onFiltersChange({ status: event.target.value });
  };

  const handleClientChange = (event: any) => {
    onFiltersChange({ clientId: event.target.value });
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
    filters.status !== 'all' || 
    filters.clientId !== 'all' ||
    filters.dateRange.start ||
    filters.dateRange.end;

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
            placeholder="Search quotes..."
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
      </Grid>
    </Paper>
  );
};

export default QuoteFiltersComponent;