import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
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

    const { id: customerId } = params
    const data = await request.json()

    // Validate required fields
    if (!data.street || !data.city || !data.state || !data.postalCode || !data.country) {
      return NextResponse.json(
        { error: 'Street, city, state, postal code, and country are required' },
        { status: 400 }
      )
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId, deletedAt: null }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // If this is set as default, update other addresses
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: {
          customerId,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      })
    }

    // Create address
    const address = await prisma.address.create({
      data: {
        ...data,
        customerId,
        createdById: session.user.id,
        isDefault: data.isDefault || false
      }
    })

    // Log activity
    await prisma.customerActivity.create({
      data: {
        type: 'address',
        title: 'Address added',
        description: `Added new ${data.type} address`,
        customerId,
        userId: session.user.id,
        metadata: { addressId: address.id }
      }
    })

    return NextResponse.json(address, { status: 201 })
  } catch (error) {
    console.error('Error adding address:', error)
    return NextResponse.json(
      { error: 'Failed to add address' },
      { status: 500 }
    )
  }
}

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

    const { id: customerId } = params

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId, deletedAt: null }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Get all addresses for customer
    const addresses = await prisma.address.findMany({
      where: { customerId },
      orderBy: [{ isDefault: 'desc' }, { type: 'asc' }]
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}
