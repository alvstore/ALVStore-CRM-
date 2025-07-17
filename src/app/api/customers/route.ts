import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Log Prisma model keys for debugging
console.log('Available Prisma Client keys:', Object.keys(prisma).filter(key => !key.startsWith('$') && !key.startsWith('_')));

// Use Prisma's transaction client type
type PrismaTransaction = Parameters<typeof prisma.$transaction>[0];
type TransactionClient = Parameters<PrismaTransaction>[0];

// Type for customer create input
type CustomerCreateInput = {
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
  status?: string;
  company?: string | null;
  type?: string;
  source?: string;
  notes?: string | null;
  tags?: string | null;
  customFields?: string | null;
  contacts?: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position?: string;
    isPrimary?: boolean;
    notes?: string;
  }>;
  addresses?: Array<{
    type: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isPrimary?: boolean;
  }>;
  communicationPreferences?: {
    email?: boolean;
    sms?: boolean;
    phone?: boolean;
    preferred?: string;
    doNotDisturb?: boolean;
    doNotDisturbUntil?: Date | null;
    marketingEmails?: boolean;
    newsletter?: boolean;
  };
};

// GET /api/customers - Get all customers with pagination and filtering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  try {
    const where: any = {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { company: { contains: search, mode: 'insensitive' } },
      ],
    };

    if (status) {
      where.status = status;
    }

    const customers = await (prisma as ExtendedPrismaClient).customer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        contacts: true,
        addresses: true,
        communicationPreferences: true,
      },
    });

    const total = await (prisma as ExtendedPrismaClient).customer.count({ where });

    return NextResponse.json({
      data: customers,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received customer data:', JSON.stringify(data, null, 2));
    
    // Log the Prisma client to check available models
    console.log('Prisma client in API route:', Object.keys(prisma));
    
    // Create customer with related data in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Log available models in transaction
      console.log('Available models in transaction:', Object.keys(tx).filter(key => !key.startsWith('$') && !key.startsWith('_')));
      console.log('Starting database transaction...');
      
      const { contacts, addresses, communicationPreferences, ...customerData } = data;
      
// Create customer
      console.log('Creating customer with data:', customerData);
      const customer = await (tx as any).customer.create({
        data: {
          ...customerData,
          status: customerData.status || 'active',
          // Ensure required fields have defaults if not provided
          firstName: customerData.firstName || '',
          lastName: customerData.lastName || '',
          fullName: [customerData.firstName, customerData.lastName].filter(Boolean).join(' '),
          email: customerData.email || null,
          phone: customerData.phone || null,
          createdBy: 'system', // TODO: Replace with actual user ID from session
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Create related records if provided
      if (contacts && contacts.length > 0) {
        console.log('Creating contacts:', contacts);
        await (tx as any).contactPerson.createMany({
          data: contacts.map((contact: any) => ({
            ...contact,
            customerId: customer.id,
            createdAt: new Date(),
            updatedAt: new Date()
          }))
        });
      }

      if (addresses && addresses.length > 0) {
        console.log('Creating addresses:', addresses);
        await (tx as any).address.createMany({
          data: addresses.map((address: any) => ({
            ...address,
            customerId: customer.id,
            createdAt: new Date(),
            updatedAt: new Date()
          }))
        });
      }

      if (communicationPreferences) {
        console.log('Creating communication preferences:', communicationPreferences);
        await (tx as any).communicationPreferences.create({
          data: {
            ...communicationPreferences,
            customerId: customer.id,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }

      // Return the customer with all related data
      return (tx as any).customer.findUnique({
        where: { id: customer.id },
        include: {
          contacts: true,
          addresses: true,
          communicationPreferences: true
        }
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to create customer', 
        message: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
