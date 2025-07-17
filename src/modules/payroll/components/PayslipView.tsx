import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { Payslip } from '../types';

interface PayslipViewProps {
  payslip: Payslip;
  onPrint?: () => void;
  onDownload?: () => void;
}

const PayslipView: React.FC<PayslipViewProps> = ({
  payslip,
  onPrint,
  onDownload,
}) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Mock download functionality
      alert('Payslip download functionality would be implemented here');
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: '800px', mx: 'auto' }} id="payslip-container">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          PAYSLIP
        </Typography>
        <Box>
          <Button 
            startIcon={<PrintIcon />} 
            onClick={handlePrint}
            sx={{ mr: 1 }}
          >
            Print
          </Button>
          <Button 
            startIcon={<DownloadIcon />} 
            onClick={handleDownload}
          >
            Download
          </Button>
        </Box>
      </Box>

      <Box textAlign="center" mb={3}>
        <Typography variant="h6">
          CRM PRO
        </Typography>
        <Typography variant="body2">
          123 Business Street, City, State, 12345
        </Typography>
        <Typography variant="body2">
          Phone: (123) 456-7890 | Email: payroll@crmpro.com
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
        Pay Period: {payslip.payPeriod}
      </Typography>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Employee Information
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {payslip.employeeName}
            </Typography>
            <Typography variant="body2">
              {payslip.position}
            </Typography>
            <Typography variant="body2">
              {payslip.department}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Payment Information
            </Typography>
            <Typography variant="body2">
              Payment Method: {payslip.paymentMethod ? payslip.paymentMethod.replace('_', ' ').toUpperCase() : 'Not Paid'}
            </Typography>
            {payslip.paymentReference && (
              <Typography variant="body2">
                Reference: {payslip.paymentReference}
              </Typography>
            )}
            {payslip.paymentDate && (
              <Typography variant="body2">
                Payment Date: {new Date(payslip.paymentDate).toLocaleDateString()}
              </Typography>
            )}
            {payslip.bankName && (
              <Typography variant="body2">
                Bank: {payslip.bankName}
              </Typography>
            )}
            {payslip.bankAccount && (
              <Typography variant="body2">
                Account: {payslip.bankAccount}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Earnings
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payslip.earnings.map((earning, index) => (
                  <TableRow key={index}>
                    <TableCell>{earning.type}</TableCell>
                    <TableCell align="right">{formatCurrency(earning.amount)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Earnings</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(payslip.grossSalary)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Deductions
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payslip.deductions.map((deduction, index) => (
                  <TableRow key={index}>
                    <TableCell>{deduction.type}</TableCell>
                    <TableCell align="right">{formatCurrency(deduction.amount)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Deductions</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(payslip.totalDeductions)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Box mt={4} p={2} bgcolor="background.default" borderRadius={1}>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h6">Net Pay:</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant="h6" fontWeight="bold">
              {formatCurrency(payslip.netSalary)}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {payslip.notes && (
        <Box mt={3}>
          <Typography variant="subtitle2" color="text.secondary">
            Notes:
          </Typography>
          <Typography variant="body2">
            {payslip.notes}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      <Box textAlign="center">
        <Typography variant="caption" color="text.secondary">
          This is a computer-generated document and does not require a signature.
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Generated on: {new Date(payslip.createdAt).toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PayslipView;