'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { 
  Print as PrintIcon,
  FileDownload as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import { useAccountingStore } from '../store/accountingStore';
import { TrialBalanceEntry } from '../types';

const TrialBalancePage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    trialBalance,
    loading,
    error,
    fetchTrialBalance,
    clearError,
  } = useAccountingStore();

  const [asOfDate, setAsOfDate] = React.useState<dayjs.Dayjs | null>(dayjs());

  React.useEffect(() => {
    fetchTrialBalance(asOfDate?.format('YYYY-MM-DD'));
  }, [fetchTrialBalance]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setAsOfDate(date);
  };

  const handleRefresh = () => {
    fetchTrialBalance(asOfDate?.format('YYYY-MM-DD'));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a CSV or PDF
    enqueueSnackbar('Download functionality would be implemented here', { variant: 'info' });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getAccountTypeColor = (type: TrialBalanceEntry['accountType']) => {
    switch (type) {
      case 'asset': return 'primary';
      case 'liability': return 'warning';
      case 'equity': return 'success';
      case 'revenue': return 'info';
      case 'expense': return 'error';
      default: return 'default';
    }
  };

  // Group entries by account type
  const groupedEntries = trialBalance?.entries.reduce((groups, entry) => {
    if (!groups[entry.accountType]) {
      groups[entry.accountType] = [];
    }
    groups[entry.accountType].push(entry);
    return groups;
  }, {} as Record<string, TrialBalanceEntry[]>) || {};

  // Order of account types
  const accountTypeOrder = ['asset', 'liability', 'equity', 'revenue', 'expense'];

  if (loading && !trialBalance) {
    return <LoadingSpinner fullScreen message="Generating trial balance..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Trial Balance
          </Typography>
          <Box display="flex" gap={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="As of Date"
                value={asOfDate}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    size: 'small',
                  },
                }}
              />
            </LocalizationProvider>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Export
            </Button>
          </Box>
        </Box>

        {trialBalance && (
          <Card>
            <CardContent>
              <Box textAlign="center" mb={3}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Trial Balance
                </Typography>
                <Typography variant="subtitle1">
                  As of {new Date(trialBalance.asOfDate).toLocaleDateString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Generated on {new Date(trialBalance.generatedAt).toLocaleString()}
                </Typography>
              </Box>

              {!trialBalance.isBalanced && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <Typography variant="subtitle2">
                    Trial balance is not balanced! Total debits do not equal total credits.
                  </Typography>
                  <Typography variant="body2">
                    Difference: {formatCurrency(Math.abs(trialBalance.totalDebits - trialBalance.totalCredits))}
                  </Typography>
                </Alert>
              )}

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Account Code</TableCell>
                      <TableCell>Account Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Debit</TableCell>
                      <TableCell align="right">Credit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accountTypeOrder.map(accountType => (
                      <React.Fragment key={accountType}>
                        {/* Account Type Header */}
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                          <TableCell colSpan={5}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {accountType.toUpperCase()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        
                        {/* Accounts of this type */}
                        {groupedEntries[accountType]?.map((entry) => (
                          <TableRow key={entry.accountId}>
                            <TableCell>{entry.accountCode}</TableCell>
                            <TableCell>{entry.accountName}</TableCell>
                            <TableCell>
                              <Chip
                                label={entry.accountType.charAt(0).toUpperCase() + entry.accountType.slice(1)}
                                color={getAccountTypeColor(entry.accountType)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              {entry.debitBalance > 0 ? formatCurrency(entry.debitBalance) : '-'}
                            </TableCell>
                            <TableCell align="right">
                              {entry.creditBalance > 0 ? formatCurrency(entry.creditBalance) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                        
                        {/* Subtotal for this account type */}
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <Typography variant="body2" fontWeight="medium">
                              {accountType.charAt(0).toUpperCase() + accountType.slice(1)} Subtotal:
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(
                                groupedEntries[accountType]?.reduce((sum, entry) => sum + entry.debitBalance, 0) || 0
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(
                                groupedEntries[accountType]?.reduce((sum, entry) => sum + entry.creditBalance, 0) || 0
                              )}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                    
                    {/* Grand Total */}
                    <TableRow sx={{ bgcolor: 'action.selected' }}>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          TOTAL:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          {formatCurrency(trialBalance.totalDebits)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          {formatCurrency(trialBalance.totalCredits)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Chip 
                  label={trialBalance.isBalanced ? "BALANCED" : "NOT BALANCED"} 
                  color={trialBalance.isBalanced ? "success" : "error"}
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </RoleBasedRoute>
  );
};

export default TrialBalancePage;