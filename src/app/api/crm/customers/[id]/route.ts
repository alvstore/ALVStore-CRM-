import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Get customer with related data
    const customer = await prisma.customer.findUnique({
      where: { id, deletedAt: null },
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
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const data = await request.json()

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id, deletedAt: null }
    })

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Update customer
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        ...data,
        // Don't update these fields
        id: undefined,
        customerId: undefined,
        createdAt: undefined,
        createdById: undefined,
        // Update timestamps
        updatedAt: new Date()
      },
      include: {
        contacts: true,
        addresses: true
      }
    })

    // Log activity
    await prisma.customerActivity.create({
      data: {
        type: 'note',
        title: 'Customer updated',
        description: 'Customer information was updated',
        customerId: id,
        userId: session.user.id,
        metadata: data // Store changes in metadata
      }
    })

    return NextResponse.json(updatedCustomer)
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and permissions
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has permission to delete
    const hasPermission = await checkPermission(session.user.id, 'customer', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { id } = params

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id, deletedAt: null }
    })

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Soft delete (set deletedAt timestamp)
    await prisma.customer.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
        // Invalidate any active sessions/tokens for this customer
        // (if implementing customer login)
      }
    })

    // Log activity
    await prisma.customerActivity.create({
      data: {
        type: 'system',
        title: 'Customer deactivated',
        description: 'Customer was deactivated',
        customerId: id,
        userId: session.user.id
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    )
  }
}

async function checkPermission(userId: string, resource: string, action: string) {
  // Implement your permission logic here
  // This is a simplified example
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { roles: true }
  })

  // Check if user has admin role
  const isAdmin = user?.roles.some(role => role.name === 'admin')
  if (isAdmin) return true

  // Check specific permissions
  // In a real app, you'd query the permissions table
  return false
}
