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
  Alert,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormField from '@/components/common/FormField';
import { transactionSchema } from '../schema';
import { TransactionFormData, BankAccount } from '../types';

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  loading?: boolean;
  bankAccounts: BankAccount[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  bankAccounts,
}) => {
  const methods = useForm<TransactionFormData>({
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      accountId: '',
      type: 'deposit',
      amount: 0,
      description: '',
      reference: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      transferToAccountId: '',
    },
  });

  const { handleSubmit, watch, reset } = methods;
  const watchedType = watch('type');
  const watchedAccountId = watch('accountId');

  React.useEffect(() => {
    if (open) {
      reset({
        accountId: '',
        type: 'deposit',
        amount: 0,
        description: '',
        reference: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        transferToAccountId: '',
      });
    }
  }, [open, reset]);

  const handleFormSubmit = async (data: TransactionFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const accountOptions = [
    { value: '', label: 'Select Account' },
    ...bankAccounts.map(account => ({ 
      value: account.id, 
      label: `${account.name} (${account.accountNumber}) - $${account.balance.toFixed(2)}` 
    })),
  ];

  const transferAccountOptions = [
    { value: '', label: 'Select Destination Account' },
    ...bankAccounts
      .filter(account => account.id !== watchedAccountId)
      .map(account => ({ 
        value: account.id, 
        label: `${account.name} (${account.accountNumber}) - $${account.balance.toFixed(2)}` 
      })),
  ];

  const typeOptions = [
    { value: 'deposit', label: 'Deposit (Money In)' },
    { value: 'withdraw', label: 'Withdrawal (Money Out)' },
    { value: 'transfer', label: 'Transfer Between Accounts' },
  ];

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'Revenue', label: 'Revenue' },
    { value: 'Office Supplies', label: 'Office Supplies' },
    { value: 'Rent', label: 'Rent' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Equipment', label: 'Equipment' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Professional Services', label: 'Professional Services' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Loan Payment', label: 'Loan Payment' },
    { value: 'Tax Payment', label: 'Tax Payment' },
    { value: 'Other', label: 'Other' },
  ];

  const selectedAccount = bankAccounts.find(account => account.id === watchedAccountId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Record Bank Transaction
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Transaction Details
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  name="accountId"
                  label="Bank Account"
                  type="select"
                  options={accountOptions}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="type"
                  label="Transaction Type"
                  type="select"
                  options={typeOptions}
                  required
                />
              </Grid>

              {selectedAccount && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography variant="subtitle2" gutterBottom>
                      Account Information:
                    </Typography>
                    <Typography variant="body2">
                      • Account: {selectedAccount.name} ({selectedAccount.accountNumber})
                    </Typography>
                    <Typography variant="body2">
                      • Current Balance: ${selectedAccount.balance.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      • Bank: {selectedAccount.bankName}
                    </Typography>
                  </Alert>
                </Grid>
              )}
              
              <Grid item xs={12} md={6}>
                <FormField
                  name="amount"
                  label="Amount ($)"
                  type="number"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="date"
                  label="Transaction Date"
                  type="date"
                  required
                />
              </Grid>

              {watchedType === 'transfer' && (
                <Grid item xs={12}>
                  <FormField
                    name="transferToAccountId"
                    label="Transfer To Account"
                    type="select"
                    options={transferAccountOptions}
                    required
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <FormField
                  name="description"
                  label="Description"
                  required
                  helperText="Brief description of the transaction"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  name="reference"
                  label="Reference Number"
                  helperText="Check number, transaction ID, etc."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="category"
                  label="Category"
                  type="select"
                  options={categoryOptions}
                  helperText="Transaction category for reporting"
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
              {loading ? 'Recording...' : 'Record Transaction'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default TransactionForm;