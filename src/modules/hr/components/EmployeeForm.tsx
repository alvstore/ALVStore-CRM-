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
  Avatar,
  IconButton,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { EmployeeFormData } from '../types';

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  initialData?: Partial<EmployeeFormData>;
  loading?: boolean;
}

const employeeSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  position: yup.string().required('Position is required'),
  department: yup.string().required('Department is required'),
  employeeId: yup.string().required('Employee ID is required'),
  joinDate: yup.string().required('Join date is required'),
  status: yup.string().required('Status is required'),
  salary: yup.number().required('Salary is required').min(0, 'Salary must be positive'),
  salaryType: yup.string().required('Salary type is required'),
  bankAccount: yup.string().optional(),
  bankName: yup.string().optional(),
  taxId: yup.string().optional(),
  street: yup.string().optional(),
  city: yup.string().optional(),
  state: yup.string().optional(),
  zipCode: yup.string().optional(),
  country: yup.string().optional(),
  emergencyContactName: yup.string().optional(),
  emergencyContactRelationship: yup.string().optional(),
  emergencyContactPhone: yup.string().optional(),
  notes: yup.string().optional(),
});

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [avatarPreview, setAvatarPreview] = React.useState<string>('');
  
  const methods = useForm<EmployeeFormData>({
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      employeeId: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      salary: 0,
      salaryType: 'monthly',
      bankAccount: '',
      bankName: '',
      taxId: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: '',
      notes: '',
      ...initialData,
    },
  });

  const { handleSubmit, reset, control, formState: { errors } } = methods;

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        position: initialData.position || '',
        department: initialData.department || '',
        employeeId: initialData.employeeId || '',
        joinDate: initialData.joinDate || new Date().toISOString().split('T')[0],
        status: initialData.status || 'active',
        salary: initialData.salary || 0,
        salaryType: initialData.salaryType || 'monthly',
        bankAccount: initialData.bankAccount || '',
        bankName: initialData.bankName || '',
        taxId: initialData.taxId || '',
        street: initialData.street || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zipCode: initialData.zipCode || '',
        country: initialData.country || 'USA',
        emergencyContactName: initialData.emergencyContactName || '',
        emergencyContactRelationship: initialData.emergencyContactRelationship || '',
        emergencyContactPhone: initialData.emergencyContactPhone || '',
        notes: initialData.notes || '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        employeeId: '',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
        salary: 0,
        salaryType: 'monthly',
        bankAccount: '',
        bankName: '',
        taxId: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        emergencyContactName: '',
        emergencyContactRelationship: '',
        emergencyContactPhone: '',
        notes: '',
        ...initialData,
      });
      setAvatarPreview('');
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      await onSubmit(data);
      reset();
      setAvatarPreview('');
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleAvatarChange = () => {
    // Mock avatar upload - in a real app, this would open a file picker
    const mockAvatars = [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    ];
    
    const randomAvatar = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
    setAvatarPreview(randomAvatar);
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on_leave', label: 'On Leave' },
    { value: 'terminated', label: 'Terminated' },
  ];

  const salaryTypeOptions = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const departmentOptions = [
    { value: 'Management', label: 'Management' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'IT', label: 'IT' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Customer Support', label: 'Customer Support' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Employee' : 'Add New Employee'}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Avatar and Basic Info */}
              <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  src={avatarPreview}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={handleAvatarChange}
                >
                  <PhotoCameraIcon />
                </IconButton>
                <Typography variant="caption" color="text.secondary">
                  Click to upload photo
                </Typography>
              </Grid>

              <Grid item xs={12} md={9}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="First Name"
                          fullWidth
                          required
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Last Name"
                          fullWidth
                          required
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Email"
                          type="email"
                          fullWidth
                          required
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Phone"
                          fullWidth
                          required
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Employment Details */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Employment Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="employeeId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Employee ID"
                          fullWidth
                          required
                          error={!!errors.employeeId}
                          helperText={errors.employeeId?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.department}>
                      <InputLabel>Department *</InputLabel>
                      <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            label="Department *"
                            required
                          >
                            {departmentOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.department && (
                        <FormHelperText>{errors.department.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="position"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Position"
                          fullWidth
                          required
                          error={!!errors.position}
                          helperText={errors.position?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="joinDate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Join Date"
                          type="date"
                          fullWidth
                          required
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={!!errors.joinDate}
                          helperText={errors.joinDate?.message}
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
                </Grid>
              </Grid>

              {/* Salary Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Salary Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="salary"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Salary"
                          type="number"
                          fullWidth
                          required
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value === '' ? undefined : Number(e.target.value);
                            field.onChange(value);
                          }}
                          error={!!errors.salary}
                          helperText={errors.salary?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.salaryType}>
                      <InputLabel>Salary Type *</InputLabel>
                      <Controller
                        name="salaryType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            label="Salary Type *"
                            required
                          >
                            {salaryTypeOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.salaryType && (
                        <FormHelperText>{errors.salaryType.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="bankName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Bank Name"
                          fullWidth
                          error={!!errors.bankName}
                          helperText={errors.bankName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="bankAccount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Bank Account Number"
                          fullWidth
                          error={!!errors.bankAccount}
                          helperText={errors.bankAccount?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="taxId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Tax ID"
                          fullWidth
                          error={!!errors.taxId}
                          helperText={errors.taxId?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Address
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="street"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Street Address"
                          fullWidth
                          error={!!errors.street}
                          helperText={errors.street?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="City"
                          fullWidth
                          error={!!errors.city}
                          helperText={errors.city?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="State/Province"
                          fullWidth
                          error={!!errors.state}
                          helperText={errors.state?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="zipCode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="ZIP/Postal Code"
                          fullWidth
                          error={!!errors.zipCode}
                          helperText={errors.zipCode?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Country"
                          fullWidth
                          error={!!errors.country}
                          helperText={errors.country?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Emergency Contact */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Emergency Contact
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="emergencyContactName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contact Name"
                          fullWidth
                          error={!!errors.emergencyContactName}
                          helperText={errors.emergencyContactName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="emergencyContactRelationship"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Relationship"
                          fullWidth
                          error={!!errors.emergencyContactRelationship}
                          helperText={errors.emergencyContactRelationship?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="emergencyContactPhone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contact Phone"
                          fullWidth
                          error={!!errors.emergencyContactPhone}
                          helperText={errors.emergencyContactPhone?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Additional Notes */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Additional Notes
                </Typography>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notes"
                      multiline
                      rows={4}
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
              {loading ? 'Saving...' : (initialData ? 'Update Employee' : 'Add Employee')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default EmployeeForm;