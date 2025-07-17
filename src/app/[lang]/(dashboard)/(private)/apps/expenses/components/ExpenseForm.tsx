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
import { expenseSchema } from '../schema';
import { ExpenseFormData, ExpenseCategory } from '../types';

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  initialData?: Partial<ExpenseFormData>;
  loading?: boolean;
  categories: ExpenseCategory[];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  categories,
}) => {
  const methods = useForm<ExpenseFormData>({
    resolver: yupResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      vendor: '',
      category: '',
      description: '',
      notes: '',
      paymentMethod: 'card',
      reference: '',
      status: 'pending',
      ...initialData,
    },
  });

  const { handleSubmit, reset } = methods;

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        vendor: '',
        category: '',
        description: '',
        notes: '',
        paymentMethod: 'card',
        reference: '',
        status: 'pending',
        ...initialData,
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: ExpenseFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    ...categories.map(category => ({ value: category.name, label: category.name })),
  ];

  const paymentMethodOptions = [
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Pre-approved' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Expense' : 'Add New Expense'}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Expense Details
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  name="date"
                  label="Date"
                  type="date"
                  required
                />
              </Grid>
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
                  name="vendor"
                  label="Vendor/Supplier"
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
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  name="description"
                  label="Description"
                  required
                  helperText="Brief description of the expense"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  name="notes"
                  label="Additional Notes"
                  multiline
                  rows={3}
                  helperText="Any additional details or context"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Payment Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  name="paymentMethod"
                  label="Payment Method"
                  type="select"
                  options={paymentMethodOptions}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="reference"
                  label="Reference Number"
                  helperText="Transaction ID, check number, etc."
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  name="status"
                  label="Status"
                  type="select"
                  options={statusOptions}
                  required
                  helperText="Set to 'Pre-approved' if this expense doesn't need approval"
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
              {loading ? 'Saving...' : (initialData ? 'Update Expense' : 'Add Expense')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ExpenseForm;