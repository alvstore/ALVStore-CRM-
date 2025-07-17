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
import { ClientFilters } from '../types';

interface ClientFiltersProps {
  filters: ClientFilters;
  onFiltersChange: (filters: Partial<ClientFilters>) => void;
  onClearFilters: () => void;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'lead', label: 'Lead' },
];

const availableTags = ['VIP', 'Tech', 'Design', 'Marketing', 'Manufacturing', 'Bulk', 'Enterprise', 'Startup'];

const ClientFiltersComponent: React.FC<ClientFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: event.target.value });
  };

  const handleStatusChange = (event: any) => {
    onFiltersChange({ status: event.target.value });
  };

  const handleTagsChange = (event: any) => {
    const value = event.target.value;
    onFiltersChange({ tags: typeof value === 'string' ? value.split(',') : value });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.tags.length > 0;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search clients..."
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

export default ClientFiltersComponent;