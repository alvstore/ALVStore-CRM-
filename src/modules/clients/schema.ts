import * as yup from 'yup';

export const clientSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  company: yup.string().optional(),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone is required').min(10, 'Phone must be at least 10 digits'),
  street: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  country: yup.string().required('Country is required'),
  notes: yup.string().optional(),
  status: yup.string().oneOf(['active', 'inactive', 'lead']).required('Status is required'),
  tags: yup.array().of(yup.string()).default([]),
});

export const contactSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone is required').min(10, 'Phone must be at least 10 digits'),
  position: yup.string().optional(),
  department: yup.string().optional(),
  isPrimary: yup.boolean().default(false),
  notes: yup.string().optional(),
});