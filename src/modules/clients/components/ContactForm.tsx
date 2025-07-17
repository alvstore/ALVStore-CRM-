'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormField from '@/components/common/FormField';
import { contactSchema } from '../schema';
import { ContactFormData } from '../types';

interface ContactFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
  initialData?: Partial<ContactFormData>;
  loading?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const methods = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      isPrimary: false,
      notes: '',
      ...initialData,
    },
  });

  const { handleSubmit, reset } = methods;

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        isPrimary: false,
        notes: '',
        ...initialData,
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Contact' : 'Add New Contact'}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormField
                  name="name"
                  label="Full Name"
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
              <Grid item xs={12} md={6}>
                <FormField
                  name="position"
                  label="Position"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="department"
                  label="Department"
                />
              </Grid>
              <Grid item xs={12}>
                <FormField
                  name="isPrimary"
                  label="Primary Contact"
                  type="checkbox"
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
              {loading ? 'Saving...' : (initialData ? 'Update' : 'Add')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ContactForm;