import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormHelperText,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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

// Define the status type
type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'leave';

// Define the form values interface
interface AttendanceFormValues {
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: AttendanceStatus;
  notes?: string;
}

// Create a Yup schema with proper typing
const attendanceSchema = yup.object({
  employeeId: yup.string().required('Employee is required'),
  date: yup.string().required('Date is required'),
  checkIn: yup.string().required('Check-in time is required'),
  checkOut: yup.string().optional(),
  status: yup
    .string()
    .oneOf<AttendanceStatus>(
      ['present', 'absent', 'late', 'half_day', 'leave'],
      'Invalid status'
    )
    .required('Status is required'),
  notes: yup.string().optional(),
}).required();

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  employees,
}) => {
// Define default form values
const defaultValues: AttendanceFormValues = {
  employeeId: '',
  date: new Date().toISOString().split('T')[0],
  checkIn: '',
  checkOut: '',
  status: 'present',
  notes: '',
};

const methods = useForm<AttendanceFormValues>({
  resolver: yupResolver(attendanceSchema),
  defaultValues,
});

const { handleSubmit, reset, watch, control, formState: { errors } } = methods;
const watchedStatus = watch('status');

// Reset form when opening/closing or when initialData changes
React.useEffect(() => {
  if (open) {
    if (initialData) {
      // Create a new object with default values and override with initialData
      const initialValues: AttendanceFormValues = {
        ...defaultValues,
        ...initialData,
        // Ensure status is properly typed
        status: (initialData.status as AttendanceStatus) || defaultValues.status,
      };
      reset(initialValues);
    } else {
      reset(defaultValues);
    }
  }
}, [open, initialData, reset, defaultValues]);

  const handleFormSubmit = async (formData: AttendanceFormValues) => {
    try {
      // Convert form values to AttendanceFormData
      const attendanceData: AttendanceFormData = {
        employeeId: formData.employeeId,
        date: formData.date,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        status: formData.status,
        notes: formData.notes,
      };
      
      await onSubmit(attendanceData);
      reset(defaultValues);
      onClose();
    } catch (error) {
      console.error('Error submitting attendance:', error);
      // You might want to show an error message to the user here
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
                <FormControl fullWidth error={!!errors.employeeId}>
                  <InputLabel>Employee *</InputLabel>
                  <Controller
                    name="employeeId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Employee *"
                        required
                      >
                        {employeeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.employeeId && (
                    <FormHelperText>{errors.employeeId.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Date"
                      type="date"
                      fullWidth
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!errors.date}
                      helperText={errors.date?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel>Status *</InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Status *"
                        required
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <FormHelperText>{errors.status.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              {watchedStatus !== 'absent' && watchedStatus !== 'leave' && (
                <>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="checkIn"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Check-in Time"
                          placeholder="HH:MM:SS"
                          fullWidth
                          error={!!errors.checkIn}
                          helperText={errors.checkIn?.message}
                        />
                      )}
                    />
                    <FormHelperText>Format: 09:00:00</FormHelperText>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="checkOut"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Check-out Time"
                          placeholder="HH:MM:SS"
                          fullWidth
                          error={!!errors.checkOut}
                          helperText={errors.checkOut?.message}
                        />
                      )}
                    />
                    <FormHelperText>Format: 17:00:00</FormHelperText>
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notes"
                      multiline
                      rows={3}
                      fullWidth
                      error={!!errors.notes}
                      helperText={errors.notes?.message}
                    />
                  )}
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