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
  Divider,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormField from '@/components/common/FormField';
import { convertToInvoiceSchema } from '../schema';
import { ConvertToInvoiceData, Quote } from '../types';

interface ConvertToInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: ConvertToInvoiceData) => Promise<void>;
  quote: Quote | null;
  loading?: boolean;
}

const ConvertToInvoiceDialog: React.FC<ConvertToInvoiceDialogProps> = ({
  open,
  onClose,
  onConfirm,
  quote,
  loading = false,
}) => {
  const methods = useForm<ConvertToInvoiceData>({
    resolver: yupResolver(convertToInvoiceSchema),
    defaultValues: {
      quoteId: quote?.id || '',
      dueDate: '',
      notes: '',
    },
  });

  const { handleSubmit, reset } = methods;

  React.useEffect(() => {
    if (open && quote) {
      // Set due date to 30 days from now by default
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      
      reset({
        quoteId: quote.id,
        dueDate: dueDate.toISOString().split('T')[0],
        notes: quote.notes || '',
      });
    }
  }, [open, quote, reset]);

  const handleFormSubmit = async (data: ConvertToInvoiceData) => {
    try {
      await onConfirm(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  if (!quote) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Convert Quote to Invoice
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Quote Details
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Quote Number: {quote.number}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Client: {quote.clientName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Amount: ${quote.total.toFixed(2)}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Invoice Settings
            </Typography>
            
            <FormField
              name="dueDate"
              label="Due Date"
              type="date"
              required
              helperText="When should this invoice be paid?"
            />
            
            <FormField
              name="notes"
              label="Invoice Notes"
              multiline
              rows={3}
              helperText="Additional notes for the invoice (optional)"
            />
            
            <Box mt={2} p={2} bgcolor="info.light" borderRadius={1}>
              <Typography variant="body2" color="info.contrastText">
                <strong>Note:</strong> Converting this quote to an invoice will:
                <br />• Create a new invoice with the same items and amounts
                <br />• Mark this quote as converted
                <br />• The quote cannot be converted again
              </Typography>
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
              {loading ? 'Converting...' : 'Convert to Invoice'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ConvertToInvoiceDialog;