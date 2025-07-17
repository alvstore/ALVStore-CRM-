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
  FormControlLabel,
  Checkbox,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { ProductFilters, ProductCategory } from '../types';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
  onClearFilters: () => void;
  categories: ProductCategory[];
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'discontinued', label: 'Discontinued' },
];

const availableTags = ['New', 'Popular', 'Sale', 'Featured', 'Limited', 'Premium', 'Eco-friendly', 'Bestseller'];

const ProductFiltersComponent: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  categories,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: event.target.value });
  };

  const handleCategoryChange = (event: any) => {
    onFiltersChange({ category: event.target.value });
  };

  const handleStatusChange = (event: any) => {
    onFiltersChange({ status: event.target.value });
  };

  const handleLowStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ lowStock: event.target.checked });
  };

  const handleTagsChange = (event: any) => {
    const value = event.target.value;
    onFiltersChange({ tags: typeof value === 'string' ? value.split(',') : value });
  };

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseFloat(event.target.value) : undefined;
    onFiltersChange({ 
      priceRange: { 
        ...filters.priceRange, 
        min: value 
      } 
    });
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseFloat(event.target.value) : undefined;
    onFiltersChange({ 
      priceRange: { 
        ...filters.priceRange, 
        max: value 
      } 
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.category !== 'all' || 
    filters.status !== 'all' ||
    filters.lowStock ||
    filters.tags.length > 0 ||
    filters.priceRange.min !== undefined ||
    filters.priceRange.max !== undefined;

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(category => ({ value: category.name, label: category.name })),
  ];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
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
        <Grid item xs={12} md={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.lowStock}
                onChange={handleLowStockChange}
              />
            }
            label="Low Stock"
          />
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
        <Grid item xs={12} md={1}>
          <TextField
            fullWidth
            label="Min Price"
            type="number"
            size="small"
            value={filters.priceRange.min || ''}
            onChange={handleMinPriceChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <TextField
            fullWidth
            label="Max Price"
            type="number"
            size="small"
            value={filters.priceRange.max || ''}
            onChange={handleMaxPriceChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductFiltersComponent;