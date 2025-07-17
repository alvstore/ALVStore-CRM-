import * as yup from 'yup';

export const bankAccountSchema = yup.object({
  name: yup.string().required('Account name is required').min(2, 'Name must be at least 2 characters'),
  accountNumber: yup.string().required('Account number is required'),
  bankName: yup.string().required('Bank name is required'),
  accountType: yup.string().oneOf(['checking', 'savings', 'credit', 'loan', 'investment']).required('Account type is required'),
  currency: yup.string().required('Currency is required'),
  openingBalance: yup.number().required('Opening balance is required'),
  openingDate: yup.string().required('Opening date is required'),
  description: yup.string().optional(),
});

export const transactionSchema = yup.object({
  accountId: yup.string().required('Account is required'),
  type: yup.string().oneOf(['deposit', 'withdraw', 'transfer']).required('Transaction type is required'),
  amount: yup.number().required('Amount is required').min(0.01, 'Amount must be greater than 0'),
  description: yup.string().required('Description is required').min(3, 'Description must be at least 3 characters'),
  reference: yup.string().optional(),
  category: yup.string().optional(),
  date: yup.string().required('Date is required'),
  transferToAccountId: yup.string().when('type', {
    is: 'transfer',
    then: (schema) => schema.required('Transfer destination account is required'),
    otherwise: (schema) => schema.optional(),
  }),
});