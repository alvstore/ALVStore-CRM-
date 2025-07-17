'use client'

// React Imports
import React, { useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  FilterFn
} from '@tanstack/react-table'
import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Styled Components
const TableContainer = styled('div')({
  width: '100%',
  overflowX: 'auto',
  '& .MuiTable-root': {
    width: '100%',
    borderCollapse: 'collapse',
    '& th, & td': {
      padding: '12px 16px',
      borderBottom: '1px solid var(--mui-palette-divider)',
      textAlign: 'left',
    },
    '& th': {
      fontWeight: 600,
      backgroundColor: 'var(--mui-palette-action-hover)',
    },
    '& tr:hover': {
      backgroundColor: 'var(--mui-palette-action-hover)',
    },
  },
})

// Types
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title?: string
  description?: string
  actionButton?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  enablePagination?: boolean
  pageSize?: number
  searchPlaceholder?: string
  onRowClick?: (row: TData) => void
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

function DataTable<TData, TValue>({
  columns,
  data,
  title,
  description,
  actionButton,
  enablePagination = true,
  pageSize = 10,
  searchPlaceholder = 'Search...',
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  // Set default page size
  React.useEffect(() => {
    if (enablePagination) {
      table.setPageSize(pageSize)
    }
  }, [enablePagination, pageSize])

  return (
    <Card>
      <div className='flex flex-wrap items-center justify-between gap-4 p-6'>
        <div>
          {title && (
            <Typography variant='h5' className='mbe-1'>
              {title}
            </Typography>
          )}
          {description && <Typography variant='body2'>{description}</Typography>}
        </div>
        <div className='flex items-center gap-4'>
          {actionButton && (
            <Button
              variant='contained'
              startIcon={actionButton.icon}
              onClick={actionButton.onClick}
            >
              {actionButton.label}
            </Button>
          )}
        </div>
      </div>
      <div className='p-6'>
        <div className='flex justify-between items-center mb-4'>
          <CustomTextField
            size='small'
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className='is-48'
          />
        </div>
        <TableContainer>
          <table className='MuiTable-root'>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  style={onRowClick ? { cursor: 'pointer' } : {}}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
        {enablePagination && (
          <div className='flex items-center justify-between mt-4'>
            <div className='text-sm text-textSecondary'>
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component='div'
              count={table.getFilteredRowModel().rows.length}
              rowsPerPage={table.getState().pagination.pageSize}
              page={table.getState().pagination.pageIndex}
              onPageChange={(_, page) => table.setPageIndex(page)}
              onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
            />
          </div>
        )}
      </div>
    </Card>
  )
}

export default DataTable
