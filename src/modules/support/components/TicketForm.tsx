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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { SupportTicketFormData, TicketCategory } from '../types';

interface TicketFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SupportTicketFormData) => Promise<void>;
  initialData?: Partial<SupportTicketFormData>;
  loading?: boolean;
  clients: Array<{ id: string; name: string; email: string }>;
  staff: Array<{ id: string; name: string; role: string }>;
  categories: TicketCategory[];
}

const ticketSchema = yup.object({
  clientId: yup.string().required('Client is required'),
  subject: yup.string().required('Subject is required').min(5, 'Subject must be at least 5 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  status: yup.string().oneOf(['open', 'in_progress', 'resolved', 'closed']).required('Status is required'),
  priority: yup.string().oneOf(['low', 'medium', 'high', 'urgent']).required('Priority is required'),
  assignedTo: yup.string().optional(),
  category: yup.string().required('Category is required'),
});

const TicketForm: React.FC<TicketFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  clients,
  staff,
  categories,
}) => {
  const methods = useForm<SupportTicketFormData>({
    resolver: yupResolver(ticketSchema),
    defaultValues: {
      clientId: '',
      subject: '',
      description: '',
      status: 'open',
      priority: 'medium',
      assignedTo: '',
      category: '',
      ...initialData,
    },
  });

  const { handleSubmit, reset, register, formState: { errors } } = methods;

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        clientId: '',
        subject: '',
        description: '',
        status: 'open',
        priority: 'medium',
        assignedTo: '',
        category: '',
        ...initialData,
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: SupportTicketFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const clientOptions = [
    { value: '', label: 'Select Client' },
    ...clients.map(client => ({ value: client.id, label: client.name })),
  ];

  const staffOptions = [
    { value: '', label: 'Unassigned' },
    ...staff.map(member => ({ value: member.id, label: member.name })),
  ];

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    ...categories.map(category => ({ value: category.name, label: category.name })),
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Support Ticket' : 'Create Support Ticket'}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.clientId}>
                  <InputLabel>Client *</InputLabel>
                  <Select
                    {...register('clientId')}
                    label="Client *"
                    defaultValue=""
                  >
                    {clientOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.clientId && (
                    <FormHelperText>{errors.clientId.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  {...register('subject')}
                  label="Subject"
                  fullWidth
                  required
                  error={!!errors.subject}
                  helperText={errors.subject?.message || "Brief summary of the issue"}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  {...register('description')}
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  required
                  error={!!errors.description}
                  helperText={errors.description?.message || "Detailed description of the issue"}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    {...register('category')}
                    label="Category *"
                    defaultValue=""
                  >
                    {categoryOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <FormHelperText>{errors.category.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.priority}>
                  <InputLabel>Priority *</InputLabel>
                  <Select
                    {...register('priority')}
                    label="Priority *"
                    defaultValue="medium"
                  >
                    {priorityOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.priority && (
                    <FormHelperText>{errors.priority.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel>Status *</InputLabel>
                  <Select
                    {...register('status')}
                    label="Status *"
                    defaultValue="open"
                  >
                    {statusOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.status && (
                    <FormHelperText>{errors.status.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.assignedTo}>
                  <InputLabel>Assign To</InputLabel>
                  <Select
                    {...register('assignedTo')}
                    label="Assign To"
                    defaultValue=""
                  >
                    {staffOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.assignedTo && (
                    <FormHelperText>{errors.assignedTo.message}</FormHelperText>
                  )}
                </FormControl>
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
              {loading ? 'Saving...' : (initialData ? 'Update Ticket' : 'Create Ticket')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default TicketForm;