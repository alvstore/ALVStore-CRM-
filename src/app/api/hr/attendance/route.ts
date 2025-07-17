import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace with actual database call
  const attendance = [
    { id: 1, employeeId: 1, date: '2025-07-10', status: 'Present', checkIn: '09:00', checkOut: '17:00' },
    { id: 2, employeeId: 2, date: '2025-07-10', status: 'Present', checkIn: '09:15', checkOut: '17:30' },
  ];
  
  return NextResponse.json(attendance);
}

export async function POST(request: Request) {
  const data = await request.json();
  // TODO: Add validation and save to database
  return NextResponse.json({ id: Date.now(), ...data }, { status: 201 });
}
