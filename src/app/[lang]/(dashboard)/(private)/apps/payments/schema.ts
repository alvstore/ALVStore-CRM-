import * as yup from 'yup';

export const paymentSchema = yup.object({
  invoiceId: yup.string().required('Invoice is required'),
  amount: yup.number().required('Amount is required').min(0.01, 'Amount must be greater than 0'),
  paymentDate: yup.string().required('Payment date is required'),
  paymentMethod: yup.string().oneOf(['cash', 'card', 'bank_transfer', 'check', 'online']).required('Payment method is required'),
  reference: yup.string().optional(),
  notes: yup.string().optional(),
  status: yup.string().oneOf(['pending', 'completed']).required('Status is required'),
});