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
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormField from '@/components/common/FormField';
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

  const { handleSubmit, reset } = methods;

  React.useEffect(() => {
    if (open && initialData) {
      reset({
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
                    <FormField
                      name="firstName"
                      label="First Name"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="lastName"
                      label="Last Name"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="email"
                      label="Email"
                      type="email"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="phone"
                      label="Phone"
                      required
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
                    <FormField
                      name="employeeId"
                      label="Employee ID"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="department"
                      label="Department"
                      type="select"
                      options={departmentOptions}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="position"
                      label="Position"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="joinDate"
                      label="Join Date"
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
                </Grid>
              </Grid>

              {/* Salary Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Salary Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="salary"
                      label="Salary"
                      type="number"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="salaryType"
                      label="Salary Type"
                      type="select"
                      options={salaryTypeOptions}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="bankName"
                      label="Bank Name"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="bankAccount"
                      label="Bank Account Number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="taxId"
                      label="Tax ID"
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
                    <FormField
                      name="street"
                      label="Street Address"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormField
                      name="city"
                      label="City"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormField
                      name="state"
                      label="State/Province"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormField
                      name="zipCode"
                      label="ZIP/Postal Code"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormField
                      name="country"
                      label="Country"
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
                    <FormField
                      name="emergencyContactName"
                      label="Contact Name"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormField
                      name="emergencyContactRelationship"
                      label="Relationship"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormField
                      name="emergencyContactPhone"
                      label="Contact Phone"
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Additional Notes */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Additional Notes
                </Typography>
                <FormField
                  name="notes"
                  label="Notes"
                  multiline
                  rows={4}
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