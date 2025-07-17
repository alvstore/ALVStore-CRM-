import * as yup from 'yup';

export const productSchema = yup.object({
  sku: yup.string().required('SKU is required').min(2, 'SKU must be at least 2 characters'),
  barcode: yup.string().optional(),
  name: yup.string().required('Product name is required').min(2, 'Name must be at least 2 characters'),
  description: yup.string().optional(),
  category: yup.string().required('Category is required'),
  brand: yup.string().optional(),
  unit: yup.string().required('Unit is required'),
  costPrice: yup.number().required('Cost price is required').min(0, 'Cost price must be positive'),
  sellingPrice: yup.number().required('Selling price is required').min(0, 'Selling price must be positive'),
  quantity: yup.number().required('Quantity is required').min(0, 'Quantity must be positive'),
  minStockLevel: yup.number().required('Minimum stock level is required').min(0, 'Minimum stock level must be positive'),
  maxStockLevel: yup.number().optional().min(0, 'Maximum stock level must be positive'),
  location: yup.string().optional(),
  supplier: yup.string().optional(),
  status: yup.string().oneOf(['active', 'inactive', 'discontinued']).required('Status is required'),
  tags: yup.array().of(yup.string()).default([]),
});

export const stockMovementSchema = yup.object({
  productId: yup.string().required('Product is required'),
  type: yup.string().oneOf(['in', 'out', 'adjustment']).required('Movement type is required'),
  quantity: yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
  reason: yup.string().required('Reason is required').min(3, 'Reason must be at least 3 characters'),
  reference: yup.string().optional(),
  notes: yup.string().optional(),
  date: yup.string().required('Date is required'),
});