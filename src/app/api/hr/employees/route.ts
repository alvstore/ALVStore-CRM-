import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace with actual database call
  const employees = [
    { id: 1, name: 'John Doe', email: 'john@example.com', department: 'IT', position: 'Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'HR', position: 'Manager' },
  ];
  
  return NextResponse.json(employees);
}

export async function POST(request: Request) {
  const data = await request.json();
  // TODO: Add validation and save to database
  return NextResponse.json({ id: Date.now(), ...data }, { status: 201 });
}
