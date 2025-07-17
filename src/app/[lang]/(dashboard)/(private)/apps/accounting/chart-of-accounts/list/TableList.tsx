'use client'

// React Imports
import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
  ColumnDef,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  FilterFn
} from '@tanstack/react-table'

// Type Imports
import type { ChartOfAccount } from '@/types/apps/accountingTypes'

// Component Imports
import TablePagination from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Icons
import { DotsVertical, Pencil, TrashCan } from 'mdi-material-ui'

// Utils
import { formatCurrency } from '@/utils/format'

// Column Definitions
type ChartOfAccountWithActions = ChartOfAccount & {
  actions?: string
}

// Filter function for search
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const TableList = ({
  data,
  loading,
  onEdit,
  onDelete,
}: {
  data: ChartOfAccount[]
  loading: boolean
  onEdit: (account: ChartOfAccount) => void
  onDelete: (account: ChartOfAccount) => void
}) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({})

  // Hooks
  const router = useRouter()

  // Handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, accountId: string) => {
    event.stopPropagation()
    setAnchorEl(prev => ({ ...prev, [accountId]: event.currentTarget }))
  }

  // Handle menu close
  const handleMenuClose = (accountId: string) => {
    setAnchorEl(prev => ({ ...prev, [accountId]: null }))
  }

  // Get account type color
  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset': return 'primary'
      case 'liability': return 'warning'
      case 'equity': return 'success'
      case 'revenue': return 'info'
      case 'expense': return 'error'
      default: return 'default'
    }
  }

  // Define columns
  const columns = useMemo<ColumnDef<ChartOfAccount>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => (
          <Typography noWrap className='font-medium'>
            {row.original.code}
          </Typography>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Account Name',
        cell: ({ row }) => (
          <Box sx={{ pl: row.original.level * 2 }}>
            <Typography 
              variant={row.original.level === 0 ? 'subtitle1' : 'body2'}
              fontWeight={row.original.level === 0 ? '600' : 'normal'}
            >
              {row.original.name}
            </Typography>
            {row.original.parentName && (
              <Typography variant='caption' color='text.secondary'>
                Parent: {row.original.parentName}
              </Typography>
            )}
          </Box>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
          <Chip
            label={row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)}
            color={getAccountTypeColor(row.original.type) as any}
            size='small'
          />
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
      },
      {
        accessorKey: 'balance',
        header: 'Balance',
        cell: ({ row }) => (
          <Typography 
            variant='subtitle2' 
            fontWeight='bold'
            color={row.original.balance >= 0 ? 'success.main' : 'error.main'}
          >
            {formatCurrency(row.original.balance)}
          </Typography>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <Box className='flex items-center'>
            <IconButton
              size='small'
              onClick={(e) => {
                e.stopPropagation()
                handleMenuOpen(e, row.original.id)
              }}
            >
              <DotsVertical />
            </IconButton>
            <Menu
              anchorEl={anchorEl[row.original.id]}
              open={Boolean(anchorEl[row.original.id])}
              onClose={() => handleMenuClose(row.original.id)}
              onClick={(e) => e.stopPropagation()}
            >
              <MenuItem 
                onClick={() => {
                  onEdit(row.original)
                  handleMenuClose(row.original.id)
                }}
              >
                <Pencil className='mr-2' fontSize='small' />
                Edit
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  onDelete(row.original)
                  handleMenuClose(row.original.id)
                }}
                className='text-error hover:bg-errorLight hover:text-error'
              >
                <TrashCan className='mr-2' fontSize='small' />
                Delete
              </MenuItem>
            </Menu>
          </Box>
        ),
      },
    ],
    [anchorEl, onEdit, onDelete]
  )

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // Handle row click
  const handleRowClick = (accountId: string) => {
    router.push(`/apps/accounting/chart-of-accounts/${accountId}`)
  }

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <TableRow 
                  key={row.id}
                  hover 
                  onClick={() => handleRowClick(row.original.id)}
                  className='cursor-pointer'
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='text-center'>
                  {loading ? 'Loading...' : 'No accounts found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <TablePaginationComponent table={table} />
    </Card>
  )
}

export default TableList
