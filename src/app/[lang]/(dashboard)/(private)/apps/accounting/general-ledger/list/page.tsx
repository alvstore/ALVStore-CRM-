'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/views/table/DataTable'
import { columns } from './columns'
import { getGeneralLedgerEntries } from '@/fake-db/apps/accounting/generalLedger'
import { cn } from '@/lib/utils'

export default function GeneralLedgerPage() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })
  const [accountType, setAccountType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Get ledger entries with filters
  const { entries, summary } = useMemo(() => {
    const data = getGeneralLedgerEntries({
      startDate: dateRange?.from,
      endDate: dateRange?.to,
      search: searchTerm,
      accountType: accountType === 'all' ? undefined : accountType,
    })

    // Apply pagination
    const startIndex = (page - 1) * pageSize
    const paginatedData = data.slice(startIndex, startIndex + pageSize)

    return {
      entries: paginatedData,
      summary: {
        totalDebit: data.reduce((sum, entry) => sum + entry.debit, 0),
        totalCredit: data.reduce((sum, entry) => sum + entry.credit, 0),
        totalEntries: data.length,
      },
      totalItems: data.length,
    }
  }, [dateRange, accountType, searchTerm, page, pageSize])

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    setPage(1) // Reset to first page when filters change
  }

  const handleAccountTypeChange = (value: string) => {
    setAccountType(value)
    setPage(1) // Reset to first page when filters change
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPage(1) // Reset to first page when search changes
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">General Ledger</h1>
          <p className="text-muted-foreground">View and manage all financial transactions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push('/accounting/journal-entries/new')}>
            New Journal Entry
          </Button>
          <Button variant="outline" onClick={() => {}}>
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Debit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(summary.totalDebit)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Credit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(summary.totalCredit)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Difference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(summary.totalDebit - summary.totalCredit)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalEntries}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                All transactions within the selected date range
              </CardDescription>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <div className="w-full sm:w-64">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateRange && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'MMM d, yyyy')} -{' '}
                            {format(dateRange.to, 'MMM d, yyyy')}
                          </>
                        ) : (
                          format(dateRange.from, 'MMM d, yyyy')
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateRangeSelect}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Select value={accountType} onValueChange={handleAccountTypeChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Account Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ASSET">Assets</SelectItem>
                  <SelectItem value="LIABILITY">Liabilities</SelectItem>
                  <SelectItem value="EQUITY">Equity</SelectItem>
                  <SelectItem value="REVENUE">Revenue</SelectItem>
                  <SelectItem value="EXPENSE">Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={entries}
            searchKey="description"
            pageSize={pageSize}
            totalItems={summary.totalEntries}
            onPaginationChange={(newPage, newPageSize) => {
              setPage(newPage)
              setPageSize(newPageSize)
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
