import * as yup from 'yup';

export const quoteItemSchema = yup.object({
  id: yup.string().required(),
  description: yup.string().required('Description is required'),
  quantity: yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
  unitPrice: yup.number().required('Unit price is required').min(0, 'Unit price must be positive'),
  total: yup.number().required(),
});

export const quoteSchema = yup.object({
  clientId: yup.string().required('Client is required'),
  items: yup.array().of(quoteItemSchema).min(1, 'At least one item is required'),
  taxRate: yup.number().min(0, 'Tax rate must be positive').max(100, 'Tax rate cannot exceed 100%'),
  discountType: yup.string().oneOf(['percentage', 'fixed']).required(),
  discountValue: yup.number().min(0, 'Discount must be positive'),
  validUntil: yup.string().required('Valid until date is required'),
  notes: yup.string().optional(),
  terms: yup.string().optional(),
  status: yup.string().oneOf(['draft', 'sent']).required(),
});

export const convertToInvoiceSchema = yup.object({
  quoteId: yup.string().required(),
  dueDate: yup.string().required('Due date is required'),
  notes: yup.string().optional(),
});