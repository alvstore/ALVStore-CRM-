import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormField from '@/components/common/FormField';
import { SalaryComponent } from '../types';

interface SalaryComponentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SalaryComponent, 'id'>) => Promise<void>;
  initialData?: Partial<SalaryComponent>;
  loading?: boolean;
}

const salaryComponentSchema = yup.object({
  name: yup.string().required('Name is required'),
  type: yup.string().oneOf(['earning', 'deduction']).required('Type is required'),
  calculationType: yup.string().oneOf(['fixed', 'percentage']).required('Calculation type is required'),
  value: yup.number().required('Value is required').min(0, 'Value must be positive'),
  taxable: yup.boolean().required('Taxable status is required'),
  description: yup.string().optional(),
  isDefault: yup.boolean().default(false),
});

const SalaryComponentForm: React.FC<SalaryComponentFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const methods = useForm<Omit<SalaryComponent, 'id'>>({
    resolver: yupResolver(salaryComponentSchema),
    defaultValues: {
      name: '',
      type: 'earning',
      calculationType: 'fixed',
      value: 0,
      taxable: false,
      description: '',
      isDefault: false,
      ...initialData,
    },
  });

  const { handleSubmit, reset, watch } = methods;
  const watchedType = watch('type');
  const watchedCalculationType = watch('calculationType');

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        name: '',
        type: 'earning',
        calculationType: 'fixed',
        value: 0,
        taxable: false,
        description: '',
        isDefault: false,
        ...initialData,
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: Omit<SalaryComponent, 'id'>) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const typeOptions = [
    { value: 'earning', label: 'Earning' },
    { value: 'deduction', label: 'Deduction' },
  ];

  const calculationTypeOptions = [
    { value: 'fixed', label: 'Fixed Amount' },
    { value: 'percentage', label: 'Percentage' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData?.id ? 'Edit Salary Component' : 'Add Salary Component'}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormField
                  name="name"
                  label="Component Name"
                  required
                  helperText="E.g., Basic Salary, House Rent Allowance, Income Tax"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="type"
                  label="Component Type"
                  type="select"
                  options={typeOptions}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="calculationType"
                  label="Calculation Type"
                  type="select"
                  options={calculationTypeOptions}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="value"
                  label={watchedCalculationType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                  type="number"
                  required
                  helperText={watchedCalculationType === 'percentage' ? 'Enter percentage value (e.g., 10 for 10%)' : 'Enter fixed amount'}
                />
              </Grid>
              <Grid item xs={12}>
                <FormField
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  helperText="Optional description of this salary component"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <FormField
                      name="taxable"
                      type="checkbox"
                    />
                  }
                  label="Taxable Component"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <FormField
                      name="isDefault"
                      type="checkbox"
                    />
                  }
                  label="Default Component (applied to all employees)"
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
              {loading ? 'Saving...' : (initialData?.id ? 'Update Component' : 'Add Component')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default SalaryComponentForm;