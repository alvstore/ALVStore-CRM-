import * as yup from 'yup';

export const expenseSchema = yup.object({
  date: yup.string().required('Date is required'),
  amount: yup.number().required('Amount is required').min(0.01, 'Amount must be greater than 0'),
  vendor: yup.string().required('Vendor is required').min(2, 'Vendor name must be at least 2 characters'),
  category: yup.string().required('Category is required'),
  description: yup.string().required('Description is required').min(3, 'Description must be at least 3 characters'),
  notes: yup.string().optional(),
  paymentMethod: yup.string().oneOf(['cash', 'card', 'bank_transfer', 'check']).required('Payment method is required'),
  reference: yup.string().optional(),
  status: yup.string().oneOf(['pending', 'approved']).required('Status is required'),
});