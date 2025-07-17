import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormHelperText,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormField from '@/components/common/FormField';
import { AttendanceFormData } from '../types';
import { Employee } from '../types';

interface AttendanceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AttendanceFormData) => Promise<void>;
  initialData?: Partial<AttendanceFormData>;
  loading?: boolean;
  employees: Employee[];
}

const attendanceSchema = yup.object({
  employeeId: yup.string().required('Employee is required'),
  date: yup.string().required('Date is required'),
  checkIn: yup.string().optional(),
  checkOut: yup.string().optional(),
  status: yup.string().required('Status is required'),
  notes: yup.string().optional(),
});

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  employees,
}) => {
  const methods = useForm<AttendanceFormData>({
    resolver: yupResolver(attendanceSchema),
    defaultValues: {
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      checkIn: '',
      checkOut: '',
      status: 'present',
      notes: '',
      ...initialData,
    },
  });

  const { handleSubmit, reset, watch } = methods;
  const watchedStatus = watch('status');

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        checkIn: '',
        checkOut: '',
        status: 'present',
        notes: '',
        ...initialData,
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: AttendanceFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const employeeOptions = [
    { value: '', label: 'Select Employee' },
    ...employees.map(employee => ({ 
      value: employee.id, 
      label: `${employee.firstName} ${employee.lastName} (${employee.employeeId})` 
    })),
  ];

  const statusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'half_day', label: 'Half Day' },
    { value: 'leave', label: 'Leave' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Attendance Record' : 'Add Attendance Record'}
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
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="date"
                  label="Date"
                  type="date"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="status"
                  label="Status"
                  type="select"
                  options={statusOptions}
                  required
                />
              </Grid>
              {watchedStatus !== 'absent' && watchedStatus !== 'leave' && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="checkIn"
                      label="Check-in Time"
                      type="text"
                      placeholder="HH:MM:SS"
                    />
                    <FormHelperText>Format: 09:00:00</FormHelperText>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="checkOut"
                      label="Check-out Time"
                      type="text"
                      placeholder="HH:MM:SS"
                    />
                    <FormHelperText>Format: 17:00:00</FormHelperText>
                  </Grid>
                </>
              )}
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
              {loading ? 'Saving...' : (initialData ? 'Update Record' : 'Add Record')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default AttendanceForm;