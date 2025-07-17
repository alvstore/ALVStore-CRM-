'use client';

import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import PayslipView from '@/modules/payroll/components/PayslipView';
import { usePayrollStore } from '@/modules/payroll/store/payrollStore';

const PayslipPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const {
    selectedPayslip,
    loading,
    error,
    fetchPayslip,
    clearError,
  } = usePayrollStore();

  const payslipId = params.id as string;

  React.useEffect(() => {
    if (payslipId) {
      fetchPayslip(payslipId);
    }
  }, [payslipId, fetchPayslip]);

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      clearError();
    }
  }, [error, enqueueSnackbar, clearError]);

  if (loading && !selectedPayslip) {
    return <LoadingSpinner fullScreen message="Loading payslip..." />;
  }

  if (!selectedPayslip) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Payslip Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The requested payslip could not be found or you don't have permission to view it.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/payroll')}
          >
            Back to Payroll
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <RoleBasedRoute allowedRoles={['admin', 'staff']}>
      <Box>
        <Box mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
          >
            Back
          </Button>
        </Box>

        <PayslipView payslip={selectedPayslip} />
      </Box>
    </RoleBasedRoute>
  );
};

export default PayslipPage;