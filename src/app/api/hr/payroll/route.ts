import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace with actual database call
  const payrolls = [
    { 
      id: 1, 
      employeeId: 1, 
      period: 'July 2025',
      basicSalary: 5000,
      allowances: 1000,
      deductions: 500,
      netSalary: 5500,
      status: 'Paid'
    },
  ];
  
  return NextResponse.json(payrolls);
}
