'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormField from '@/components/common/FormField';
import { chartOfAccountSchema } from '../schema';
import { ChartOfAccountFormData, ChartOfAccount } from '../types';

interface AccountFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ChartOfAccountFormData) => Promise<void>;
  initialData?: Partial<ChartOfAccountFormData>;
  loading?: boolean;
  parentAccounts: ChartOfAccount[];
  categories: string[];
}

const AccountForm: React.FC<AccountFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  parentAccounts,
  categories,
}) => {
  const methods = useForm<ChartOfAccountFormData>({
    resolver: yupResolver(chartOfAccountSchema),
    defaultValues: {
      code: '',
      name: '',
      type: 'asset',
      category: '',
      parentId: '',
      description: '',
      ...initialData,
    },
  });

  const { handleSubmit, watch, reset } = methods;
  const watchedType = watch('type');

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        code: '',
        name: '',
        type: 'asset',
        category: '',
        parentId: '',
        description: '',
        ...initialData,
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: ChartOfAccountFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const typeOptions = [
    { value: 'asset', label: 'Asset' },
    { value: 'liability', label: 'Liability' },
    { value: 'equity', label: 'Equity' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'expense', label: 'Expense' },
  ];

  const filteredParentAccounts = parentAccounts
    .filter(account => account.type === watchedType && account.level === 0)
    .map(account => ({
      value: account.id,
      label: `${account.code} - ${account.name}`,
    }));

  const parentOptions = [
    { value: '', label: 'No Parent (Top Level)' },
    ...filteredParentAccounts,
  ];

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    ...categories.map(category => ({ value: category, label: category })),
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Account' : 'Add New Account'}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  name="code"
                  label="Account Code"
                  required
                  helperText="Numeric code for this account (e.g., 1001)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="name"
                  label="Account Name"
                  required
                  helperText="Descriptive name for this account"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  name="type"
                  label="Account Type"
                  type="select"
                  options={typeOptions}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="category"
                  label="Category"
                  type="select"
                  options={categoryOptions}
                  required
                  helperText="Group accounts by category (e.g., Current Assets)"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  name="parentId"
                  label="Parent Account"
                  type="select"
                  options={parentOptions}
                  helperText="Select a parent account or leave empty for top-level account"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  helperText="Optional description or notes about this account"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Saving...' : (initialData ? 'Update Account' : 'Add Account')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default AccountForm;