import * as yup from 'yup';

export const leadSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  company: yup.string().optional(),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone is required').min(10, 'Phone must be at least 10 digits'),
  source: yup.string().oneOf(['website', 'referral', 'social', 'email', 'phone', 'other']).required('Source is required'),
  status: yup.string().oneOf(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost']).required('Status is required'),
  priority: yup.string().oneOf(['low', 'medium', 'high']).required('Priority is required'),
  assignedTo: yup.string().optional(),
  estimatedValue: yup.number().optional().min(0, 'Value must be positive'),
  expectedCloseDate: yup.string().optional(),
  notes: yup.string().optional(),
  tags: yup.array().of(yup.string()).default([]),
  street: yup.string().optional(),
  city: yup.string().optional(),
  state: yup.string().optional(),
  zipCode: yup.string().optional(),
  country: yup.string().optional(),
  nextFollowUpDate: yup.string().optional(),
});