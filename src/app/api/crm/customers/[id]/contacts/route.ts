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
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
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

    // Create contact
    const contact = await prisma.contact.create({
      data: {
        ...data,
        customerId,
        createdById: session.user.id,
        isPrimary: data.isPrimary || false
      }
    })

    // If this is set as primary, update other contacts
    if (data.isPrimary) {
      await prisma.contact.updateMany({
        where: {
          customerId,
          id: { not: contact.id },
          isPrimary: true
        },
        data: {
          isPrimary: false
        }
      })
    }

    // Log activity
    await prisma.customerActivity.create({
      data: {
        type: 'contact',
        title: 'Contact added',
        description: `Added contact: ${data.name}`,
        customerId,
        userId: session.user.id,
        metadata: { contactId: contact.id }
      }
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Error adding contact:', error)
    return NextResponse.json(
      { error: 'Failed to add contact' },
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

    // Get all contacts for customer
    const contacts = await prisma.contact.findMany({
      where: { customerId },
      orderBy: [{ isPrimary: 'desc' }, { name: 'asc' }]
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}
