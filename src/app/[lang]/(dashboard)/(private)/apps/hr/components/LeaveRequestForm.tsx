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
import { LeaveRequestFormData, LeaveBalance } from '../types';
import { Employee } from '../types';

interface LeaveRequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LeaveRequestFormData) => Promise<void>;
  initialData?: Partial<LeaveRequestFormData>;
  loading?: boolean;
  employees: Employee[];
  leaveBalance?: LeaveBalance | null;
  currentEmployeeId?: string;
}

const leaveRequestSchema = yup.object({
  employeeId: yup.string().required('Employee is required'),
  leaveType: yup.string().required('Leave type is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required')
    .test('is-after-start-date', 'End date must be after start date', function(endDate) {
      const { startDate } = this.parent;
      if (!startDate || !endDate) return true;
      return new Date(endDate) >= new Date(startDate);
    }),
  reason: yup.string().required('Reason is required').min(5, 'Reason must be at least 5 characters'),
});

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  employees,
  leaveBalance,
  currentEmployeeId,
}) => {
  const methods = useForm<LeaveRequestFormData>({
    resolver: yupResolver(leaveRequestSchema),
    defaultValues: {
      employeeId: currentEmployeeId || '',
      leaveType: 'annual',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: '',
      ...initialData,
    },
  });

  const { handleSubmit, reset, watch } = methods;
  const watchedEmployeeId = watch('employeeId');
  const watchedLeaveType = watch('leaveType');
  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        employeeId: currentEmployeeId || '',
        leaveType: 'annual',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        reason: '',
        ...initialData,
      });
    }
  }, [open, initialData, reset, currentEmployeeId]);

  const handleFormSubmit = async (data: LeaveRequestFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  // Calculate total days
  const calculateTotalDays = () => {
    if (!watchedStartDate || !watchedEndDate) return 0;
    
    const start = new Date(watchedStartDate);
    const end = new Date(watchedEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
  };

  const totalDays = calculateTotalDays();

  // Check if employee has enough leave balance
  const hasEnoughBalance = () => {
    if (!leaveBalance || watchedLeaveType === 'unpaid') return true;
    
    return leaveBalance[watchedLeaveType as keyof LeaveBalance] >= totalDays;
  };

  const employeeOptions = [
    { value: '', label: 'Select Employee' },
    ...employees.map(employee => ({ 
      value: employee.id, 
      label: `${employee.firstName} ${employee.lastName} (${employee.employeeId})` 
    })),
  ];

  const leaveTypeOptions = [
    { value: 'annual', label: 'Annual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'personal', label: 'Personal Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Leave Request' : 'New Leave Request'}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormField
                  name="employeeId"
                  label="Employee"
                  type="select"
                  options={employeeOptions}
                  required
                  disabled={!!currentEmployeeId}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="leaveType"
                  label="Leave Type"
                  type="select"
                  options={leaveTypeOptions}
                  required
                />
              </Grid>

              {leaveBalance && watchedEmployeeId && (
                <Grid item xs={12}>
                  <Box p={2} bgcolor="background.default" borderRadius={1}>
                    <Typography variant="subtitle2" gutterBottom>
                      Available Leave Balance:
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2">
                          Annual: {leaveBalance.annual} days
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2">
                          Sick: {leaveBalance.sick} days
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2">
                          Personal: {leaveBalance.personal} days
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <FormField
                  name="startDate"
                  label="Start Date"
                  type="date"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="endDate"
                  label="End Date"
                  type="date"
                  required
                />
              </Grid>

              {watchedStartDate && watchedEndDate && (
                <Grid item xs={12}>
                  <Box p={2} bgcolor="background.default" borderRadius={1}>
                    <Typography variant="body2">
                      Total Days: <strong>{totalDays}</strong>
                    </Typography>
                    
                    {!hasEnoughBalance() && watchedLeaveType !== 'unpaid' && (
                      <Alert severity="warning" sx={{ mt: 1 }}>
                        Insufficient leave balance for {watchedLeaveType} leave.
                      </Alert>
                    )}
                  </Box>
                </Grid>
              )}

              <Grid item xs={12}>
                <FormField
                  name="reason"
                  label="Reason for Leave"
                  multiline
                  rows={3}
                  required
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
              disabled={loading || (totalDays > 0 && !hasEnoughBalance() && watchedLeaveType !== 'unpaid')}
            >
              {loading ? 'Submitting...' : (initialData ? 'Update Request' : 'Submit Request')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default LeaveRequestForm;