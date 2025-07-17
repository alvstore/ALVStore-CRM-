import { Attendance, AttendanceFormData, AttendanceFilters } from '../types';

// Mock attendance data
const mockAttendance: Attendance[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Admin',
    date: '2024-01-15',
    checkIn: '09:00:00',
    checkOut: '17:30:00',
    status: 'present',
    workHours: 8.5,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T17:30:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Jane Staff',
    date: '2024-01-15',
    checkIn: '08:45:00',
    checkOut: '17:15:00',
    status: 'present',
    workHours: 8.5,
    createdAt: '2024-01-15T08:45:00Z',
    updatedAt: '2024-01-15T17:15:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Mike Technician',
    date: '2024-01-15',
    checkIn: '09:15:00',
    checkOut: '18:00:00',
    status: 'late',
    workHours: 8.75,
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T18:00:00Z',
    createdBy: '3',
    createdByName: 'Mike Technician',
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'Sarah Manager',
    date: '2024-01-15',
    checkIn: '',
    checkOut: '',
    status: 'leave',
    workHours: 0,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
  },
  {
    id: '5',
    employeeId: '5',
    employeeName: 'Robert Developer',
    date: '2024-01-15',
    checkIn: '09:00:00',
    checkOut: '17:00:00',
    status: 'present',
    workHours: 8,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T17:00:00Z',
    createdBy: '5',
    createdByName: 'Robert Developer',
  },
  // Next day
  {
    id: '6',
    employeeId: '1',
    employeeName: 'John Admin',
    date: '2024-01-16',
    checkIn: '09:00:00',
    checkOut: '17:00:00',
    status: 'present',
    workHours: 8,
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T17:00:00Z',
    createdBy: '1',
    createdByName: 'John Admin',
  },
  {
    id: '7',
    employeeId: '2',
    employeeName: 'Jane Staff',
    date: '2024-01-16',
    checkIn: '08:30:00',
    checkOut: '17:30:00',
    status: 'present',
    workHours: 9,
    createdAt: '2024-01-16T08:30:00Z',
    updatedAt: '2024-01-16T17:30:00Z',
    createdBy: '2',
    createdByName: 'Jane Staff',
  },
];

let attendanceRecords = [...mockAttendance];
let nextId = 8;

export class AttendanceService {
  static async getAttendance(filters?: AttendanceFilters): Promise<Attendance[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredRecords = [...attendanceRecords];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredRecords = filteredRecords.filter(record =>
          record.employeeName.toLowerCase().includes(search)
        );
      }
      
      if (filters.employeeId && filters.employeeId !== 'all') {
        filteredRecords = filteredRecords.filter(record => record.employeeId === filters.employeeId);
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredRecords = filteredRecords.filter(record => record.status === filters.status);
      }
      
      if (filters.dateRange.start) {
        filteredRecords = filteredRecords.filter(record => 
          record.date >= filters.dateRange.start!
        );
      }
      
      if (filters.dateRange.end) {
        filteredRecords = filteredRecords.filter(record => 
          record.date <= filters.dateRange.end!
        );
      }
    }
    
    return filteredRecords.sort((a, b) => {
      // Sort by date (descending) and then by employee name
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      return a.employeeName.localeCompare(b.employeeName);
    });
  }

  static async getAttendanceById(id: string): Promise<Attendance | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return attendanceRecords.find(record => record.id === id) || null;
  }

  static async createAttendance(data: AttendanceFormData, employeeName: string, userId: string, userName: string): Promise<Attendance> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if attendance record already exists for this employee and date
    const existingRecord = attendanceRecords.find(
      record => record.employeeId === data.employeeId && record.date === data.date
    );
    
    if (existingRecord) {
      throw new Error('Attendance record already exists for this employee on this date');
    }
    
    // Calculate work hours if both check-in and check-out are provided
    let workHours = 0;
    if (data.checkIn && data.checkOut) {
      const checkInTime = new Date(`${data.date}T${data.checkIn}`);
      const checkOutTime = new Date(`${data.date}T${data.checkOut}`);
      workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    }
    
    const newRecord: Attendance = {
      id: nextId.toString(),
      employeeId: data.employeeId,
      employeeName,
      date: data.date,
      checkIn: data.checkIn || '',
      checkOut: data.checkOut || null,
      status: data.status,
      workHours,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
      createdByName: userName,
    };
    
    attendanceRecords.push(newRecord);
    nextId++;
    
    return newRecord;
  }

  static async updateAttendance(id: string, data: Partial<AttendanceFormData>): Promise<Attendance> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = attendanceRecords.findIndex(record => record.id === id);
    if (index === -1) {
      throw new Error('Attendance record not found');
    }
    
    // Calculate work hours if both check-in and check-out are provided
    let workHours = attendanceRecords[index].workHours;
    if ((data.checkIn || attendanceRecords[index].checkIn) && 
        (data.checkOut || attendanceRecords[index].checkOut)) {
      const checkIn = data.checkIn || attendanceRecords[index].checkIn;
      const checkOut = data.checkOut || attendanceRecords[index].checkOut;
      const date = data.date || attendanceRecords[index].date;
      
      if (checkIn && checkOut) {
        const checkInTime = new Date(`${date}T${checkIn}`);
        const checkOutTime = new Date(`${date}T${checkOut}`);
        workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
      }
    }
    
    attendanceRecords[index] = {
      ...attendanceRecords[index],
      ...(data.date && { date: data.date }),
      ...(data.checkIn && { checkIn: data.checkIn }),
      ...(data.checkOut !== undefined && { checkOut: data.checkOut }),
      ...(data.status && { status: data.status }),
      ...(data.notes !== undefined && { notes: data.notes }),
      workHours,
      updatedAt: new Date().toISOString(),
    };
    
    return attendanceRecords[index];
  }

  static async deleteAttendance(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = attendanceRecords.findIndex(record => record.id === id);
    if (index === -1) {
      throw new Error('Attendance record not found');
    }
    
    attendanceRecords.splice(index, 1);
  }

  static async checkIn(employeeId: string, employeeName: string): Promise<Attendance> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const today = new Date().toISOString().split('T')[0];
    
    // Check if already checked in today
    const existingRecord = attendanceRecords.find(
      record => record.employeeId === employeeId && record.date === today
    );
    
    if (existingRecord) {
      throw new Error('Already checked in today');
    }
    
    const now = new Date();
    const checkInTime = now.toTimeString().split(' ')[0];
    
    // Determine if late (after 9:00 AM)
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0);
    
    const newRecord: Attendance = {
      id: nextId.toString(),
      employeeId,
      employeeName,
      date: today,
      checkIn: checkInTime,
      checkOut: null,
      status: isLate ? 'late' : 'present',
      workHours: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      createdBy: employeeId,
      createdByName: employeeName,
    };
    
    attendanceRecords.push(newRecord);
    nextId++;
    
    return newRecord;
  }

  static async checkOut(employeeId: string): Promise<Attendance> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const today = new Date().toISOString().split('T')[0];
    
    // Find today's check-in record
    const index = attendanceRecords.findIndex(
      record => record.employeeId === employeeId && record.date === today && !record.checkOut
    );
    
    if (index === -1) {
      throw new Error('No check-in record found for today');
    }
    
    const now = new Date();
    const checkOutTime = now.toTimeString().split(' ')[0];
    
    // Calculate work hours
    const checkInTime = new Date(`${today}T${attendanceRecords[index].checkIn}`);
    const checkOutTimeDate = new Date(`${today}T${checkOutTime}`);
    const workHours = (checkOutTimeDate.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    
    attendanceRecords[index] = {
      ...attendanceRecords[index],
      checkOut: checkOutTime,
      workHours,
      updatedAt: now.toISOString(),
    };
    
    return attendanceRecords[index];
  }

  static async getAttendanceSummary(month: number, year: number): Promise<{
    totalWorkDays: number;
    presentDays: Record<string, number>;
    lateDays: Record<string, number>;
    absentDays: Record<string, number>;
    leaveDays: Record<string, number>;
    totalWorkHours: Record<string, number>;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get all records for the specified month and year
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    const records = attendanceRecords.filter(
      record => record.date >= startDate && record.date <= endDate
    );
    
    // Calculate total work days in the month (excluding weekends)
    const totalDays = new Date(year, month, 0).getDate();
    let totalWorkDays = 0;
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
        totalWorkDays++;
      }
    }
    
    // Initialize counters
    const presentDays: Record<string, number> = {};
    const lateDays: Record<string, number> = {};
    const absentDays: Record<string, number> = {};
    const leaveDays: Record<string, number> = {};
    const totalWorkHours: Record<string, number> = {};
    
    // Process records
    records.forEach(record => {
      if (!presentDays[record.employeeId]) {
        presentDays[record.employeeId] = 0;
        lateDays[record.employeeId] = 0;
        absentDays[record.employeeId] = 0;
        leaveDays[record.employeeId] = 0;
        totalWorkHours[record.employeeId] = 0;
      }
      
      if (record.status === 'present') {
        presentDays[record.employeeId]++;
      } else if (record.status === 'late') {
        lateDays[record.employeeId]++;
        presentDays[record.employeeId]++; // Late is still counted as present
      } else if (record.status === 'absent') {
        absentDays[record.employeeId]++;
      } else if (record.status === 'leave') {
        leaveDays[record.employeeId]++;
      }
      
      totalWorkHours[record.employeeId] += record.workHours;
    });
    
    return {
      totalWorkDays,
      presentDays,
      lateDays,
      absentDays,
      leaveDays,
      totalWorkHours,
    };
  }
}