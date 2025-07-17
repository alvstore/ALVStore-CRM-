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
import { Add as AddIcon } from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormField from '@/components/common/FormField';
import { leadSchema } from '../schema';
import { LeadFormData } from '../types';

interface LeadFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  initialData?: Partial<LeadFormData>;
  loading?: boolean;
  staff: Array<{ id: string; name: string; role: string }>;
}

const sourceOptions = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social', label: 'Social Media' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'other', label: 'Other' },
];

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal Sent' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const availableTags = ['Hot Lead', 'Enterprise', 'SMB', 'Referral', 'Demo Requested', 'Budget Confirmed', 'Decision Maker'];

const LeadForm: React.FC<LeadFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  staff,
}) => {
  const [newTag, setNewTag] = React.useState('');
  
  const methods = useForm<LeadFormData>({
    resolver: yupResolver(leadSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      source: 'website',
      status: 'new',
      priority: 'medium',
      assignedTo: '',
      estimatedValue: undefined,
      expectedCloseDate: '',
      notes: '',
      tags: [],
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      nextFollowUpDate: '',
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
        source: 'website',
        status: 'new',
        priority: 'medium',
        assignedTo: '',
        estimatedValue: undefined,
        expectedCloseDate: '',
        notes: '',
        tags: [],
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        nextFollowUpDate: '',
        ...initialData,
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: LeadFormData) => {
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

  const staffOptions = [
    { value: '', label: 'Unassigned' },
    ...staff.map(member => ({ value: member.id, label: member.name })),
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Lead' : 'Add New Lead'}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <h4>Basic Information</h4>
                </Box>
              </Grid>
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

              {/* Lead Details */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2, mt: 2 }}>
                  <h4>Lead Details</h4>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormField
                  name="source"
                  label="Source"
                  type="select"
                  options={sourceOptions}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormField
                  name="status"
                  label="Status"
                  type="select"
                  options={statusOptions}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormField
                  name="priority"
                  label="Priority"
                  type="select"
                  options={priorityOptions}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="assignedTo"
                  label="Assigned To"
                  type="select"
                  options={staffOptions}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="estimatedValue"
                  label="Estimated Value ($)"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="expectedCloseDate"
                  label="Expected Close Date"
                  type="date"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="nextFollowUpDate"
                  label="Next Follow-up Date"
                  type="date"
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2, mt: 2 }}>
                  <h4>Address (Optional)</h4>
                </Box>
              </Grid>
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
                  label="State"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormField
                  name="zipCode"
                  label="ZIP Code"
                />
              </Grid>

              {/* Tags */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2, mt: 2 }}>
                  <h4>Tags</h4>
                </Box>
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
              </Grid>

              {/* Notes */}
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

export default LeadForm;