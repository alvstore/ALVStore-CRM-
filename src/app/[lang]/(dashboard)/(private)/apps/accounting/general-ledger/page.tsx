'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import LedgerFilters from '../components/LedgerFilters';
import { useAccountingStore } from '../store/accountingStore';
import { DataTableColumn } from '@/types';

const GeneralLedgerPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    generalLedger,
    chartOfAccounts,
    loading,
    error,
    ledgerFilters,
    fetchGeneralLedger,
    fetchChartOfAccounts,
    setLedgerFilters,
    clearError,
  } = useAccountingStore();

  React.useEffect(() => {
    fetchGeneralLedger();
    fetchChartOfAccounts();
  }, [fetchGeneralLedger, fetchChartOfAccounts, ledgerFilters]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  const handleFiltersChange = (newFilters: any) => {
    setLedgerFilters(newFilters);
  };

  const handleClearFilters = () => {
    setLedgerFilters({
      search: '',
      accountId: 'all',
      dateRange: {},
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const columns: DataTableColumn[] = [
    {
      id: 'date',
      label: 'Date',
      minWidth: 100,
      sortable: true,
      format: (value) => formatDate(value),
    },
    {
      id: 'journalEntryNumber',
      label: 'Journal Entry',
      minWidth: 120,
      sortable: true,
    },
    {
      id: 'accountCode',
      label: 'Account Code',
      minWidth: 120,
      sortable: true,
    },
    {
      id: 'accountName',
      label: 'Account Name',
      minWidth: 200,
      sortable: true,
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 250,
      format: (value, row) => (
        <Box>
          <Typography variant="body2">{value}</Typography>
          {row.reference && (
            <Typography variant="caption" color="text.secondary">
              Ref: {row.reference}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'debit',
      label: 'Debit',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value) => value > 0 ? formatCurrency(value) : '-',
    },
    {
      id: 'credit',
      label: 'Credit',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value) => value > 0 ? formatCurrency(value) : '-',
    },
    {
      id: 'balance',
      label: 'Balance',
      minWidth: 120,
      align: 'right',
      format: (value) => formatCurrency(value),
    },
  ];

  // Calculate summary statistics
  const totalDebits = generalLedger.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredits = generalLedger.reduce((sum, entry) => sum + entry.credit, 0);
  const uniqueAccounts = new Set(generalLedger.map(entry => entry.accountId)).size;
  const uniqueJournalEntries = new Set(generalLedger.map(entry => entry.journalEntryId)).size;

  if (loading && generalLedger.length === 0) {
    return <LoadingSpinner fullScreen message="Loading general ledger..." />;
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            General Ledger
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {generalLedger.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Entries
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {uniqueJournalEntries}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Journal Entries
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {formatCurrency(totalDebits)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Debits
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {formatCurrency(totalCredits)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Credits
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <LedgerFilters
          filters={ledgerFilters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          accounts={chartOfAccounts}
        />

        <Card>
          <CardContent sx={{ p: 0 }}>
            <DataTable
              columns={columns}
              data={generalLedger}
              loading={loading}
              searchable={false} // We have custom filters
              pageable={true}
              pageSize={20}
            />
          </CardContent>
        </Card>
      </Box>
    </RoleBasedRoute>
  );
};

export default GeneralLedgerPage;