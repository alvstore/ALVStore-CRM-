import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { POSOrderType, POSProductType } from '@/types/apps/posTypes'

// Define a service using a base URL and expected endpoints
export const posApi = createApi({
  reducerPath: 'posApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/pos' }),
  tagTypes: ['Orders', 'Products'],
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query<POSProductType[], void>({
      query: () => 'products',
      providesTags: ['Products']
    }),
    
    getProductByBarcode: builder.query<POSProductType, string>({
      query: (barcode) => `products/barcode/${barcode}`
    }),
    
    // Orders
    getOrders: builder.query<POSOrderType[], void>({
      query: () => 'orders',
      providesTags: ['Orders']
    }),
    
    getOrderById: builder.query<POSOrderType, string>({
      query: (id) => `orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Orders', id }]
    }),
    
    createOrder: builder.mutation<POSOrderType, Partial<POSOrderType>>({
      query: (order) => ({
        url: 'orders',
        method: 'POST',
        body: order
      }),
      invalidatesTags: ['Orders']
    }),
    
    updateOrderStatus: builder.mutation<POSOrderType, { id: string; status: string }>({
      query: ({ id, ...patch }) => ({
        url: `orders/${id}/status`,
        method: 'PATCH',
        body: patch
      }),
      invalidatesTags: ['Orders']
    }),
    
    // Reports
    getSalesReport: builder.query<{
      date: string
      totalSales: number
      totalOrders: number
    }[], { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => ({
        url: 'reports/sales',
        params: { startDate, endDate }
      })
    })
  })
})

// Export hooks for usage in functional components
export const {
  useGetProductsQuery,
  useGetProductByBarcodeQuery,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useGetSalesReportQuery
} = posApi
