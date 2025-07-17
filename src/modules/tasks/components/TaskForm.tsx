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
import { taskSchema } from '../schema';
import { TaskFormData } from '../types';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  initialData?: Partial<TaskFormData>;
  loading?: boolean;
  staff: Array<{ id: string; name: string; role: string }>;
}

const statusOptions = [
  { value: 'pending', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const availableTags = ['bug', 'feature', 'documentation', 'design', 'research', 'meeting', 'client', 'internal', 'urgent'];

const relatedToTypeOptions = [
  { value: '', label: 'None' },
  { value: 'client', label: 'Client' },
  { value: 'project', label: 'Project' },
  { value: 'repair', label: 'Repair Job' },
  { value: 'quote', label: 'Quote' },
  { value: 'invoice', label: 'Invoice' },
];

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  staff,
}) => {
  const [newTag, setNewTag] = React.useState('');
  
  const methods = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      assignedTo: '',
      dueDate: '',
      tags: [],
      relatedToType: undefined,
      relatedToId: undefined,
      ...initialData,
    },
  });

  const { handleSubmit, watch, setValue, reset } = methods;
  const tags = watch('tags');
  const watchedRelatedToType = watch('relatedToType');

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        assignedTo: '',
        dueDate: '',
        tags: [],
        relatedToType: undefined,
        relatedToId: undefined,
        ...initialData,
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: TaskFormData) => {
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

  // Mock related items based on type
  const getRelatedToOptions = () => {
    if (!watchedRelatedToType) return [{ value: '', label: 'Select...' }];
    
    switch (watchedRelatedToType) {
      case 'client':
        return [
          { value: '1', label: 'John Smith' },
          { value: '2', label: 'Emily Davis' },
          { value: '3', label: 'Michael Brown' },
        ];
      case 'project':
        return [
          { value: '1', label: 'Website Redesign' },
          { value: '2', label: 'Mobile App Development' },
          { value: '3', label: 'Network Infrastructure Upgrade' },
        ];
      case 'repair':
        return [
          { value: '1', label: 'Repair #REP-001 - iPhone Screen' },
          { value: '2', label: 'Repair #REP-002 - Laptop Battery' },
          { value: '3', label: 'Repair #REP-003 - Printer Maintenance' },
        ];
      case 'quote':
        return [
          { value: '1', label: 'Quote #QUO-2024-001' },
          { value: '2', label: 'Quote #QUO-2024-002' },
          { value: '3', label: 'Quote #QUO-2024-003' },
        ];
      case 'invoice':
        return [
          { value: '1', label: 'Invoice #INV-2024-001' },
          { value: '2', label: 'Invoice #INV-2024-002' },
          { value: '3', label: 'Invoice #INV-2024-003' },
        ];
      default:
        return [{ value: '', label: 'Select...' }];
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormField
                  name="title"
                  label="Task Title"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormField
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
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
              <Grid item xs={12} md={6}>
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
                  name="dueDate"
                  label="Due Date"
                  type="date"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  name="relatedToType"
                  label="Related To"
                  type="select"
                  options={relatedToTypeOptions}
                />
              </Grid>
              
              {watchedRelatedToType && (
                <Grid item xs={12} md={6}>
                  <FormField
                    name="relatedToId"
                    label={`Select ${watchedRelatedToType}`}
                    type="select"
                    options={getRelatedToOptions()}
                    required={!!watchedRelatedToType}
                  />
                </Grid>
              )}
              
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
              {loading ? 'Saving...' : (initialData ? 'Update Task' : 'Create Task')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default TaskForm;