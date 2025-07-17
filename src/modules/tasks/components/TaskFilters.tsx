'use client';

import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Paper,
  Grid,
  Button,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TaskFilters } from '../types';
import dayjs from 'dayjs';

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: Partial<TaskFilters>) => void;
  onClearFilters: () => void;
  staff: Array<{ id: string; name: string; role: string }>;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const priorityOptions = [
  { value: 'all', label: 'All Priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const availableTags = ['bug', 'feature', 'documentation', 'design', 'research', 'meeting', 'client', 'internal', 'urgent'];

const TaskFiltersComponent: React.FC<TaskFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
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

  const handleTagsChange = (event: any) => {
    const value = event.target.value;
    onFiltersChange({ tags: typeof value === 'string' ? value.split(',') : value });
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
    filters.priority !== 'all' ||
    filters.assignedTo !== 'all' ||
    filters.tags.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end;

  const assignedToOptions = [
    { value: 'all', label: 'All Staff' },
    { value: '', label: 'Unassigned' },
    ...staff.map(member => ({ value: member.id, label: member.name })),
  ];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            placeholder="Search tasks..."
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
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Assigned To</InputLabel>
            <Select
              value={filters.assignedTo}
              onChange={handleAssignedToChange}
              label="Assigned To"
            >
              {assignedToOptions.map((option) => (
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
              label="Due From"
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
              label="Due To"
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
        <Grid item xs={12} md={10}>
          <FormControl fullWidth>
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={filters.tags}
              onChange={handleTagsChange}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TaskFiltersComponent;