import * as yup from 'yup';

export const chartOfAccountSchema = yup.object({
  code: yup.string().required('Account code is required').matches(/^\d+$/, 'Account code must contain only numbers'),
  name: yup.string().required('Account name is required').min(2, 'Account name must be at least 2 characters'),
  type: yup.string().oneOf(['asset', 'liability', 'equity', 'revenue', 'expense']).required('Account type is required'),
  category: yup.string().required('Category is required'),
  parentId: yup.string().optional(),
  description: yup.string().optional(),
});

export const journalEntryLineSchema = yup.object({
  accountId: yup.string().required('Account is required'),
  description: yup.string().optional(),
  debit: yup.number().min(0, 'Debit must be positive or zero'),
  credit: yup.number().min(0, 'Credit must be positive or zero'),
  reference: yup.string().optional(),
});

export const journalEntrySchema = yup.object({
  date: yup.string().required('Date is required'),
  description: yup.string().required('Description is required').min(3, 'Description must be at least 3 characters'),
  reference: yup.string().optional(),
  entries: yup.array()
    .of(journalEntryLineSchema)
    .min(2, 'At least two entries are required')
    .test(
      'balanced',
      'Journal entry must be balanced (total debits must equal total credits)',
      (entries) => {
        if (!entries) return false;
        const totalDebit = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
        const totalCredit = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
        return Math.abs(totalDebit - totalCredit) < 0.01;
      }
    )
    .test(
      'no-empty-entries',
      'Each entry must have either a debit or credit amount',
      (entries) => {
        if (!entries) return false;
        return entries.every(entry => (entry.debit > 0 && entry.credit === 0) || (entry.credit > 0 && entry.debit === 0));
      }
    ),
});