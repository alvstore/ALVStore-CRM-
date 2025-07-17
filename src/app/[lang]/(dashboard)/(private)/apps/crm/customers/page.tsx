'use client'

// React Imports
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

// Icons Imports
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import FilterListOutlined from '@mui/icons-material/FilterListOutlined'
import DownloadOutlined from '@mui/icons-material/DownloadOutlined'

// Component Imports
import CustomerListTable from '@/views/apps/ecommerce/customers/list/CustomerListTable'
import AddCustomerDrawer from '@/views/apps/ecommerce/customers/list/AddCustomerDrawer'

// Type Imports
import type { Customer } from '@/types/apps/ecommerceTypes'

// Hook Imports
import { useDebounce } from '@/hooks/useDebounce'

// Customer status options
const statusOptions = [
  { value: '', label: 'Select Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    renderCell: (params: GridRenderCellParams<Customer>) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.contrastText',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          {params.row.name?.charAt(0).toUpperCase() || 'C'}
        </Box>
        <Box>
          <Typography variant='subtitle2'>{params.row.name}</Typography>
          <Typography variant='body2' color='text.secondary'>{params.row.email}</Typography>
        </Box>
      </Box>
    )
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    renderCell: (params: GridRenderCellParams<Customer>) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant='body2'>{params.row.email}</Typography>
      </Box>
    )
  },
  {
    field: 'phone',
    headerName: 'Phone',
    flex: 1,
    renderCell: (params: GridRenderCellParams<Customer>) => (
      <Typography variant='body2'>{params.row.phone || 'N/A'}</Typography>
    )
  },
  {
    field: 'country',
    headerName: 'Country',
    width: 150,
    renderCell: (params: GridRenderCellParams<Customer>) => (
      <Box
        sx={{
          px: 2,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: 'info.light',
          color: 'info.contrastText',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'capitalize'
        }}
      >
        {params.row.country}
      </Box>
    )
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 120,
    renderCell: (params: GridRenderCellParams<Customer>) => (
      <Box
        sx={{
          px: 2,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: params.row.type === 'business' ? 'info.light' : 'success.light',
          color: params.row.type === 'business' ? 'info.contrastText' : 'success.contrastText',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'capitalize'
        }}
      >
        {params.row.type}
      </Box>
    )
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 120,
    renderCell: (params: GridRenderCellParams<Customer>) => (
      <Box
        sx={{
          px: 2,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: 
            params.row.status === 'active' ? 'success.light' :
            params.row.status === 'inactive' ? 'error.light' :
            'warning.light',
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'capitalize'
        }}
      >
        {params.row.status}
      </Box>
    )
  },
  { 
    field: 'createdAt', 
    headerName: 'Created', 
    width: 150,
    valueGetter: (params: { value: string | number | Date }) => 
      new Date(params.value).toLocaleDateString()
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    sortable: false,
    renderCell: (params: GridRenderCellParams<Customer>) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button 
          size='small' 
          variant='outlined'
          onClick={() => router.push(`/apps/crm/customers/${params.row.id}`)}
        >
          View
        </Button>
      </Box>
    )
  }
]

const CustomersPage = () => {
  // States
  const [searchValue, setSearchValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [statusValue, setStatusValue] = useState<string>('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  // Hooks
  const debouncedSearchValue = useDebounce(searchValue, 300)

  // Mock data - in a real app, this would come from an API
  const mockCustomers: Customer[] = [
    {
      id: 1,
      customer: 'John Doe',
      customerId: 'CUST001',
      email: 'john@example.com',
      country: 'United States',
      countryCode: 'US',
      countryFlag: '/images/cards/us.png',
      order: 5,
      totalSpent: 1200,
      avatar: '/images/avatars/1.png',
      status: 'active',
      contact: '+1 234 567 8901'
    },
    {
      id: 2,
      customer: 'Jane Smith',
      customerId: 'CUST002',
      email: 'jane@example.com',
      country: 'United Kingdom',
      countryCode: 'GB',
      countryFlag: '/images/cards/gb.png',
      order: 2,
      totalSpent: 500,
      avatar: '/images/avatars/2.png',
      status: 'inactive',
      contact: '+44 1234 567890'
    },
    {
      id: 3,
      customer: 'Robert Johnson',
      customerId: 'CUST003',
      email: 'robert@example.com',
      country: 'Canada',
      countryCode: 'CA',
      countryFlag: '/images/cards/ca.png',
      order: 8,
      totalSpent: 2300,
      avatar: '/images/avatars/3.png',
      status: 'active',
      contact: '+1 416 555 1234'
    },
    {
      id: 4,
      customer: 'Emily Davis',
      customerId: 'CUST004',
      email: 'emily@example.com',
      country: 'Australia',
      countryCode: 'AU',
      countryFlag: '/images/cards/au.png',
      order: 3,
      totalSpent: 750,
      avatar: '/images/avatars/4.png',
      status: 'inactive',
      contact: '+61 2 9876 5432'
    },
    {
      id: 5,
      customer: 'Michael Brown',
      customerId: 'CUST005',
      email: 'michael@example.com',
      country: 'Germany',
      countryCode: 'DE',
      countryFlag: '/images/cards/de.png',
      order: 12,
      totalSpent: 4500,
      avatar: '/images/avatars/5.png',
      status: 'active',
      contact: '+49 30 12345678'
    }
  ]

  // Filter customers based on search and status
  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = 
      customer.customer.toLowerCase().includes(debouncedSearchValue.toLowerCase()) ||
      customer.email.toLowerCase().includes(debouncedSearchValue.toLowerCase()) ||
      (customer.contact && customer.contact.includes(debouncedSearchValue))
    
    const matchesStatus = statusValue === '' || customer.status === statusValue
    
    return matchesSearch && matchesStatus
  })

  // Handle pagination
  const paginatedCustomers = filteredCustomers.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  )

  // Handle filter
  const handleFilter = (value: string) => {
    setStatusValue(value)
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  // Handle pagination change
  const handlePaginationChange = (newPagination: { pageIndex: number; pageSize: number }) => {
    setPagination(newPagination)
  }

  return (
    <div className='space-y-6'>
      <Card>
        <Box className='p-6'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
              <Typography variant='h5'>Search Filters</Typography>
              <div className='flex flex-col sm:flex-row gap-4'>
                <TextField
                  size='small'
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder='Search customer...'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    className: 'w-full sm:w-64'
                  }}
                />
                <TextField
                  select
                  size='small'
                  value={statusValue}
                  onChange={e => handleFilter(e.target.value)}
                  className='w-full sm:w-48'
                  placeholder='Select Status'
                >
                  {statusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <div className='flex gap-1'>
                  <IconButton>
                    <DownloadOutlined />
                  </IconButton>
                  <IconButton>
                    <FilterListOutlined />
                  </IconButton>
                </div>
              </div>
            </div>
            <Button 
              variant='contained' 
              startIcon={<AddIcon />}
              onClick={() => setAddUserOpen(!addUserOpen)}
              className='w-full sm:w-auto'
            >
              Add Customer
            </Button>
          </div>
        </Box>
        
        <CustomerListTable 
          customerData={filteredCustomers}
        />
      </Card>

      <AddCustomerDrawer 
        open={addUserOpen} 
        handleClose={() => setAddUserOpen(false)}
        setData={() => {}}
      />
    </div>
  )
}

export default CustomersPage
