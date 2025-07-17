import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Note as NoteIcon,
} from '@mui/icons-material';
import { CartItem, Cart as CartType } from '../types';

interface CartProps {
  cart: CartType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onUpdateDiscount: (productId: string, discount: number, discountType: 'percentage' | 'fixed') => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  onSelectCustomer: () => void;
  onAddNotes: () => void;
  disabled?: boolean;
}

const Cart: React.FC<CartProps> = ({
  cart,
  onUpdateQuantity,
  onUpdateDiscount,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onSelectCustomer,
  onAddNotes,
  disabled = false,
}) => {
  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    onUpdateQuantity(item.productId, newQuantity);
  };

  const handleDiscountChange = (item: CartItem, newDiscount: number) => {
    if (newDiscount < 0) return;
    onUpdateDiscount(item.productId, newDiscount, item.discountType);
  };

  const handleDiscountTypeChange = (item: CartItem, newType: 'percentage' | 'fixed') => {
    onUpdateDiscount(item.productId, item.discount, newType);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Cart ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            color="error" 
            size="small" 
            onClick={onClearCart}
            disabled={cart.items.length === 0 || disabled}
            sx={{ mr: 1 }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onCheckout}
            disabled={cart.items.length === 0 || disabled}
          >
            Checkout
          </Button>
        </Box>
      </Box>

      {/* Customer and Notes */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <PersonIcon color="action" />
              <Typography variant="body2" color={cart.customer ? 'text.primary' : 'text.secondary'}>
                {cart.customer ? cart.customer.name : 'No customer selected'}
              </Typography>
              <Button size="small" onClick={onSelectCustomer}>
                {cart.customer ? 'Change' : 'Select'}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <NoteIcon color="action" />
              <Typography variant="body2" color={cart.notes ? 'text.primary' : 'text.secondary'} noWrap>
                {cart.notes ? cart.notes : 'No notes added'}
              </Typography>
              <Button size="small" onClick={onAddNotes}>
                {cart.notes ? 'Edit' : 'Add'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {cart.items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Cart is empty. Add products to get started.
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Discount</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        SKU: {item.sku}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          disabled={disabled}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              handleQuantityChange(item, value);
                            }
                          }}
                          disabled={disabled}
                          size="small"
                          inputProps={{ 
                            min: 1, 
                            style: { textAlign: 'center', width: '40px' } 
                          }}
                          variant="outlined"
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          disabled={disabled}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        <TextField
                          value={item.discount}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value)) {
                              handleDiscountChange(item, value);
                            }
                          }}
                          disabled={disabled}
                          size="small"
                          inputProps={{ 
                            min: 0, 
                            style: { textAlign: 'center', width: '50px' } 
                          }}
                          variant="outlined"
                        />
                        <Select
                          value={item.discountType}
                          onChange={(e) => handleDiscountTypeChange(item, e.target.value as 'percentage' | 'fixed')}
                          disabled={disabled}
                          size="small"
                          sx={{ minWidth: 80 }}
                        >
                          <MenuItem value="percentage">%</MenuItem>
                          <MenuItem value="fixed">$</MenuItem>
                        </Select>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.total)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => onRemoveItem(item.productId)}
                        disabled={disabled}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {/* Empty space or could add coupon code input here */}
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1">{formatCurrency(cart.subtotal)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1">Tax:</Typography>
                    <Typography variant="body1">{formatCurrency(cart.taxTotal)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1">Discount:</Typography>
                    <Typography variant="body1">-{formatCurrency(cart.discountTotal)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" fontWeight="bold">Total:</Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {formatCurrency(cart.total)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default Cart;