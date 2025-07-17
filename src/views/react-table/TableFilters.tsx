'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Types
type OptionType = {
  value: string | number
  label: string
}

type FilterType = {
  field: string
  label: string
  type: 'text' | 'select' | 'date' | 'number'
  options?: OptionType[]
  placeholder?: string
  width?: number
}

interface TableFiltersProps<T> {
  filters: FilterType[]
  onFilterChange: (filters: Record<string, any>) => void
  onReset?: () => void
  initialFilters?: Record<string, any>
  className?: string
}

const TableFilters = <T,>({
  filters,
  onFilterChange,
  onReset,
  initialFilters = {},
  className = '',
}: TableFiltersProps<T>) => {
  // States
  const [filterValues, setFilterValues] = useState<Record<string, any>>(initialFilters)

  // Handle filter change
  const handleFilterChange = (field: string, value: any) => {
    const newFilters = { ...filterValues, [field]: value }
    setFilterValues(newFilters)
    onFilterChange(newFilters)
  }

  // Handle reset
  const handleReset = () => {
    setFilterValues({})
    onReset?.()
  }

  // Render filter input based on type
  const renderFilterInput = (filter: FilterType) => {
    const { field, type, options = [], placeholder, width = 200 } = filter
    const value = filterValues[field] || ''

    switch (type) {
      case 'select':
        return (
          <CustomTextField
            select
            size='small'
            value={value}
            onChange={e => handleFilterChange(field, e.target.value)}
            className='is-[200px]'
            placeholder={placeholder}
          >
            <MenuItem value=''>Select {filter.label}</MenuItem>
            {options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomTextField>
        )
      case 'date':
        return (
          <CustomTextField
            type='date'
            size='small'
            value={value}
            onChange={e => handleFilterChange(field, e.target.value)}
            className='is-[200px]'
            InputLabelProps={{
              shrink: true,
            }}
          />
        )
      case 'number':
        return (
          <CustomTextField
            type='number'
            size='small'
            value={value}
            onChange={e => handleFilterChange(field, e.target.value)}
            className='is-[150px]'
            placeholder={placeholder}
            inputProps={{ min: 0 }}
          />
        )
      default:
        return (
          <CustomTextField
            size='small'
            value={value}
            onChange={e => handleFilterChange(field, e.target.value)}
            className='is-[200px]'
            placeholder={placeholder || `Search ${filter.label}...`}
          />
        )
    }
  }

  return (
    <div className={`flex flex-wrap items-center gap-4 p-6 ${className}`}>
      {filters.map(filter => (
        <div key={filter.field} className='flex flex-col gap-1'>
          <label className='text-sm text-textSecondary'>{filter.label}</label>
          {renderFilterInput(filter)}
        </div>
      ))}
      <div className='flex items-end gap-2 ml-auto'>
        <Button variant='tonal' color='secondary' onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  )
}

export default TableFilters
