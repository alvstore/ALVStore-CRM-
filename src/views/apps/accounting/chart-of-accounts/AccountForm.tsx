// React Imports
'use client'
import { useState, useEffect } from 'react'

// MUI Imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Typography,
  IconButton,
  CircularProgress,
  Box,
  Divider,
} from '@mui/material'

// Icons
import { X } from 'mdi-material-ui'

// Type Imports
import type { ChartOfAccount } from '@/types/apps/accountingTypes'

// Form Validation Schema
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// Form Schema
const accountSchema = yup.object().shape({
  code: yup
    .string()
    .required('Account code is required')
    .matches(/^[A-Z0-9-]+$/, 'Only uppercase letters, numbers, and hyphens are allowed'),
  name: yup.string().required('Account name is required'),
  type: yup.string().required('Account type is required'),
  category: yup.string().required('Category is required'),
  parentId: yup.string().nullable(),
  description: yup.string(),
  isActive: yup.boolean().default(true),
})

type FormData = yup.InferType<typeof accountSchema>

// Account Types
const accountTypes = [
  { value: 'asset', label: 'Asset' },
  { value: 'liability', label: 'Liability' },
  { value: 'equity', label: 'Equity' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'expense', label: 'Expense' },
]

const AccountForm = ({
  open,
  onClose,
  account,
  accounts = [],
  categories = [],
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  account?: ChartOfAccount | null
  accounts: ChartOfAccount[]
  categories: string[]
  onSuccess: () => void
}) => {
  // States
  const [loading, setLoading] = useState(false)
  const [parentAccounts, setParentAccounts] = useState<ChartOfAccount[]>([])

  // Form
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(accountSchema),
    defaultValues: {
      code: '',
      name: '',
      type: 'expense',
      category: '',
      parentId: null,
      description: '',
      isActive: true,
    },
  })

  // Watch type to update parent accounts
  const watchType = watch('type')

  // Reset form when account changes
  useEffect(() => {
    if (account) {
      reset({
        code: account.code,
        name: account.name,
        type: account.type,
        category: account.category,
        parentId: account.parentId || null,
        description: account.description || '',
        isActive: account.isActive !== false,
      })
    } else if (open) {
      reset({
        code: '',
        name: '',
        type: 'expense',
        category: categories[0] || '',
        parentId: null,
        description: '',
        isActive: true,
      })
    }
  }, [account, open, reset, categories])

  // Filter parent accounts based on type
  useEffect(() => {
    if (watchType) {
      const filtered = accounts.filter(
        acc => acc.type === watchType && acc.level === 0 && acc.id !== account?.id
      )
      setParentAccounts(filtered)
    } else {
      setParentAccounts([])
    }
  }, [watchType, accounts, account])

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      
      // TODO: Implement API call to save account
      // if (account) {
      //   await updateAccount(account.id, data)
      // } else {
      //   await createAccount(data)
      // }
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving account:', error)
      // TODO: Show error message
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      scroll='body'
    >
      <DialogTitle className='flex flex-col gap-2 text-center p-6'>
        <Box className='flex items-center justify-between'>
          <Typography variant='h4' component='span'>
            {account ? 'Edit Account' : 'Add New Account'}
          </Typography>
          <IconButton size='small' onClick={onClose}>
            <X />
          </IconButton>
        </Box>
        <Typography variant='body2' color='text.secondary'>
          {account ? 'Update the account details below' : 'Fill in the account details below'}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='p-6'>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.code}>
                <Controller
                  name='code'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Account Code'
                      placeholder='e.g. 1000, 2000-100'
                      error={!!errors.code}
                      helperText={errors.code?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.name}>
                <Controller
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Account Name'
                      placeholder='e.g. Cash, Accounts Payable'
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel id='account-type-label'>Account Type</InputLabel>
                <Controller
                  name='type'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId='account-type-label'
                      label='Account Type'
                      error={!!errors.type}
                    >
                      {accountTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.type && (
                  <FormHelperText>{errors.type.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel id='category-label'>Category</InputLabel>
                <Controller
                  name='category'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId='category-label'
                      label='Category'
                      error={!!errors.category}
                    >
                      {categories.map(category => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.category && (
                  <FormHelperText>{errors.category.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {parentAccounts.length > 0 && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='parent-account-label'>Parent Account (Optional)</InputLabel>
                  <Controller
                    name='parentId'
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId='parent-account-label'
                        label='Parent Account (Optional)'
                      >
                        <MenuItem value=''>None</MenuItem>
                        {parentAccounts.map(account => (
                          <MenuItem key={account.id} value={account.id}>
                            {account.code} - {account.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='description'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Description (Optional)'
                      multiline
                      rows={3}
                      placeholder='Enter a description for this account...'
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions className='justify-between p-6'>
          <Button
            variant='outlined'
            color='secondary'
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : 'Save Account'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AccountForm
