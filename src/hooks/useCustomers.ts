'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Customer, CustomerActivity, ContactPerson, Address } from '@/types/apps/crmTypes'
import customerService from '@/services/customerService'
import { useSession } from 'next-auth/react'
import { useCallback } from 'react'

export const useCustomers = (params?: {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
  searchQuery?: string
}) => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const userId = session?.user?.id || 'system'

  // Fetch customers with pagination, sorting, and filtering
  const {
    data: customersData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['customers', { ...params }],
    queryFn: () => customerService.getCustomers({
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      filters: params?.filters,
      searchQuery: params?.searchQuery
    }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Fetch single customer
  const useCustomer = (id: string | number) => {
    return useQuery({
      queryKey: ['customer', id],
      queryFn: () => customerService.getCustomerById(id),
      enabled: !!id
    })
  }

  // Create customer mutation
  const createCustomer = useMutation({
    mutationFn: (customerData: Partial<Customer>) => 
      customerService.createCustomer(customerData, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    }
  })

  // Update customer mutation
  const updateCustomer = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Customer> }) =>
      customerService.updateCustomer(id, data, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['customer', id] })
      queryClient.invalidateQueries({ queryKey: ['customerActivities', id] })
    }
  })

  // Delete customer mutation (soft delete)
  const deleteCustomer = useMutation({
    mutationFn: (id: string | number) => 
      customerService.deleteCustomer(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    }
  })

  // Add contact to customer
  const addContact = useMutation({
    mutationFn: ({ customerId, contact }: { customerId: string | number; contact: Omit<ContactPerson, 'id'> }) =>
      customerService.addContact(customerId, contact, userId),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] })
      queryClient.invalidateQueries({ queryKey: ['customerActivities', customerId] })
    }
  })

  // Add address to customer
  const addAddress = useMutation({
    mutationFn: ({ customerId, address }: { customerId: string | number; address: Omit<Address, 'id'> }) =>
      customerService.addAddress(customerId, address, userId),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] })
      queryClient.invalidateQueries({ queryKey: ['customerActivities', customerId] })
    }
  })

  // Get customer activities
  const useCustomerActivities = (customerId: string | number) => {
    return useQuery({
      queryKey: ['customerActivities', customerId],
      queryFn: () => customerService.getActivities(customerId),
      enabled: !!customerId
    })
  }

  // Add activity
  const addActivity = useMutation({
    mutationFn: ({ customerId, activity }: { customerId: string | number; activity: Omit<CustomerActivity, 'id'> }) =>
      customerService.logActivity(customerId, activity),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customerActivities', customerId] })
    }
  })

  // Bulk actions
  const bulkUpdateStatus = useMutation({
    mutationFn: async ({ ids, status }: { ids: (string | number)[]; status: string }) => {
      const results = await Promise.allSettled(
        ids.map(id => 
          customerService.updateCustomer(id, { status }, userId)
        )
      )
      return results
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    }
  })

  // Export customers
  const exportCustomers = useCallback(async (ids?: (string | number)[]) => {
    const customers = ids 
      ? await customerService.getCustomers({ page: 1, pageSize: 1000, filters: { id: { in: ids } } })
      : await customerService.getCustomers({ page: 1, pageSize: 1000 })
    
    // Convert to CSV (simplified example)
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Type', 'Created At']
    const rows = customers.data.map(c => [
      c.id,
      c.customer,
      c.email,
      c.contact,
      c.status,
      c.type,
      new Date(c.createdAt as string).toLocaleDateString()
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `customers-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  return {
    // Data
    customers: customersData?.data || [],
    total: customersData?.total || 0,
    isLoading,
    isError,
    error,
    refetch,
    
    // Single customer
    useCustomer,
    
    // CRUD operations
    createCustomer: createCustomer.mutateAsync,
    updateCustomer: updateCustomer.mutateAsync,
    deleteCustomer: deleteCustomer.mutateAsync,
    
    // Contacts
    addContact: addContact.mutateAsync,
    
    // Addresses
    addAddress: addAddress.mutateAsync,
    
    // Activities
    useCustomerActivities,
    addActivity: addActivity.mutateAsync,
    
    // Bulk actions
    bulkUpdateStatus: bulkUpdateStatus.mutateAsync,
    exportCustomers,
    
    // Status flags
    isCreating: createCustomer.isLoading,
    isUpdating: updateCustomer.isLoading,
    isDeleting: deleteCustomer.isLoading
  }
}

export default useCustomers
