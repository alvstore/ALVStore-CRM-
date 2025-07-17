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
import { TicketFilters, TicketCategory } from '../types';
import dayjs from 'dayjs';

interface TicketFiltersProps {
  filters: TicketFilters;
  onFiltersChange: (filters: Partial<TicketFilters>) => void;
  onClearFilters: () => void;
  categories: TicketCategory[];
  clients: Array<{ id: string; name: string }>;
  staff: Array<{ id: string; name: string; role: string }>;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const priorityOptions = [
  { value: 'all', label: 'All Priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const TicketFiltersComponent: React.FC<TicketFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  categories,
  clients,
  staff,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: event.target.value });
  };

  const handleStatusChange = (event: any) => {
    onFiltersChange({ status: event.target.value });
  };

  const handlePriorityChange = (event: any) => {
    onFiltersChange({ priority: event.target.value });
  };

  const handleAssignedToChange = (event: any) => {
    onFiltersChange({ assignedTo: event.target.value });
  };

  const handleCategoryChange = (event: any) => {
    onFiltersChange({ category: event.target.value });
  };

  const handleClientChange = (event: any) => {
    onFiltersChange({ clientId: event.target.value });
  };

  const handleStartDateChange = (date: any) => {
    onFiltersChange({ 
      dateRange: { 
        ...filters.dateRange, 
        start: date ? date.format('YYYY-MM-DD') : undefined 
      } 
    });
  };

  const handleEndDateChange = (date: any) => {
    onFiltersChange({ 
      dateRange: { 
        ...filters.dateRange, 
        end: date ? date.format('YYYY-MM-DD') : undefined 
      } 
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.status !== 'all' || 
    filters.priority !== 'all' ||
    filters.assignedTo !== 'all' ||
    filters.category !== 'all' ||
    filters.clientId !== 'all' ||
    filters.dateRange.start ||
    filters.dateRange.end;

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(category => ({ value: category.name, label: category.name })),
  ];

  const clientOptions = [
    { value: 'all', label: 'All Clients' },
    ...clients.map(client => ({ value: client.id, label: client.name })),
  ];

  const staffOptions = [
    { value: 'all', label: 'All Staff' },
    { value: 'unassigned', label: 'Unassigned' },
    ...staff.map(member => ({ value: member.id, label: member.name })),
  ];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            placeholder="Search tickets..."
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
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
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filters.priority}
              onChange={handlePriorityChange}
              label="Priority"
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Assigned To</InputLabel>
            <Select
              value={filters.assignedTo}
              onChange={handleAssignedToChange}
              label="Assigned To"
            >
              {staffOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
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
        <Grid item xs={12} md={3}>
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
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="From"
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
        <Grid item xs={12} md={3}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            startIcon={<ClearIcon />}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TicketFiltersComponent;