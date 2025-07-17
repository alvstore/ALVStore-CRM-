import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Grid,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CreditCard as CardIcon,
  LocalAtm as CashIcon,
  AccountBalance as BankIcon,
  PhoneAndroid as UpiIcon,
  Receipt as CheckIcon,
} from '@mui/icons-material';
import { Cart } from '../types';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onProcessPayment: (method: string, details: any) => Promise<void>;
  cart: Cart;
  loading?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onClose,
  onProcessPayment,
  cart,
  loading = false,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [cashAmount, setCashAmount] = useState('');
  const [cardReference, setCardReference] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  const [upiReference, setUpiReference] = useState('');
  const [bankReference, setBankReference] = useState('');
  const [checkReference, setCheckReference] = useState('');
  
  // Multiple payment method state
  const [useMultiplePayments, setUseMultiplePayments] = useState(false);
  const [cashMultipleAmount, setCashMultipleAmount] = useState('');
  const [cardMultipleAmount, setCardMultipleAmount] = useState('');
  const [cardMultipleReference, setCardMultipleReference] = useState('');
  const [cardMultipleLast4, setCardMultipleLast4] = useState('');
  const [upiMultipleAmount, setUpiMultipleAmount] = useState('');
  const [upiMultipleReference, setUpiMultipleReference] = useState('');
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setTabValue(0);
      setCashAmount(cart.total.toFixed(2));
      setCardReference('');
      setCardLast4('');
      setUpiReference('');
      setBankReference('');
      setCheckReference('');
      setUseMultiplePayments(false);
      setCashMultipleAmount('');
      setCardMultipleAmount('');
      setCardMultipleReference('');
      setCardMultipleLast4('');
      setUpiMultipleAmount('');
      setUpiMultipleReference('');
    }
  }, [open, cart.total]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCashPayment = async () => {
    const amount = parseFloat(cashAmount);
    if (isNaN(amount) || amount < cart.total) {
      return; // Validate cash amount
    }
    
    await onProcessPayment('cash', {
      cash: {
        amount,
        change: amount - cart.total,
      },
    });
  };

  const handleCardPayment = async () => {
    if (!cardReference) {
      return; // Validate card reference
    }
    
    await onProcessPayment('card', {
      card: {
        amount: cart.total,
        reference: cardReference,
        last4: cardLast4,
      },
    });
  };

  const handleUpiPayment = async () => {
    if (!upiReference) {
      return; // Validate UPI reference
    }
    
    await onProcessPayment('upi', {
      upi: {
        amount: cart.total,
        reference: upiReference,
      },
    });
  };

  const handleBankTransferPayment = async () => {
    if (!bankReference) {
      return; // Validate bank reference
    }
    
    await onProcessPayment('bank_transfer', {
      bankTransfer: {
        amount: cart.total,
        reference: bankReference,
      },
    });
  };

  const handleCheckPayment = async () => {
    if (!checkReference) {
      return; // Validate check reference
    }
    
    await onProcessPayment('check', {
      check: {
        amount: cart.total,
        reference: checkReference,
      },
    });
  };

  const handleMultiplePayment = async () => {
    const cashAmount = parseFloat(cashMultipleAmount) || 0;
    const cardAmount = parseFloat(cardMultipleAmount) || 0;
    const upiAmount = parseFloat(upiMultipleAmount) || 0;
    
    const totalPaid = cashAmount + cardAmount + upiAmount;
    
    if (Math.abs(totalPaid - cart.total) > 0.01) {
      return; // Total paid must equal cart total
    }
    
    if (cardAmount > 0 && !cardMultipleReference) {
      return; // Validate card reference if card payment is used
    }
    
    if (upiAmount > 0 && !upiMultipleReference) {
      return; // Validate UPI reference if UPI payment is used
    }
    
    const paymentDetails: any = {};
    
    if (cashAmount > 0) {
      paymentDetails.cash = {
        amount: cashAmount,
        change: 0,
      };
    }
    
    if (cardAmount > 0) {
      paymentDetails.card = {
        amount: cardAmount,
        reference: cardMultipleReference,
        last4: cardMultipleLast4,
      };
    }
    
    if (upiAmount > 0) {
      paymentDetails.upi = {
        amount: upiAmount,
        reference: upiMultipleReference,
      };
    }
    
    await onProcessPayment('multiple', paymentDetails);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const calculateChange = () => {
    const amount = parseFloat(cashAmount);
    if (isNaN(amount) || amount < cart.total) {
      return 0;
    }
    return amount - cart.total;
  };

  const calculateRemainingAmount = () => {
    const cashAmount = parseFloat(cashMultipleAmount) || 0;
    const cardAmount = parseFloat(cardMultipleAmount) || 0;
    const upiAmount = parseFloat(upiMultipleAmount) || 0;
    
    const totalPaid = cashAmount + cardAmount + upiAmount;
    return cart.total - totalPaid;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <PaymentIcon />
          <Typography variant="h6">Payment</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="payment methods">
            <Tab icon={<CashIcon />} label="Cash" />
            <Tab icon={<CardIcon />} label="Card" />
            <Tab icon={<UpiIcon />} label="UPI" />
            <Tab icon={<BankIcon />} label="Bank Transfer" />
            <Tab icon={<CheckIcon />} label="Check" />
            <Tab icon={<PaymentIcon />} label="Multiple" />
          </Tabs>
        </Box>

        {/* Order Summary */}
        <Paper sx={{ p: 2, my: 3, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Order Summary
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Subtotal:</Typography>
            <Typography variant="body2">{formatCurrency(cart.subtotal)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Tax:</Typography>
            <Typography variant="body2">{formatCurrency(cart.taxTotal)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Discount:</Typography>
            <Typography variant="body2">-{formatCurrency(cart.discountTotal)}</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              {formatCurrency(cart.total)}
            </Typography>
          </Box>
        </Paper>

        {/* Cash Payment */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Cash Amount"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                fullWidth
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Change
                </Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {formatCurrency(calculateChange())}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Card Payment */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Card Reference/Transaction ID"
                value={cardReference}
                onChange={(e) => setCardReference(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Last 4 Digits (Optional)"
                value={cardLast4}
                onChange={(e) => setCardLast4(e.target.value)}
                fullWidth
                inputProps={{ maxLength: 4 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Amount to be charged: {formatCurrency(cart.total)}
              </Alert>
            </Grid>
          </Grid>
        </TabPanel>

        {/* UPI Payment */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="UPI Reference/Transaction ID"
                value={upiReference}
                onChange={(e) => setUpiReference(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Amount to be charged: {formatCurrency(cart.total)}
              </Alert>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Bank Transfer Payment */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Bank Transfer Reference"
                value={bankReference}
                onChange={(e) => setBankReference(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Amount to be transferred: {formatCurrency(cart.total)}
              </Alert>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Check Payment */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Check Number"
                value={checkReference}
                onChange={(e) => setCheckReference(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Check amount: {formatCurrency(cart.total)}
              </Alert>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Multiple Payment Methods */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Split Payment
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Total amount to be paid: {formatCurrency(cart.total)}
              </Alert>
            </Grid>
            
            {/* Cash portion */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Cash Amount"
                value={cashMultipleAmount}
                onChange={(e) => setCashMultipleAmount(e.target.value)}
                fullWidth
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            {/* Card portion */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Card Amount"
                value={cardMultipleAmount}
                onChange={(e) => setCardMultipleAmount(e.target.value)}
                fullWidth
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            {parseFloat(cardMultipleAmount) > 0 && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Card Reference/Transaction ID"
                    value={cardMultipleReference}
                    onChange={(e) => setCardMultipleReference(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Last 4 Digits (Optional)"
                    value={cardMultipleLast4}
                    onChange={(e) => setCardMultipleLast4(e.target.value)}
                    fullWidth
                    inputProps={{ maxLength: 4 }}
                  />
                </Grid>
              </>
            )}
            
            {/* UPI portion */}
            <Grid item xs={12} md={6}>
              <TextField
                label="UPI Amount"
                value={upiMultipleAmount}
                onChange={(e) => setUpiMultipleAmount(e.target.value)}
                fullWidth
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            {parseFloat(upiMultipleAmount) > 0 && (
              <Grid item xs={12} md={6}>
                <TextField
                  label="UPI Reference/Transaction ID"
                  value={upiMultipleReference}
                  onChange={(e) => setUpiMultipleReference(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle2">
                    Remaining Amount:
                  </Typography>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight="bold"
                    color={Math.abs(calculateRemainingAmount()) < 0.01 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(calculateRemainingAmount())}
                  </Typography>
                </Box>
                {Math.abs(calculateRemainingAmount()) > 0.01 && (
                  <Typography variant="caption" color="error">
                    The total payment amount must equal the cart total.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {tabValue === 0 && (
          <Button 
            variant="contained" 
            onClick={handleCashPayment}
            disabled={loading || parseFloat(cashAmount) < cart.total}
          >
            {loading ? 'Processing...' : 'Complete Payment'}
          </Button>
        )}
        {tabValue === 1 && (
          <Button 
            variant="contained" 
            onClick={handleCardPayment}
            disabled={loading || !cardReference}
          >
            {loading ? 'Processing...' : 'Complete Payment'}
          </Button>
        )}
        {tabValue === 2 && (
          <Button 
            variant="contained" 
            onClick={handleUpiPayment}
            disabled={loading || !upiReference}
          >
            {loading ? 'Processing...' : 'Complete Payment'}
          </Button>
        )}
        {tabValue === 3 && (
          <Button 
            variant="contained" 
            onClick={handleBankTransferPayment}
            disabled={loading || !bankReference}
          >
            {loading ? 'Processing...' : 'Complete Payment'}
          </Button>
        )}
        {tabValue === 4 && (
          <Button 
            variant="contained" 
            onClick={handleCheckPayment}
            disabled={loading || !checkReference}
          >
            {loading ? 'Processing...' : 'Complete Payment'}
          </Button>
        )}
        {tabValue === 5 && (
          <Button 
            variant="contained" 
            onClick={handleMultiplePayment}
            disabled={
              loading || 
              Math.abs(calculateRemainingAmount()) > 0.01 ||
              (parseFloat(cardMultipleAmount) > 0 && !cardMultipleReference) ||
              (parseFloat(upiMultipleAmount) > 0 && !upiMultipleReference)
            }
          >
            {loading ? 'Processing...' : 'Complete Payment'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;