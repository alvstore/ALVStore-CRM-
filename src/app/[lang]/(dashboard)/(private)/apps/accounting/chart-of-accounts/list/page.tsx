// React Imports
'use client'
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Add as AddIcon } from '@mui/icons-material'

// Component Imports
import TableList from './TableList'
import TableFilters from './TableFilters'
import AccountForm from '@/views/apps/accounting/chart-of-accounts/AccountForm'
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'

// Type Imports
import type { ChartOfAccount } from '@/types/apps/accountingTypes'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Server Action Imports
import { getChartOfAccounts } from '@/app/server/actions/accounting/accountingActions'

const ChartOfAccountsList = () => {
  // States
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<ChartOfAccount | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    status: 'all',
  })

  // Hooks
  const { settings } = useSettings()

  // Fetch accounts on component mount and when filters change
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true)
        const data = await getChartOfAccounts(filters)
        setAccounts(data)
      } catch (error) {
        console.error('Error fetching chart of accounts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [filters])

  // Handle filters change
  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      status: 'all',
    })
  }

  // Handle edit account
  const handleEditAccount = (account: ChartOfAccount) => {
    setEditingAccount(account)
    setFormOpen(true)
  }

  // Handle delete account
  const handleDeleteClick = (account: ChartOfAccount) => {
    setAccountToDelete(account)
    setDeleteDialogOpen(true)
  }

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!accountToDelete) return
    
    try {
      // TODO: Implement delete account API call
      // await deleteAccount(accountToDelete.id)
      setDeleteDialogOpen(false)
      setAccountToDelete(null)
      // TODO: Show success message
    } catch (error) {
      console.error('Error deleting account:', error)
      // TODO: Show error message
    }
  }

  // Get unique categories
  const categories = [...new Set(accounts.map(account => account.category))]

  return (
    <Grid container spacing={6}>
      <Grid xs={12}>
        <Box className='flex items-center justify-between gap-4 flex-wrap'>
          <Typography variant='h4'>Chart of Accounts</Typography>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Add Account
          </Button>
        </Box>
      </Grid>
      
      <Grid xs={12}>
        <TableFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          categories={categories}
        />
      </Grid>
      
      <Grid xs={12}>
        <TableList 
          data={accounts} 
          loading={loading}
          onEdit={handleEditAccount}
          onDelete={handleDeleteClick}
        />
      </Grid>
      
      {/* Account Form Dialog */}
      <AccountForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingAccount(null)
        }}
        account={editingAccount}
        accounts={accounts}
        categories={categories}
        onSuccess={() => {
          setFormOpen(false)
          setEditingAccount(null)
          // TODO: Refresh data
        }}
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete Account'
        content={`Are you sure you want to delete account "${accountToDelete?.code} - ${accountToDelete?.name}"? This action cannot be undone.`}
        confirmText='Delete'
        cancelText='Cancel'
        type='delete'
      />
    </Grid>
  )
}

export default ChartOfAccountsList
