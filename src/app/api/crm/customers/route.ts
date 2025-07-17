import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Customer, CustomerStatus, CustomerType } from '@/types/apps/crmTypes'

export async function GET(request: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const searchQuery = searchParams.get('searchQuery') || ''
    
    // Parse filters
    const filters: Record<string, any> = {}
    searchParams.forEach((value, key) => {
      if (key.startsWith('filters[')) {
        const filterKey = key.match(/\[([^\]]+)\]/)?.[1]
        if (filterKey) {
          try {
            filters[filterKey] = JSON.parse(value)
          } catch (e) {
            filters[filterKey] = value
          }
        }
      }
    })

    // Build where clause
    const where: any = {
      deletedAt: null
    }

    // Apply search query
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { email: { contains: searchQuery, mode: 'insensitive' } },
        { phone: { contains: searchQuery } },
        { customerId: { contains: searchQuery } }
      ]
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (key === 'status') {
          where.status = { in: Array.isArray(value) ? value : [value] }
        } else if (key === 'type') {
          where.type = { in: Array.isArray(value) ? value : [value] }
        } else if (key === 'assignedTo') {
          where.assignedToId = value
        } else if (key === 'tags') {
          where.tags = { hasSome: Array.isArray(value) ? value : [value] }
        } else if (key === 'createdAt') {
          if (value.from || value.to) {
            where.createdAt = {}
            if (value.from) where.createdAt.gte = new Date(value.from)
            if (value.to) where.createdAt.lte = new Date(value.to)
          }
        } else {
          where[key] = value
        }
      }
    })

    // Get total count
    const total = await prisma.customer.count({ where })

    // Get paginated customers
    const customers = await prisma.customer.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        contacts: true,
        addresses: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    // Format response
    const response = {
      data: customers.map(customer => ({
        ...customer,
        // Map to match frontend types
        customer: customer.name,
        contact: customer.phone,
        // Add any other necessary transformations
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate request body
    const data = await request.json()
    
    // Basic validation
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        ...data,
        createdById: session.user.id,
        status: data.status || 'lead',
        type: data.type || 'individual',
        // Handle contacts and addresses if provided
        contacts: data.contacts ? {
          create: data.contacts.map((contact: any) => ({
            ...contact,
            createdById: session.user.id
          }))
        } : undefined,
        addresses: data.addresses ? {
          create: data.addresses.map((address: any) => ({
            ...address,
            createdById: session.user.id
          }))
        } : undefined
      },
      include: {
        contacts: true,
        addresses: true
      }
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
