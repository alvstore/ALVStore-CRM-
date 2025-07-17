import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<GeneralLedgerEntryType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'entryDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('entryDate'))
      return <div className="font-medium">{format(date, 'MMM d, yyyy')}</div>
    },
  },
  {
    accessorKey: 'journalEntryReference',
    header: 'Reference',
    cell: ({ row }) => {
      const reference = row.getValue('journalEntryReference') as string
      return <div className="font-medium">{reference || 'N/A'}</div>
    },
  },
  {
    accessorKey: 'account',
    header: 'Account',
    cell: ({ row }) => {
      const accountCode = row.original.accountCode
      const accountName = row.original.accountName
      return (
        <div className="space-y-1">
          <div className="font-medium">{accountName}</div>
          <div className="text-sm text-muted-foreground">{accountCode}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return <div className="max-w-[300px] truncate">{description || 'No description'}</div>
    },
  },
  {
    accessorKey: 'debit',
    header: () => <div className="text-right">Debit</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('debit'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)

      return (
        <div className="text-right font-medium">
          {amount > 0 ? formatted : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'credit',
    header: () => <div className="text-right">Credit</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('credit'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)

      return (
        <div className="text-right font-medium">
          {amount > 0 ? formatted : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'balance',
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => {
      const balance = parseFloat(row.getValue('balance'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Math.abs(balance))

      return (
        <div className={`text-right font-medium ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {balance >= 0 ? 'DR ' : 'CR '}{formatted}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const entry = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(entry.id)}
            >
              Copy entry ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // Navigate to journal entry
                window.open(`/accounting/journal-entries/${entry.journalEntryId}`, '_blank')
              }}
            >
              View Journal Entry
            </DropdownMenuItem>
            <DropdownMenuItem>View Account Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
