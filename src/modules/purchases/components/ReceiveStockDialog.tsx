'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormField from '@/components/common/FormField';
import { receiveStockSchema } from '../schema';
import { ReceiveStockData, PurchaseOrder } from '../types';

interface ReceiveStockDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: ReceiveStockData) => Promise<void>;
  purchaseOrder: PurchaseOrder | null;
  loading?: boolean;
}

const ReceiveStockDialog: React.FC<ReceiveStockDialogProps> = ({
  open,
  onClose,
  onConfirm,
  purchaseOrder,
  loading = false,
}) => {
  const methods = useForm<ReceiveStockData>({
    resolver: yupResolver(receiveStockSchema),
    defaultValues: {
      purchaseOrderId: purchaseOrder?.id || '',
      items: [],
      receivedDate: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const { handleSubmit, setValue, watch, reset } = methods;
  const watchedItems = watch('items');

  React.useEffect(() => {
    if (open && purchaseOrder) {
      const items = purchaseOrder.items
        .filter(item => item.receivedQuantity < item.quantity)
        .map(item => ({
          itemId: item.id,
          receivedQuantity: item.quantity - item.receivedQuantity,
          notes: '',
        }));
      
      reset({
        purchaseOrderId: purchaseOrder.id,
        items,
        receivedDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [open, purchaseOrder, reset]);

  const handleFormSubmit = async (data: ReceiveStockData) => {
    try {
      await onConfirm(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleQuantityChange = (index: number, value: number) => {
    setValue(`items.${index}.receivedQuantity`, value);
  };

  const handleNotesChange = (index: number, value: string) => {
    setValue(`items.${index}.notes`, value);
  };

  if (!purchaseOrder) return null;

  const pendingItems = purchaseOrder.items.filter(item => item.receivedQuantity < item.quantity);

  if (pendingItems.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Receive Stock</DialogTitle>
        <DialogContent>
          <Alert severity="info">
            All items in this purchase order have already been received.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Receive Stock - {purchaseOrder.number}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Purchase Order Details
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Supplier: {purchaseOrder.supplierName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Order Date: {new Date(purchaseOrder.orderDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Amount: ${purchaseOrder.total.toFixed(2)}
              </Typography>
            </Box>
            
            <FormField
              name="receivedDate"
              label="Received Date"
              type="date"
              required
            />
            
            <Box mt={3} mb={2}>
              <Typography variant="h6" gutterBottom>
                Items to Receive
              </Typography>
            </Box>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Ordered</TableCell>
                    <TableCell>Already Received</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>Receive Now</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingItems.map((item, index) => {
                    const pendingQuantity = item.quantity - item.receivedQuantity;
                    const receivingQuantity = watchedItems[index]?.receivedQuantity || 0;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {item.productName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.receivedQuantity}</TableCell>
                        <TableCell>
                          <Typography 
                            color={pendingQuantity > 0 ? 'warning.main' : 'success.main'}
                            fontWeight="medium"
                          >
                            {pendingQuantity}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <FormField
                            name={`items.${index}.receivedQuantity`}
                            label=""
                            type="number"
                            helperText={receivingQuantity > pendingQuantity ? 'Cannot exceed pending quantity' : ''}
                            error={receivingQuantity > pendingQuantity}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            name={`items.${index}.notes`}
                            label=""
                            placeholder="Optional notes"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box mt={3}>
              <FormField
                name="notes"
                label="General Notes"
                multiline
                rows={3}
                helperText="Any additional notes about this stock receipt"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              color="primary"
            >
              {loading ? 'Receiving...' : 'Receive Stock'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ReceiveStockDialog;