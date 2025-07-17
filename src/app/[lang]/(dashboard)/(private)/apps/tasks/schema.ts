import * as yup from 'yup';

export const taskSchema = yup.object({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().optional(),
  status: yup.string().oneOf(['pending', 'in-progress', 'completed', 'cancelled']).required('Status is required'),
  priority: yup.string().oneOf(['low', 'medium', 'high', 'urgent']).required('Priority is required'),
  assignedTo: yup.string().optional(),
  dueDate: yup.string().optional(),
  tags: yup.array().of(yup.string()).default([]),
  relatedToType: yup.string().oneOf(['client', 'project', 'repair', 'quote', 'invoice']).optional(),
  relatedToId: yup.string().optional(),
});