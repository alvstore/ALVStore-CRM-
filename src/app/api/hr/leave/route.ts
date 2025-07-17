import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace with actual database call
  const leaveRequests = [
    { 
      id: 1, 
      employeeId: 1, 
      type: 'Annual', 
      startDate: '2025-08-01', 
      endDate: '2025-08-05',
      status: 'Pending',
      reason: 'Vacation'
    },
  ];
  
  return NextResponse.json(leaveRequests);
}

export async function POST(request: Request) {
  const data = await request.json();
  // TODO: Add validation and save to database
  return NextResponse.json({ id: Date.now(), ...data }, { status: 201 });
}
