import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp as SalesIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CardIcon,
  LocalAtm as CashIcon,
  PhoneAndroid as UpiIcon,
} from '@mui/icons-material';
import { DailySummary } from '../types';

interface SalesSummaryProps {
  summary: DailySummary;
}

const SalesSummary: React.FC<SalesSummaryProps> = ({ summary }) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return <CashIcon />;
      case 'card': return <CardIcon />;
      case 'upi': return <UpiIcon />;
      default: return <MoneyIcon />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Card';
      case 'upi': return 'UPI';
      case 'bank_transfer': return 'Bank Transfer';
      case 'check': return 'Check';
      case 'multiple': return 'Multiple Methods';
      default: return method;
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Sales Summary for {formatDate(summary.date)}
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <SalesIcon fontSize="large" color="primary" />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {summary.totalSales}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Sales
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <MoneyIcon fontSize="large" color="success" />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(summary.totalAmount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <MoneyIcon fontSize="large" color="info" />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(summary.averageAmount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Sale
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Payment Method Breakdown */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Payment Method Breakdown
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          {summary.paymentMethodBreakdown.map((method) => (
            <Grid item xs={6} sm={4} md={3} key={method.method}>
              <Box 
                sx={{ 
                  p: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 1,
                  textAlign: 'center'
                }}
              >
                <Box display="flex" justifyContent="center" mb={1}>
                  {getPaymentMethodIcon(method.method)}
                </Box>
                <Typography variant="subtitle2">
                  {getPaymentMethodLabel(method.method)}
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {formatCurrency(method.amount)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {method.count} {method.count === 1 ? 'sale' : 'sales'}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* Hourly Breakdown */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Hourly Sales Breakdown
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {summary.hourlyBreakdown.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
            No hourly data available for this date.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hour</TableCell>
                  <TableCell align="center">Number of Sales</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.hourlyBreakdown.map((hour) => (
                  <TableRow key={hour.hour}>
                    <TableCell>
                      {hour.hour === 0 ? '12 AM' : 
                       hour.hour < 12 ? `${hour.hour} AM` : 
                       hour.hour === 12 ? '12 PM' : 
                       `${hour.hour - 12} PM`}
                    </TableCell>
                    <TableCell align="center">{hour.count}</TableCell>
                    <TableCell align="right">{formatCurrency(hour.amount)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>
                    Total:
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(summary.totalAmount)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default SalesSummary;