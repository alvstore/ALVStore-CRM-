import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormField from '@/components/common/FormField';
import { PayrollFormData } from '../types';

interface PayrollFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PayrollFormData) => Promise<void>;
  loading?: boolean;
}

const payrollSchema = yup.object({
  month: yup.number().required('Month is required').min(1).max(12),
  year: yup.number().required('Year is required').min(2000).max(2100),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required')
    .test('is-after-start-date', 'End date must be after start date', function(endDate) {
      const { startDate } = this.parent;
      if (!startDate || !endDate) return true;
      return new Date(endDate) >= new Date(startDate);
    }),
  notes: yup.string().optional(),
});

const PayrollForm: React.FC<PayrollFormProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  const methods = useForm<PayrollFormData>({
    resolver: yupResolver(payrollSchema),
    defaultValues: {
      month: currentMonth,
      year: currentYear,
      startDate: new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0],
      endDate: new Date(currentYear, currentMonth, 0).toISOString().split('T')[0],
      notes: '',
    },
  });

  const { handleSubmit, reset, setValue, watch } = methods;
  const watchedMonth = watch('month');
  const watchedYear = watch('year');

  React.useEffect(() => {
    if (open) {
      reset({
        month: currentMonth,
        year: currentYear,
        startDate: new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0],
        endDate: new Date(currentYear, currentMonth, 0).toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [open, reset, currentMonth, currentYear]);

  // Update start and end dates when month or year changes
  React.useEffect(() => {
    if (watchedMonth && watchedYear) {
      const startDate = new Date(watchedYear, watchedMonth - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(watchedYear, watchedMonth, 0).toISOString().split('T')[0];
      
      setValue('startDate', startDate);
      setValue('endDate', endDate);
    }
  }, [watchedMonth, watchedYear, setValue]);

  const handleFormSubmit = async (data: PayrollFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - 2 + i,
    label: (currentYear - 2 + i).toString(),
  }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Generate New Payroll
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 3 }}>
              Creating a new payroll will generate salary calculations for all active employees for the selected month.
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormField
                  name="month"
                  label="Month"
                  type="select"
                  options={monthOptions}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="year"
                  label="Year"
                  type="select"
                  options={yearOptions}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  name="startDate"
                  label="Start Date"
                  type="date"
                  required
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="endDate"
                  label="End Date"
                  type="date"
                  required
                  disabled
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  name="notes"
                  label="Notes"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Payroll'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default PayrollForm;