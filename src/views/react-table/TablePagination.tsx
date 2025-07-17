'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

// Icon Imports
import ChevronLeft from 'mdi-material-ui/ChevronLeft'
import ChevronRight from 'mdi-material-ui/ChevronRight'
import ChevronDoubleLeft from 'mdi-material-ui/ChevronDoubleLeft'
import ChevronDoubleRight from 'mdi-material-ui/ChevronDoubleRight'

// Styled Components
const PaginationContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '16px',
  borderTop: '1px solid var(--mui-palette-divider)',
  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
    margin: 0,
  },
  '& .MuiTablePagination-toolbar': {
    padding: 0,
  },
  '& .MuiTablePagination-actions': {
    marginLeft: '8px',
  },
})

// Types
interface TablePaginationProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  rowsPerPageOptions?: number[]
  className?: string
}

const CustomTablePagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
  className = '',
}: TablePaginationProps) => {
  // Calculate total pages
  const totalPages = Math.ceil(count / rowsPerPage) - 1

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10))
    onPageChange(0) // Reset to first page when rows per page changes
  }

  // Memoize the label display
  const labelDisplayedRows = useMemo(
    () =>
      ({ from, to, count }: { from: number; to: number; count: number }) => {
        return `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
      },
    []
  )

  return (
    <PaginationContainer className={className}>
      <TablePagination
        component='div'
        count={count}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        labelDisplayedRows={labelDisplayedRows}
        labelRowsPerPage='Rows:'
        nextIconButtonProps={{
          disabled: page >= totalPages,
          'aria-label': 'next page',
        }}
        backIconButtonProps={{
          disabled: page <= 0,
          'aria-label': 'previous page',
        }}
        ActionsComponent={({ onPageChange, page, count, rowsPerPage }) => {
          return (
            <div className='flex items-center'>
              <IconButton
                onClick={() => onPageChange(null as any, 0)}
                disabled={page === 0}
                aria-label='first page'
              >
                <ChevronDoubleLeft />
              </IconButton>
              <IconButton
                onClick={() => onPageChange(null as any, page - 1)}
                disabled={page === 0}
                aria-label='previous page'
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={() => onPageChange(null as any, page + 1)}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label='next page'
              >
                <ChevronRight />
              </IconButton>
              <IconButton
                onClick={() => onPageChange(null as any, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label='last page'
              >
                <ChevronDoubleRight />
              </IconButton>
            </div>
          )
        }}
      />
    </PaginationContainer>
  )
}

export default CustomTablePagination
