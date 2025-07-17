'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Divider,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Book as BookIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import { useAccountingStore } from '@/modules/accounting/store/accountingStore';

const AccountingDashboardPage: React.FC = () => {
  const router = useRouter();
  const {
    chartOfAccounts,
    journalEntries,
    trialBalance,
    fetchChartOfAccounts,
    fetchJournalEntries,
    fetchTrialBalance,
  } = useAccountingStore();

  React.useEffect(() => {
    fetchChartOfAccounts();
    fetchJournalEntries();
    fetchTrialBalance();
  }, [fetchChartOfAccounts, fetchJournalEntries, fetchTrialBalance]);

  const accountingModules = [
    {
      title: 'Chart of Accounts',
      description: 'Manage your account structure and categories',
      icon: <AccountBalanceIcon fontSize="large" color="primary" />,
      path: '/accounting/chart-of-accounts',
      count: chartOfAccounts.length,
    },
    {
      title: 'Journal Entries',
      description: 'Record and manage accounting transactions',
      icon: <BookIcon fontSize="large" color="secondary" />,
      path: '/accounting/journal-entries',
      count: journalEntries.length,
    },
    {
      title: 'General Ledger',
      description: 'View detailed transaction history by account',
      icon: <ReceiptIcon fontSize="large" color="info" />,
      path: '/accounting/general-ledger',
    },
    {
      title: 'Trial Balance',
      description: 'Generate and review trial balance reports',
      icon: <AssessmentIcon fontSize="large" color="success" />,
      path: '/accounting/trial-balance',
    },
  ];

  // Calculate summary statistics
  const totalAssets = chartOfAccounts
    .filter(account => account.type === 'asset')
    .reduce((sum, account) => sum + account.balance, 0);
    
  const totalLiabilities = chartOfAccounts
    .filter(account => account.type === 'liability')
    .reduce((sum, account) => sum + account.balance, 0);
    
  const totalEquity = chartOfAccounts
    .filter(account => account.type === 'equity')
    .reduce((sum, account) => sum + account.balance, 0);
    
  const totalRevenue = chartOfAccounts
    .filter(account => account.type === 'revenue')
    .reduce((sum, account) => sum + account.balance, 0);
    
  const totalExpenses = chartOfAccounts
    .filter(account => account.type === 'expense')
    .reduce((sum, account) => sum + account.balance, 0);
    
  const netIncome = totalRevenue - totalExpenses;

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Accounting Dashboard
        </Typography>

        {/* Financial Summary */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Assets & Liabilities
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Total Assets:</Typography>
                  <Typography variant="body1" fontWeight="medium">{formatCurrency(totalAssets)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Total Liabilities:</Typography>
                  <Typography variant="body1" fontWeight="medium">{formatCurrency(totalLiabilities)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" fontWeight="medium">Net Worth:</Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="bold"
                    color={(totalAssets - totalLiabilities) >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(totalAssets - totalLiabilities)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Equity
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Owner's Equity:</Typography>
                  <Typography variant="body1" fontWeight="medium">{formatCurrency(totalEquity)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Net Income:</Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="medium"
                    color={netIncome >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(netIncome)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" fontWeight="medium">Total Equity:</Typography>
                  <Typography variant="body1" fontWeight="bold">{formatCurrency(totalEquity + netIncome)}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Income Statement
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Total Revenue:</Typography>
                  <Typography variant="body1" fontWeight="medium" color="success.main">
                    {formatCurrency(totalRevenue)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Total Expenses:</Typography>
                  <Typography variant="body1" fontWeight="medium" color="error.main">
                    {formatCurrency(totalExpenses)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" fontWeight="medium">Net Income:</Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="bold"
                    color={netIncome >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(netIncome)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Accounting Modules */}
        <Typography variant="h5" gutterBottom>
          Accounting Modules
        </Typography>
        <Grid container spacing={3}>
          {accountingModules.map((module, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea 
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                  onClick={() => router.push(module.path)}
                >
                  <CardContent sx={{ width: '100%' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      {module.icon}
                      {module.count !== undefined && (
                        <Chip 
                          label={module.count} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      )}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {module.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {module.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </RoleBasedRoute>
  );
};

export default AccountingDashboardPage;