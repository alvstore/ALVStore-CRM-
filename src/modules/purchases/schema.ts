import * as yup from 'yup';

export const purchaseOrderItemSchema = yup.object({
  id: yup.string().required(),
  productId: yup.string().optional(),
  productName: yup.string().required('Product name is required'),
  description: yup.string().required('Description is required'),
  quantity: yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
  unitPrice: yup.number().required('Unit price is required').min(0, 'Unit price must be positive'),
  total: yup.number().required(),
  receivedQuantity: yup.number().min(0, 'Received quantity must be positive').default(0),
});

export const purchaseOrderSchema = yup.object({
  supplierId: yup.string().required('Supplier is required'),
  items: yup.array().of(purchaseOrderItemSchema).min(1, 'At least one item is required'),
  taxRate: yup.number().min(0, 'Tax rate must be positive').max(100, 'Tax rate cannot exceed 100%'),
  discountType: yup.string().oneOf(['percentage', 'fixed']).required(),
  discountValue: yup.number().min(0, 'Discount must be positive'),
  orderDate: yup.string().required('Order date is required'),
  expectedDeliveryDate: yup.string().optional(),
  notes: yup.string().optional(),
  terms: yup.string().optional(),
  status: yup.string().oneOf(['draft', 'sent']).required(),
});

export const receiveStockSchema = yup.object({
  purchaseOrderId: yup.string().required(),
  items: yup.array().of(yup.object({
    itemId: yup.string().required(),
    receivedQuantity: yup.number().required('Received quantity is required').min(1, 'Must receive at least 1 item'),
    notes: yup.string().optional(),
  })).min(1, 'At least one item must be received'),
  receivedDate: yup.string().required('Received date is required'),
  notes: yup.string().optional(),
});