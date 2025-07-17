import { Employee, EmployeeFormData, HRFilters } from '../types';

// Mock employees data
const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Admin',
    email: 'john@crmpro.com',
    phone: '+1234567890',
    position: 'CEO',
    department: 'Management',
    employeeId: 'EMP001',
    joinDate: '2023-01-01',
    status: 'active',
    salary: 10000,
    salaryType: 'monthly',
    bankAccount: '1234567890',
    bankName: 'First National Bank',
    taxId: 'TAX123456',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    emergencyContact: {
      name: 'Jane Admin',
      relationship: 'Spouse',
      phone: '+1234567891',
    },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Staff',
    email: 'jane@crmpro.com',
    phone: '+1234567892',
    position: 'Sales Manager',
    department: 'Sales',
    employeeId: 'EMP002',
    joinDate: '2023-02-01',
    status: 'active',
    salary: 7000,
    salaryType: 'monthly',
    bankAccount: '0987654321',
    bankName: 'City Bank',
    taxId: 'TAX654321',
    address: {
      street: '456 Oak St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-02-01T00:00:00Z',
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Technician',
    email: 'mike@crmpro.com',
    phone: '+1234567893',
    position: 'Senior Technician',
    department: 'Technical',
    employeeId: 'EMP003',
    joinDate: '2023-03-01',
    status: 'active',
    salary: 6000,
    salaryType: 'monthly',
    bankAccount: '1122334455',
    bankName: 'Tech Credit Union',
    address: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60007',
      country: 'USA',
    },
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-03-01T00:00:00Z',
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Manager',
    email: 'sarah@crmpro.com',
    phone: '+1234567894',
    position: 'HR Manager',
    department: 'Human Resources',
    employeeId: 'EMP004',
    joinDate: '2023-04-01',
    status: 'on_leave',
    salary: 7500,
    salaryType: 'monthly',
    bankAccount: '5566778899',
    bankName: 'Global Bank',
    taxId: 'TAX987654',
    address: {
      street: '101 Maple Ave',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108',
      country: 'USA',
    },
    emergencyContact: {
      name: 'David Manager',
      relationship: 'Spouse',
      phone: '+1234567895',
    },
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100',
    createdAt: '2023-04-01T00:00:00Z',
    updatedAt: '2023-04-01T00:00:00Z',
  },
  {
    id: '5',
    firstName: 'Robert',
    lastName: 'Developer',
    email: 'robert@crmpro.com',
    phone: '+1234567896',
    position: 'Senior Developer',
    department: 'IT',
    employeeId: 'EMP005',
    joinDate: '2023-05-01',
    status: 'active',
    salary: 8000,
    salaryType: 'monthly',
    bankAccount: '1357924680',
    bankName: 'Tech Bank',
    taxId: 'TAX246810',
    address: {
      street: '202 Cedar St',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
    },
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    createdAt: '2023-05-01T00:00:00Z',
    updatedAt: '2023-05-01T00:00:00Z',
  },
];

let employees = [...mockEmployees];
let nextId = 6;

export class EmployeeService {
  static async getEmployees(filters?: HRFilters): Promise<Employee[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    let filteredEmployees = [...employees];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredEmployees = filteredEmployees.filter(employee =>
          employee.firstName.toLowerCase().includes(search) ||
          employee.lastName.toLowerCase().includes(search) ||
          employee.email.toLowerCase().includes(search) ||
          employee.employeeId.toLowerCase().includes(search)
        );
      }
      
      if (filters.department && filters.department !== 'all') {
        filteredEmployees = filteredEmployees.filter(employee => employee.department === filters.department);
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredEmployees = filteredEmployees.filter(employee => employee.status === filters.status);
      }
      
      if (filters.dateRange.start) {
        filteredEmployees = filteredEmployees.filter(employee => 
          new Date(employee.joinDate) >= new Date(filters.dateRange.start!)
        );
      }
      
      if (filters.dateRange.end) {
        filteredEmployees = filteredEmployees.filter(employee => 
          new Date(employee.joinDate) <= new Date(filters.dateRange.end!)
        );
      }
    }
    
    return filteredEmployees.sort((a, b) => a.employeeId.localeCompare(b.employeeId));
  }

  static async getEmployeeById(id: string): Promise<Employee | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return employees.find(employee => employee.id === id) || null;
  }

  static async createEmployee(employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check for duplicate email or employee ID
    if (employees.some(emp => emp.email === employeeData.email)) {
      throw new Error('Email already exists');
    }
    
    if (employees.some(emp => emp.employeeId === employeeData.employeeId)) {
      throw new Error('Employee ID already exists');
    }
    
    const newEmployee: Employee = {
      ...employeeData,
      id: nextId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    employees.push(newEmployee);
    nextId++;
    
    return newEmployee;
  }

  static async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = employees.findIndex(employee => employee.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }
    
    // Check for duplicate email or employee ID
    if (employeeData.email && employeeData.email !== employees[index].email) {
      if (employees.some(emp => emp.email === employeeData.email)) {
        throw new Error('Email already exists');
      }
    }
    
    if (employeeData.employeeId && employeeData.employeeId !== employees[index].employeeId) {
      if (employees.some(emp => emp.employeeId === employeeData.employeeId)) {
        throw new Error('Employee ID already exists');
      }
    }
    
    employees[index] = {
      ...employees[index],
      ...employeeData,
      updatedAt: new Date().toISOString(),
    };
    
    return employees[index];
  }

  static async deleteEmployee(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = employees.findIndex(employee => employee.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }
    
    employees.splice(index, 1);
  }

  static async getDepartments(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const departments = [...new Set(employees.map(employee => employee.department))];
    return departments.sort();
  }

  static async getEmployeeStats(): Promise<{
    totalEmployees: number;
    activeEmployees: number;
    onLeaveEmployees: number;
    departmentBreakdown: { department: string; count: number }[];
    recentHires: Employee[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.status === 'active').length;
    const onLeaveEmployees = employees.filter(e => e.status === 'on_leave').length;
    
    const departments = [...new Set(employees.map(e => e.department))];
    const departmentBreakdown = departments.map(department => {
      const count = employees.filter(e => e.department === department).length;
      return { department, count };
    });
    
    const recentHires = [...employees]
      .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
      .slice(0, 5);
    
    return {
      totalEmployees,
      activeEmployees,
      onLeaveEmployees,
      departmentBreakdown,
      recentHires,
    };
  }
}