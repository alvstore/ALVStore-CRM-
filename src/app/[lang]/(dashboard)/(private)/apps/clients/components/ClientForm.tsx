'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Chip,
  TextField,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormField from '@/components/common/FormField';
import { clientSchema } from '../schema';
import { ClientFormData } from '../types';

interface ClientFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => Promise<void>;
  initialData?: Partial<ClientFormData>;
  loading?: boolean;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'lead', label: 'Lead' },
];

const availableTags = ['VIP', 'Tech', 'Design', 'Marketing', 'Manufacturing', 'Bulk', 'Enterprise', 'Startup'];

const ClientForm: React.FC<ClientFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [newTag, setNewTag] = React.useState('');
  
  const methods = useForm<ClientFormData>({
    resolver: yupResolver(clientSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      notes: '',
      status: 'active',
      tags: [],
      ...initialData,
    },
  });

  const { handleSubmit, watch, setValue, reset } = methods;
  const tags = watch('tags');

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        name: '',
        company: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        notes: '',
        status: 'active',
        tags: [],
        ...initialData,
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: ClientFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setValue('tags', [...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddAvailableTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setValue('tags', [...tags, tag]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Client' : 'Add New Client'}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormField
                  name="name"
                  label="Full Name"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="company"
                  label="Company"
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
              <Grid item xs={12}>
                <FormField
                  name="street"
                  label="Street Address"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormField
                  name="city"
                  label="City"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormField
                  name="state"
                  label="State"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormField
                  name="zipCode"
                  label="ZIP Code"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="country"
                  label="Country"
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
              <Grid item xs={12}>
                <Box>
                  <Box display="flex" gap={1} mb={2} alignItems="center">
                    <TextField
                      size="small"
                      label="Add Tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <IconButton onClick={handleAddTag} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {availableTags
                      .filter(tag => !tags.includes(tag))
                      .map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          onClick={() => handleAddAvailableTag(tag)}
                          variant="outlined"
                          size="small"
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
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
              {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ClientForm;