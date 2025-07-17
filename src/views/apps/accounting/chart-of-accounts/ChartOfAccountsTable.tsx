'use client'

// React Imports
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

// Icons
import DotsVertical from 'mdi-material-ui/DotsVertical'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'

// Component Imports
import { DataTable, TableFilters } from '@/views/react-table'

// Types
import { ChartOfAccount } from '@/types/apps/accountingTypes'

// Styled Components
const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  fontWeight: 500,
  textTransform: 'capitalize',
  '& .MuiChip-label': {
    color: 'white',
  },
  backgroundColor:
    status === 'active'
      ? theme.palette.success.main + '1f'
      : status === 'inactive'
      ? theme.palette.error.main + '1f'
      : theme.palette.grey[500] + '1f',
  color:
    status === 'active'
      ? theme.palette.success.main
      : status === 'inactive'
      ? theme.palette.error.main
      : theme.palette.grey[500],
  '& .MuiChip-label': {
    color: 'inherit',
  },
}))

// Types
interface ChartOfAccountsTableProps {
  data: ChartOfAccount[]
  loading: boolean
  onEdit: (account: ChartOfAccount) => void
  onDelete: (account: ChartOfAccount) => void
  onView: (account: ChartOfAccount) => void
  onCreate: () => void
  onFilterChange: (filters: Record<string, any>) => void
  onResetFilters: () => void
}

const ChartOfAccountsTable = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  onCreate,
  onFilterChange,
  onResetFilters,
}: ChartOfAccountsTableProps) => {
  // States
  const [rowOptions, setRowOptions] = useState<null | HTMLElement>(null)
  const [selectedRow, setSelectedRow] = useState<ChartOfAccount | null>(null)

  // Row options handler
  const handleRowOptionsClick = (event: React.MouseEvent<HTMLElement>, row: ChartOfAccount) => {
    setSelectedRow(row)
    setRowOptions(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setRowOptions(null)
  }

  // Handle view
  const handleView = () => {
    if (selectedRow) {
      onView(selectedRow)
      handleRowOptionsClose()
    }
  }

  // Handle edit
  const handleEdit = () => {
    if (selectedRow) {
      onEdit(selectedRow)
      handleRowOptionsClose()
    }
  }

  // Handle delete
  const handleDelete = () => {
    if (selectedRow) {
      onDelete(selectedRow)
      handleRowOptionsClose()
    }
  }

  // Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }: { row: { original: ChartOfAccount } }) => (
          <Typography variant='body2'>{row.original.code}</Typography>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }: { row: { original: ChartOfAccount } }) => (
          <Typography variant='body2'>{row.original.name}</Typography>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }: { row: { original: ChartOfAccount } }) => (
          <Typography variant='body2'>{row.original.type}</Typography>
        ),
      },
      {
        accessorKey: 'balance',
        header: 'Balance',
        cell: ({ row }: { row: { original: ChartOfAccount } }) => (
          <Typography variant='body2'>${row.original.balance.toFixed(2)}</Typography>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }: { row: { original: ChartOfAccount } }) => (
          <StatusChip
            size='small'
            label={row.original.status}
            status={row.original.status}
          />
        ),
      },
      {
        id: 'actions',
        cell: ({ row }: { row: { original: ChartOfAccount } }) => (
          <Box className='flex items-center'>
            <IconButton
              size='small'
              onClick={(e) => {
                e.stopPropagation()
                handleRowOptionsClick(e, row.original)
              }}
            >
              <DotsVertical />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  )

  // Filter options
  const filterOptions = [
    {
      field: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
    {
      field: 'type',
      label: 'Account Type',
      type: 'select' as const,
      options: [
        { value: 'asset', label: 'Asset' },
        { value: 'liability', label: 'Liability' },
        { value: 'equity', label: 'Equity' },
        { value: 'revenue', label: 'Revenue' },
        { value: 'expense', label: 'Expense' },
      ],
    },
    {
      field: 'search',
      label: 'Search',
      type: 'text' as const,
      placeholder: 'Search by name or code...',
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        title='Chart of Accounts'
        description='Manage your chart of accounts'
        actionButton={{
          label: 'Add Account',
          onClick: onCreate,
        }}
        onRowClick={onView}
        searchPlaceholder='Search accounts...'
        enablePagination
        pageSize={10}
        loading={loading}
      />
      
      {/* Row Options Menu */}
      <Menu
        keepMounted
        anchorEl={rowOptions}
        open={Boolean(rowOptions)}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleView} className='flex items-center gap-2'>
          <EyeOutline fontSize='small' />
          View
        </MenuItem>
        <MenuItem onClick={handleEdit} className='flex items-center gap-2'>
          <PencilOutline fontSize='small' />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} className='flex items-center gap-2 text-error'>
          <DeleteOutline fontSize='small' />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

export default ChartOfAccountsTable
