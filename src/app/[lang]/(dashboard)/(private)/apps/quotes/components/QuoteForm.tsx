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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormField from '@/components/common/FormField';
import { quoteSchema } from '../schema';
import { QuoteFormData, QuoteItem } from '../types';

interface QuoteFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: QuoteFormData) => Promise<void>;
  initialData?: Partial<QuoteFormData>;
  loading?: boolean;
  clients: Array<{ id: string; name: string; email: string }>;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  clients,
}) => {
  const methods = useForm<QuoteFormData>({
    resolver: yupResolver(quoteSchema),
    defaultValues: {
      clientId: '',
      items: [
        {
          id: '1',
          description: '',
          quantity: 1,
          unitPrice: 0,
          total: 0,
        },
      ],
      taxRate: 10,
      discountType: 'percentage',
      discountValue: 0,
      validUntil: '',
      notes: '',
      terms: '',
      status: 'draft',
      ...initialData,
    },
  });

  const { handleSubmit, watch, setValue, reset, control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedTaxRate = watch('taxRate');
  const watchedDiscountType = watch('discountType');
  const watchedDiscountValue = watch('discountValue');

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        clientId: '',
        items: [
          {
            id: '1',
            description: '',
            quantity: 1,
            unitPrice: 0,
            total: 0,
          },
        ],
        taxRate: 10,
        discountType: 'percentage',
        discountValue: 0,
        validUntil: '',
        notes: '',
        terms: '',
        status: 'draft',
        ...initialData,
      });
    }
  }, [open, initialData, reset]);

  // Calculate item totals
  React.useEffect(() => {
    watchedItems.forEach((item, index) => {
      const total = item.quantity * item.unitPrice;
      if (total !== item.total) {
        setValue(`items.${index}.total`, total);
      }
    });
  }, [watchedItems, setValue]);

  const handleFormSubmit = async (data: QuoteFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const addItem = () => {
    append({
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const subtotal = watchedItems.reduce((sum, item) => sum + (item.total || 0), 0);
  const discountAmount = watchedDiscountType === 'percentage' 
    ? (subtotal * (watchedDiscountValue || 0)) / 100
    : (watchedDiscountValue || 0);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * (watchedTaxRate || 0)) / 100;
  const total = taxableAmount + taxAmount;

  const clientOptions = [
    { value: '', label: 'Select Client' },
    ...clients.map(client => ({ value: client.id, label: `${client.name} (${client.email})` })),
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Send to Client' },
  ];

  const discountTypeOptions = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount ($)' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Quote' : 'Create New Quote'}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Client Selection */}
              <Grid item xs={12} md={6}>
                <FormField
                  name="clientId"
                  label="Client"
                  type="select"
                  options={clientOptions}
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

              {/* Items Section */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Quote Items</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addItem}
                  >
                    Add Item
                  </Button>
                </Box>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell width="120px">Quantity</TableCell>
                        <TableCell width="120px">Unit Price</TableCell>
                        <TableCell width="120px">Total</TableCell>
                        <TableCell width="60px">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              name={`items.${index}.description`}
                              label=""
                              placeholder="Item description"
                              required
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              name={`items.${index}.quantity`}
                              label=""
                              type="number"
                              required
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              name={`items.${index}.unitPrice`}
                              label=""
                              type="number"
                              required
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ pt: 2 }}>
                              ${(watchedItems[index]?.total || 0).toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => removeItem(index)}
                              disabled={fields.length === 1}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Calculations */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="discountType"
                      label="Discount Type"
                      type="select"
                      options={discountTypeOptions}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="discountValue"
                      label={`Discount ${watchedDiscountType === 'percentage' ? '(%)' : '($)'}`}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormField
                      name="taxRate"
                      label="Tax Rate (%)"
                      type="number"
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Totals Summary */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }} variant="outlined">
                  <Typography variant="h6" gutterBottom>Quote Summary</Typography>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Subtotal:</Typography>
                    <Typography>${subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Discount:</Typography>
                    <Typography>-${discountAmount.toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Tax:</Typography>
                    <Typography>${taxAmount.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">${total.toFixed(2)}</Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Additional Information */}
              <Grid item xs={12} md={6}>
                <FormField
                  name="validUntil"
                  label="Valid Until"
                  type="date"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormField
                  name="notes"
                  label="Notes"
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <FormField
                  name="terms"
                  label="Terms & Conditions"
                  multiline
                  rows={3}
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
              {loading ? 'Saving...' : (initialData ? 'Update Quote' : 'Create Quote')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default QuoteForm;