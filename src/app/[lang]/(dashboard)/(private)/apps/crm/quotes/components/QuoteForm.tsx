'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Validation schema
export const quoteSchema = yup.object().shape({
  customer: yup.string().required('Customer is required'),
  quoteDate: yup.date().required('Quote date is required'),
  expiryDate: yup
    .date()
    .required('Expiry date is required')
    .min(yup.ref('quoteDate'), 'Expiry date must be after quote date'),
  status: yup.string().required('Status is required'),
  items: yup.array().of(
    yup.object().shape({
      description: yup.string().required('Description is required'),
      quantity: yup
        .number()
        .required('Quantity is required')
        .min(1, 'Quantity must be at least 1'),
      unitPrice: yup
        .number()
        .required('Unit price is required')
        .min(0, 'Unit price cannot be negative'),
    })
  ),
  notes: yup.string(),
});

type QuoteFormData = yup.InferType<typeof quoteSchema>;

type QuoteFormProps = {
  onSubmit: (data: QuoteFormData) => void;
  onCancel: () => void;
  initialData?: Partial<QuoteFormData>;
};

const QuoteForm = ({ onSubmit, onCancel, initialData }: QuoteFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<QuoteFormData>({
    resolver: yupResolver(quoteSchema),
    defaultValues: {
      status: 'draft',
      items: [
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
        },
      ],
      ...initialData,
    },
  });

  const items = watch('items');
  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );
  const taxRate = 0.1; // 10% tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const addItem = () => {
    setValue('items', [
      ...items,
      { description: '', quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setValue('items', newItems);
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setValue('items', newItems);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          {/* Customer and Dates */}
          <Grid item xs={12} md={6}>
            <Controller
              name="customer"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Customer"
                  error={!!errors.customer}
                  helperText={errors.customer?.message}
                  margin="normal"
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Controller
                name="quoteDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Quote Date"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.quoteDate,
                        helperText: errors.quoteDate?.message,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Expiry Date"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.expiryDate,
                        helperText: errors.expiryDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    {...field}
                    label="Status"
                    error={!!errors.status}
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="sent">Sent</MenuItem>
                    <MenuItem value="accepted">Accepted</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                  </Select>
                  {errors.status && (
                    <FormHelperText error>
                      {errors.status.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Items */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Items
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {items.map((item, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, 'description', e.target.value)
                      }
                      error={!!errors.items?.[index]?.description}
                      helperText={errors.items?.[index]?.description?.message}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, 'quantity', Number(e.target.value))
                      }
                      error={!!errors.items?.[index]?.quantity}
                      helperText={errors.items?.[index]?.quantity?.message}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(index, 'unitPrice', Number(e.target.value))
                      }
                      error={!!errors.items?.[index]?.unitPrice}
                      helperText={errors.items?.[index]?.unitPrice?.message}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={1} textAlign="right">
                    <Typography variant="subtitle1">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={1} textAlign="right">
                    <Button
                      color="error"
                      onClick={() => removeItem(index)}
                      disabled={items.length <= 1}
                    >
                      <DeleteIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addItem}
              sx={{ mt: 1 }}
            >
              Add Item
            </Button>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  margin="normal"
                />
              )}
            />
          </Grid>

          {/* Summary */}
          <Grid item xs={12} md={4} sx={{ ml: 'auto' }}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax (10%):</Typography>
                <Typography>${tax.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <Typography>Total:</Typography>
                <Typography>${total.toFixed(2)}</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12} sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save Quote
            </Button>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
};

export default QuoteForm;
