// React Imports
'use client'
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

// Icons
import { Magnify, Close } from 'mdi-material-ui'

// Type Imports
import type { ChartOfAccount } from '@/types/apps/accountingTypes'

type FiltersType = {
  search: string
  type: string
  category: string
  status: string
}

const TableFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  categories = []
}: {
  filters: FiltersType
  onFiltersChange: (filters: Partial<FiltersType>) => void
  onClearFilters: () => void
  categories: string[]
}) => {
  // States
  const [searchValue, setSearchValue] = useState(filters.search)

  // Handle search input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ search: searchValue })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchValue, filters.search, onFiltersChange])

  // Account types
  const accountTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'asset', label: 'Asset' },
    { value: 'liability', label: 'Liability' },
    { value: 'equity', label: 'Equity' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'expense', label: 'Expense' },
  ]

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]

  // Check if any filter is applied
  const isFiltered = 
    filters.search !== '' || 
    filters.type !== 'all' || 
    filters.category !== 'all' || 
    filters.status !== 'all'

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          <Grid xs={12} md={3}>
            <TextField
              fullWidth
              variant='outlined'
              placeholder='Search accounts...'
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Magnify fontSize='small' />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid xs={12} md={2}>
            <TextField
              select
              fullWidth
              label='Type'
              value={filters.type}
              onChange={e => onFiltersChange({ type: e.target.value })}
            >
              {accountTypes.map(type => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={12} md={2}>
            <TextField
              select
              fullWidth
              label='Category'
              value={filters.category}
              onChange={e => onFiltersChange({ category: e.target.value })}
            >
              <MenuItem value='all'>All Categories</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={12} md={2}>
            <TextField
              select
              fullWidth
              label='Status'
              value={filters.status}
              onChange={e => onFiltersChange({ status: e.target.value })}
            >
              {statusOptions.map(status => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={12} md={3} className='flex items-center gap-4'>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                onClearFilters()
                setSearchValue('')
              }}
              disabled={!isFiltered}
              startIcon={<Close />}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TableFilters
