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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@mui/material';
import { 
  Print as PrintIcon, 
  Download as DownloadIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { Sale } from '../types';

interface ReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  sale: Sale | null;
  onPrint: () => void;
  onDownload: () => void;
}

const ReceiptDialog: React.FC<ReceiptDialogProps> = ({
  open,
  onClose,
  sale,
  onPrint,
  onDownload,
}) => {
  if (!sale) return null;

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Card';
      case 'upi': return 'UPI';
      case 'bank_transfer': return 'Bank Transfer';
      case 'check': return 'Check';
      case 'multiple': return 'Multiple Payment Methods';
      default: return method;
    }
  };

  const getPaymentDetails = () => {
    if (!sale.paymentDetails) return null;

    const details = [];

    if (sale.paymentDetails.cash) {
      details.push(
        <Box key="cash" display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2">Cash:</Typography>
          <Typography variant="body2">{formatCurrency(sale.paymentDetails.cash.amount)}</Typography>
        </Box>
      );
      details.push(
        <Box key="change" display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2">Change:</Typography>
          <Typography variant="body2">{formatCurrency(sale.paymentDetails.cash.change)}</Typography>
        </Box>
      );
    }

    if (sale.paymentDetails.card) {
      details.push(
        <Box key="card" display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2">Card:</Typography>
          <Typography variant="body2">{formatCurrency(sale.paymentDetails.card.amount)}</Typography>
        </Box>
      );
      details.push(
        <Box key="card-ref" display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2">Reference:</Typography>
          <Typography variant="body2">{sale.paymentDetails.card.reference}</Typography>
        </Box>
      );
      if (sale.paymentDetails.card.last4) {
        details.push(
          <Box key="card-last4" display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2">Card ending in:</Typography>
            <Typography variant="body2">{sale.paymentDetails.card.last4}</Typography>
          </Box>
        );
      }
    }

    if (sale.paymentDetails.upi) {
      details.push(
        <Box key="upi" display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2">UPI:</Typography>
          <Typography variant="body2">{formatCurrency(sale.paymentDetails.upi.amount)}</Typography>
        </Box>
      );
      details.push(
        <Box key="upi-ref" display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2">Reference:</Typography>
          <Typography variant="body2">{sale.paymentDetails.upi.reference}</Typography>
        </Box>
      );
    }

    if (sale.paymentDetails.bankTransfer) {
      details.push(
        <Box key="bank" display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2">Bank Transfer:</Typography>
          <Typography variant="body2">{formatCurrency(sale.paymentDetails.bankTransfer.amount)}</Typography>
        </Box>
      );
      details.push(
        <Box key="bank-ref" display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2">Reference:</Typography>
          <Typography variant="body2">{sale.paymentDetails.bankTransfer.reference}</Typography>
        </Box>
      );
    }

    if (sale.paymentDetails.check) {
      details.push(
        <Box key="check" display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2">Check:</Typography>
          <Typography variant="body2">{formatCurrency(sale.paymentDetails.check.amount)}</Typography>
        </Box>
      );
      details.push(
        <Box key="check-ref" display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2">Check Number:</Typography>
          <Typography variant="body2">{sale.paymentDetails.check.reference}</Typography>
        </Box>
      );
    }

    return details.length > 0 ? details : null;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <ReceiptIcon />
            <Typography variant="h6">Receipt</Typography>
          </Box>
          <Box>
            <Button 
              startIcon={<PrintIcon />} 
              onClick={onPrint}
              sx={{ mr: 1 }}
            >
              Print
            </Button>
            <Button 
              startIcon={<DownloadIcon />} 
              onClick={onDownload}
            >
              Download
            </Button>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box id="receipt-content" sx={{ p: 2 }}>
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              CRM PRO
            </Typography>
            <Typography variant="body2">
              123 Business Street, City, State, 12345
            </Typography>
            <Typography variant="body2">
              Phone: (123) 456-7890 | Email: sales@crmpro.com
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Receipt Info */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Receipt #:</strong> {sale.number}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {formatDate(sale.createdAt)}
              </Typography>
              <Typography variant="body2">
                <strong>Cashier:</strong> {sale.createdByName}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {sale.customerName && (
                <Typography variant="body2">
                  <strong>Customer:</strong> {sale.customerName}
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Payment Method:</strong> {getPaymentMethodText(sale.paymentMethod)}
              </Typography>
            </Grid>
          </Grid>

          {/* Items */}
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Qty</TableCell>
                  <TableCell align="right">Discount</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sale.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2">{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.sku}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">
                      {item.discount > 0 
                        ? (item.discountType === 'percentage' 
                          ? `${item.discount}%` 
                          : formatCurrency(item.discount))
                        : '-'}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Totals */}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '40%' } }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">{formatCurrency(sale.subtotal)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Tax:</Typography>
                <Typography variant="body2">{formatCurrency(sale.taxTotal)}</Typography>
              </Box>
              {sale.discountTotal > 0 && (
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Discount:</Typography>
                  <Typography variant="body2">-{formatCurrency(sale.discountTotal)}</Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle2" fontWeight="bold">Total:</Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  {formatCurrency(sale.total)}
                </Typography>
              </Box>

              {/* Payment Details */}
              {getPaymentDetails() && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Payment Details:
                  </Typography>
                  {getPaymentDetails()}
                </>
              )}
            </Box>
          </Box>

          {/* Notes */}
          {sale.notes && (
            <Box mt={3}>
              <Typography variant="subtitle2">Notes:</Typography>
              <Typography variant="body2">{sale.notes}</Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Footer */}
          <Box textAlign="center">
            <Typography variant="body2">
              Thank you for your business!
            </Typography>
            <Typography variant="caption" color="text.secondary">
              This receipt is not a tax invoice.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
        <Button 
          variant="contained" 
          startIcon={<PrintIcon />}
          onClick={onPrint}
        >
          Print Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReceiptDialog;