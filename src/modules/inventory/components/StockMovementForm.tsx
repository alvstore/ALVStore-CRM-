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
import { stockMovementSchema } from '../schema';
import { StockMovementFormData, Product } from '../types';

interface StockMovementFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StockMovementFormData) => Promise<void>;
  loading?: boolean;
  products: Product[];
  selectedProduct?: Product;
}

const StockMovementForm: React.FC<StockMovementFormProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  products,
  selectedProduct,
}) => {
  const methods = useForm<StockMovementFormData>({
    resolver: yupResolver(stockMovementSchema),
    defaultValues: {
      productId: selectedProduct?.id || '',
      type: 'in',
      quantity: 1,
      reason: '',
      reference: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const { handleSubmit, watch, reset } = methods;
  const watchedProductId = watch('productId');
  const watchedType = watch('type');
  const watchedQuantity = watch('quantity');

  React.useEffect(() => {
    if (open) {
      reset({
        productId: selectedProduct?.id || '',
        type: 'in',
        quantity: 1,
        reason: '',
        reference: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [open, selectedProduct, reset]);

  const handleFormSubmit = async (data: StockMovementFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const selectedProductData = products.find(p => p.id === watchedProductId);

  const productOptions = [
    { value: '', label: 'Select Product' },
    ...products.map(product => ({ 
      value: product.id, 
      label: `${product.name} (${product.sku}) - Current: ${product.quantity}` 
    })),
  ];

  const typeOptions = [
    { value: 'in', label: 'Stock In (Add)' },
    { value: 'out', label: 'Stock Out (Remove)' },
    { value: 'adjustment', label: 'Stock Adjustment (Set)' },
  ];

  const getReasonOptions = () => {
    switch (watchedType) {
      case 'in':
        return [
          { value: 'purchase', label: 'Purchase Order' },
          { value: 'return', label: 'Customer Return' },
          { value: 'transfer_in', label: 'Transfer In' },
          { value: 'production', label: 'Production' },
          { value: 'other', label: 'Other' },
        ];
      case 'out':
        return [
          { value: 'sale', label: 'Sale' },
          { value: 'damage', label: 'Damaged' },
          { value: 'expired', label: 'Expired' },
          { value: 'transfer_out', label: 'Transfer Out' },
          { value: 'sample', label: 'Sample' },
          { value: 'other', label: 'Other' },
        ];
      case 'adjustment':
        return [
          { value: 'count_correction', label: 'Physical Count Correction' },
          { value: 'system_error', label: 'System Error Correction' },
          { value: 'audit', label: 'Audit Adjustment' },
          { value: 'other', label: 'Other' },
        ];
      default:
        return [];
    }
  };

  const getNewQuantity = () => {
    if (!selectedProductData) return 0;
    
    switch (watchedType) {
      case 'in':
        return selectedProductData.quantity + (watchedQuantity || 0);
      case 'out':
        return Math.max(0, selectedProductData.quantity - (watchedQuantity || 0));
      case 'adjustment':
        return watchedQuantity || 0;
      default:
        return selectedProductData.quantity;
    }
  };

  const isInsufficientStock = watchedType === 'out' && selectedProductData && watchedQuantity > selectedProductData.quantity;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Stock Movement
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Movement Details
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  name="productId"
                  label="Product"
                  type="select"
                  options={productOptions}
                  required
                />
              </Grid>

              {selectedProductData && (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Current Stock Information:
                    </Typography>
                    <Typography variant="body2">
                      • Product: {selectedProductData.name} ({selectedProductData.sku})
                    </Typography>
                    <Typography variant="body2">
                      • Current Quantity: {selectedProductData.quantity} {selectedProductData.unit}
                    </Typography>
                    <Typography variant="body2">
                      • Minimum Stock Level: {selectedProductData.minStockLevel} {selectedProductData.unit}
                    </Typography>
                    {selectedProductData.location && (
                      <Typography variant="body2">
                        • Location: {selectedProductData.location}
                      </Typography>
                    )}
                  </Alert>
                </Grid>
              )}
              
              <Grid item xs={12} md={6}>
                <FormField
                  name="type"
                  label="Movement Type"
                  type="select"
                  options={typeOptions}
                  required
                />
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
                  name="quantity"
                  label={watchedType === 'adjustment' ? 'New Quantity' : 'Quantity'}
                  type="number"
                  required
                />
                {isInsufficientStock && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    Insufficient stock! Available: {selectedProductData?.quantity}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="reason"
                  label="Reason"
                  type="select"
                  options={getReasonOptions()}
                  required
                />
              </Grid>
              
              {selectedProductData && (
                <Grid item xs={12}>
                  <Box p={2} bgcolor="grey.50" borderRadius={1}>
                    <Typography variant="subtitle2" gutterBottom>
                      Stock Calculation:
                    </Typography>
                    <Typography variant="body2">
                      Current Stock: {selectedProductData.quantity} {selectedProductData.unit}
                    </Typography>
                    <Typography variant="body2">
                      {watchedType === 'in' && `+ ${watchedQuantity || 0} ${selectedProductData.unit}`}
                      {watchedType === 'out' && `- ${watchedQuantity || 0} ${selectedProductData.unit}`}
                      {watchedType === 'adjustment' && `Set to ${watchedQuantity || 0} ${selectedProductData.unit}`}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      New Stock: {getNewQuantity()} {selectedProductData.unit}
                    </Typography>
                    {getNewQuantity() <= selectedProductData.minStockLevel && (
                      <Typography variant="body2" color="warning.main">
                        ⚠️ Stock will be below minimum level ({selectedProductData.minStockLevel})
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <FormField
                  name="reference"
                  label="Reference Number"
                  helperText="PO number, invoice number, etc."
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  name="notes"
                  label="Notes"
                  multiline
                  rows={3}
                  helperText="Additional details about this stock movement"
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
              disabled={loading || isInsufficientStock}
            >
              {loading ? 'Processing...' : 'Record Movement'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default StockMovementForm;