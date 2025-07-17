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
    if (!data.type || !data.title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
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

    // Create activity
    const activity = await prisma.customerActivity.create({
      data: {
        ...data,
        customerId,
        userId: session.user.id,
        metadata: data.metadata || {}
      }
    })

    // Update customer's last activity timestamp
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        lastActivity: new Date()
      }
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Error adding activity:', error)
    return NextResponse.json(
      { error: 'Failed to add activity' },
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
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '10')

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

    // Build where clause
    const where: any = { customerId }
    if (type) {
      where.type = type
    }

    // Get activities for customer
    const activities = await prisma.customerActivity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
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
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}
