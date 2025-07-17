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
import { paymentSchema } from '../schema';
import { PaymentFormData, Invoice } from '../types';

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => Promise<void>;
  initialData?: Partial<PaymentFormData>;
  loading?: boolean;
  invoices: Invoice[];
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  invoices,
}) => {
  const methods = useForm<PaymentFormData>({
    resolver: yupResolver(paymentSchema),
    defaultValues: {
      invoiceId: '',
      amount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'card',
      reference: '',
      notes: '',
      status: 'completed',
      ...initialData,
    },
  });

  const { handleSubmit, watch, setValue, reset } = methods;
  const watchedInvoiceId = watch('invoiceId');
  const watchedAmount = watch('amount');

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        invoiceId: '',
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'card',
        reference: '',
        notes: '',
        status: 'completed',
        ...initialData,
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: PaymentFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const selectedInvoice = invoices.find(inv => inv.id === watchedInvoiceId);

  const handleQuickFill = (amount: number) => {
    setValue('amount', amount);
  };

  const invoiceOptions = [
    { value: '', label: 'Select Invoice' },
    ...invoices.map(invoice => ({ 
      value: invoice.id, 
      label: `${invoice.number} - ${invoice.clientName} ($${invoice.balance.toFixed(2)} due)` 
    })),
  ];

  const paymentMethodOptions = [
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
    { value: 'online', label: 'Online Payment' },
  ];

  const statusOptions = [
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending Verification' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Payment' : 'Record New Payment'}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Payment Details
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  name="invoiceId"
                  label="Invoice"
                  type="select"
                  options={invoiceOptions}
                  required
                />
              </Grid>

              {selectedInvoice && (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Invoice Details:
                    </Typography>
                    <Typography variant="body2">
                      • Client: {selectedInvoice.clientName}
                    </Typography>
                    <Typography variant="body2">
                      • Total Amount: ${selectedInvoice.total.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      • Already Paid: ${selectedInvoice.paid.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      • Outstanding Balance: ${selectedInvoice.balance.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      • Due Date: {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                    </Typography>
                  </Alert>
                  
                  <Box display="flex" gap={1} mb={2}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleQuickFill(selectedInvoice.balance)}
                    >
                      Full Amount (${selectedInvoice.balance.toFixed(2)})
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleQuickFill(selectedInvoice.balance / 2)}
                    >
                      Half Amount (${(selectedInvoice.balance / 2).toFixed(2)})
                    </Button>
                  </Box>
                </Grid>
              )}
              
              <Grid item xs={12} md={6}>
                <FormField
                  name="amount"
                  label="Payment Amount ($)"
                  type="number"
                  required
                />
                {selectedInvoice && watchedAmount > selectedInvoice.balance && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    Payment amount exceeds outstanding balance
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="paymentDate"
                  label="Payment Date"
                  type="date"
                  required
                />
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
                  name="status"
                  label="Status"
                  type="select"
                  options={statusOptions}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  name="reference"
                  label="Reference Number"
                  helperText="Transaction ID, check number, confirmation code, etc."
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  name="notes"
                  label="Payment Notes"
                  multiline
                  rows={3}
                  helperText="Any additional details about this payment"
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
              {loading ? 'Saving...' : (initialData ? 'Update Payment' : 'Record Payment')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default PaymentForm;