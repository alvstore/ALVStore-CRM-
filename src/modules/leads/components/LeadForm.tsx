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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { leadSchema } from '../schema';
import { LeadFormData } from '../types';

interface StaffMember {
  id: string;
  name: string;
  role: string;
}

interface LeadFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  initialData?: Partial<LeadFormData>;
  loading?: boolean;
  staff: StaffMember[];
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
  initialData = {},
  loading = false,
  staff = [],
}) => {
  const [newTag, setNewTag] = React.useState('');
  const [tags, setTags] = React.useState<string[]>(initialData?.tags || []);

  const defaultFormValues: LeadFormData = {
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
  };

  const { handleSubmit, control, reset, formState: { errors }, setValue } = useForm<LeadFormData>({
    resolver: yupResolver(leadSchema) as any, // Type assertion needed for yup resolver
    defaultValues: defaultFormValues,
  });

  const handleFormSubmit = async (formData: LeadFormData) => {
    try {
      // Ensure tags are included in the submitted data
      const dataToSubmit: LeadFormData = { 
        ...formData, 
        tags: [...tags] // Ensure we're passing a new array reference
      };
      await onSubmit(dataToSubmit);
      reset();
      setTags([]);
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Error submitting form:', error);
    }
  };

  const handleAddTag = React.useCallback(() => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      setValue('tags', newTags, { shouldValidate: true });
      setNewTag('');
    }
  }, [newTag, tags, setValue]);

  const handleRemoveTag = React.useCallback((tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags, { shouldValidate: true });
  }, [tags, setValue]);

  const handleAddAvailableTag = React.useCallback((tag: string) => {
    if (!tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      setValue('tags', newTags, { shouldValidate: true });
    }
  }, [tags, setValue]);

  const staffOptions = React.useMemo(() => [
    { value: '', label: 'Unassigned' },
    ...staff.map(({ id, name }) => ({
      value: id,
      label: name,
    })),
  ], [staff]);

  // Reset form when dialog opens or initialData changes
  React.useEffect(() => {
    if (!open) return;
    
    const formValues: LeadFormData = {
      ...defaultFormValues,
      ...initialData,
      tags: initialData?.tags || []
    };
    
    reset(formValues);
    setTags(initialData?.tags || []);
  }, [open, initialData, reset, defaultFormValues]);

  // Return the dialog component
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {initialData ? 'Edit Lead' : 'Add New Lead'}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Basic Information
                </Typography>
              </Box>
            </Grid>
            
            {/* Name */}
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            
            {/* Company */}
            <Grid item xs={12} md={6}>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company"
                    fullWidth
                    margin="normal"
                    error={!!errors.company}
                    helperText={errors.company?.message}
                  />
                )}
              />
            </Grid>
            
            {/* Email */}
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
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            
            {/* Phone */}
            <Grid item xs={12} md={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    fullWidth
                    margin="normal"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>
            
            {/* Source */}
            <Grid item xs={12} md={6}>
              <Controller
                name="source"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal" error={!!errors.source}>
                    <InputLabel>Source</InputLabel>
                    <Select
                      {...field}
                      label="Source"
                      error={!!errors.source}
                    >
                      {sourceOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.source && (
                      <FormHelperText>{errors.source.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            {/* Status */}
            <Grid item xs={12} md={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal" error={!!errors.status}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      {...field}
                      label="Status"
                      error={!!errors.status}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.status && (
                      <FormHelperText>{errors.status.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            {/* Priority */}
            <Grid item xs={12} md={6}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal" error={!!errors.priority}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      {...field}
                      label="Priority"
                      error={!!errors.priority}
                    >
                      {priorityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.priority && (
                      <FormHelperText>{errors.priority.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            {/* Assigned To */}
            <Grid item xs={12} md={6}>
              <Controller
                name="assignedTo"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal" error={!!errors.assignedTo}>
                    <InputLabel>Assigned To</InputLabel>
                    <Select
                      {...field}
                      label="Assigned To"
                      error={!!errors.assignedTo}
                    >
                      {staffOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.assignedTo && (
                      <FormHelperText>{errors.assignedTo.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            {/* Estimated Value */}
            <Grid item xs={12} md={6}>
              <Controller
                name="estimatedValue"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Estimated Value ($)"
                    type="number"
                    fullWidth
                    margin="normal"
                    error={!!errors.estimatedValue}
                    helperText={errors.estimatedValue?.message}
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? undefined : Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </Grid>
            
            {/* Expected Close Date */}
            <Grid item xs={12} md={6}>
              <Controller
                name="expectedCloseDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expected Close Date"
                    type="date"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.expectedCloseDate}
                    helperText={errors.expectedCloseDate?.message}
                  />
                )}
              />
            </Grid>
            
            {/* Next Follow-up Date */}
            <Grid item xs={12} md={6}>
              <Controller
                name="nextFollowUpDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Next Follow-up Date"
                    type="datetime-local"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.nextFollowUpDate}
                    helperText={errors.nextFollowUpDate?.message}
                  />
                )}
              />
            </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2, mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Address (Optional)
                  </Typography>
                </Box>
              </Grid>
              
              {/* Street */}
              <Grid item xs={12}>
                <Controller
                  name="street"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Street Address"
                      fullWidth
                      margin="normal"
                      error={!!errors.street}
                      helperText={errors.street?.message}
                    />
                  )}
                />
              </Grid>
              
              {/* City */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="City"
                      fullWidth
                      margin="normal"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                  )}
                />
              </Grid>
              
              {/* State */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="State/Province"
                      fullWidth
                      margin="normal"
                      error={!!errors.state}
                      helperText={errors.state?.message}
                    />
                  )}
                />
              </Grid>
              
              {/* ZIP Code */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="zipCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ZIP/Postal Code"
                      fullWidth
                      margin="normal"
                      error={!!errors.zipCode}
                      helperText={errors.zipCode?.message}
                    />
                  )}
                />
              </Grid>
              
              {/* Country */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Country"
                      fullWidth
                      margin="normal"
                      error={!!errors.country}
                      helperText={errors.country?.message}
                    />
                  )}
                />
              </Grid>

              {/* Tags */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2, mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Tags
                  </Typography>
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
                    fullWidth
                  />
                  <IconButton 
                    onClick={handleAddTag} 
                    color="primary"
                    disabled={!newTag.trim()}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                
                {tags.length > 0 && (
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                )}
                
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
                        sx={{ 
                          cursor: 'pointer',
                          mb: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      />
                    ))}
                </Box>
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
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
                      margin="normal"
                      error={!!errors.notes}
                      helperText={errors.notes?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
            <Button 
              onClick={onClose} 
              disabled={loading}
              variant="outlined"
              color="inherit"
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              color="primary"
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Saving...' : (initialData ? 'Update Lead' : 'Create Lead')}
            </Button>
          </DialogActions>
        </form>
    </Dialog>
  );
};

export default LeadForm;