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
import { bankAccountSchema } from '../schema';
import { BankAccountFormData } from '../types';

interface BankAccountFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BankAccountFormData) => Promise<void>;
  initialData?: Partial<BankAccountFormData>;
  loading?: boolean;
}

const BankAccountForm: React.FC<BankAccountFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const methods = useForm<BankAccountFormData>({
    resolver: yupResolver(bankAccountSchema),
    defaultValues: {
      name: '',
      accountNumber: '',
      bankName: '',
      accountType: 'checking',
      currency: 'USD',
      openingBalance: 0,
      openingDate: new Date().toISOString().split('T')[0],
      description: '',
      ...initialData,
    },
  });

  const { handleSubmit, reset } = methods;

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        name: '',
        accountNumber: '',
        bankName: '',
        accountType: 'checking',
        currency: 'USD',
        openingBalance: 0,
        openingDate: new Date().toISOString().split('T')[0],
        description: '',
        ...initialData,
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: BankAccountFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const accountTypeOptions = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'loan', label: 'Loan Account' },
    { value: 'investment', label: 'Investment Account' },
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' },
    { value: 'AUD', label: 'Australian Dollar (AUD)' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Bank Account' : 'Add New Bank Account'}
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
                  name="name"
                  label="Account Name"
                  required
                  helperText="Descriptive name for this account"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="accountNumber"
                  label="Account Number"
                  required
                  helperText="Bank account number (can be masked)"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  name="bankName"
                  label="Bank Name"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="accountType"
                  label="Account Type"
                  type="select"
                  options={accountTypeOptions}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  name="currency"
                  label="Currency"
                  type="select"
                  options={currencyOptions}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="openingDate"
                  label="Opening Date"
                  type="date"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  name="openingBalance"
                  label="Opening Balance"
                  type="number"
                  required
                  helperText="Initial balance when account was opened"
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

export default BankAccountForm;