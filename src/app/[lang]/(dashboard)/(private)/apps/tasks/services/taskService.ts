import { Task, TaskFilters } from '../types';

// Mock staff data for assignment
const mockStaff = [
  { id: '1', name: 'John Admin', role: 'admin' },
  { id: '2', name: 'Jane Staff', role: 'staff' },
  { id: '3', name: 'Mike Technician', role: 'technician' },
  { id: '4', name: 'Sarah Manager', role: 'staff' },
];

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with client about quote',
    description: 'Call John Smith to discuss the quote we sent last week',
    status: 'pending',
    priority: 'high',
    assignedTo: '2',
    assignedToName: 'Jane Staff',
    assignedBy: '1',
    assignedByName: 'John Admin',
    dueDate: '2024-02-15',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
    tags: ['sales', 'follow-up'],
    relatedTo: {
      type: 'client',
      id: '1',
      name: 'John Smith',
    },
  },
  {
    id: '2',
    title: 'Prepare monthly sales report',
    description: 'Compile sales data for January and create presentation',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: '4',
    assignedToName: 'Sarah Manager',
    assignedBy: '1',
    assignedByName: 'John Admin',
    dueDate: '2024-02-20',
    createdAt: '2024-02-12T09:00:00Z',
    updatedAt: '2024-02-13T14:30:00Z',
    tags: ['report', 'monthly'],
  },
  {
    id: '3',
    title: 'Fix printer in reception area',
    description: 'Printer is showing error code E-502, needs maintenance',
    status: 'completed',
    priority: 'medium',
    assignedTo: '3',
    assignedToName: 'Mike Technician',
    assignedBy: '2',
    assignedByName: 'Jane Staff',
    dueDate: '2024-02-14',
    createdAt: '2024-02-13T11:00:00Z',
    updatedAt: '2024-02-14T10:15:00Z',
    completedAt: '2024-02-14T10:15:00Z',
    tags: ['maintenance', 'office'],
  },
  {
    id: '4',
    title: 'Order new inventory',
    description: 'We need to restock on printer cartridges and paper',
    status: 'pending',
    priority: 'low',
    assignedTo: '2',
    assignedToName: 'Jane Staff',
    assignedBy: '1',
    assignedByName: 'John Admin',
    dueDate: '2024-02-25',
    createdAt: '2024-02-14T13:00:00Z',
    updatedAt: '2024-02-14T13:00:00Z',
    tags: ['inventory', 'supplies'],
  },
  {
    id: '5',
    title: 'Update website content',
    description: 'Add new service descriptions and update pricing page',
    status: 'in-progress',
    priority: 'high',
    assignedTo: '4',
    assignedToName: 'Sarah Manager',
    assignedBy: '1',
    assignedByName: 'John Admin',
    dueDate: '2024-02-18',
    createdAt: '2024-02-11T15:30:00Z',
    updatedAt: '2024-02-15T09:45:00Z',
    tags: ['marketing', 'website'],
  },
  {
    id: '6',
    title: 'Client meeting preparation',
    description: 'Prepare presentation for Enterprise client meeting',
    status: 'completed',
    priority: 'urgent',
    assignedTo: '1',
    assignedToName: 'John Admin',
    assignedBy: '1',
    assignedByName: 'John Admin',
    dueDate: '2024-02-16',
    createdAt: '2024-02-14T08:00:00Z',
    updatedAt: '2024-02-16T09:00:00Z',
    completedAt: '2024-02-16T09:00:00Z',
    tags: ['meeting', 'client', 'presentation'],
    relatedTo: {
      type: 'client',
      id: '3',
      name: 'Michael Brown',
    },
  },
  {
    id: '7',
    title: 'Review and approve expense reports',
    description: 'Review staff expense reports for January',
    status: 'pending',
    priority: 'medium',
    assignedTo: '1',
    assignedToName: 'John Admin',
    assignedBy: '4',
    assignedByName: 'Sarah Manager',
    dueDate: '2024-02-22',
    createdAt: '2024-02-15T11:30:00Z',
    updatedAt: '2024-02-15T11:30:00Z',
    tags: ['finance', 'approval'],
  },
  {
    id: '8',
    title: 'Troubleshoot network issues',
    description: 'Investigate intermittent network outages in the east wing',
    status: 'in-progress',
    priority: 'urgent',
    assignedTo: '3',
    assignedToName: 'Mike Technician',
    assignedBy: '1',
    assignedByName: 'John Admin',
    dueDate: '2024-02-17',
    createdAt: '2024-02-16T08:30:00Z',
    updatedAt: '2024-02-16T10:45:00Z',
    tags: ['IT', 'maintenance', 'urgent'],
  },
  {
    id: '9',
    title: 'Send invoice reminders',
    description: 'Send reminder emails for overdue invoices',
    status: 'cancelled',
    priority: 'high',
    assignedTo: '2',
    assignedToName: 'Jane Staff',
    assignedBy: '1',
    assignedByName: 'John Admin',
    dueDate: '2024-02-15',
    createdAt: '2024-02-13T14:00:00Z',
    updatedAt: '2024-02-14T16:30:00Z',
    tags: ['finance', 'invoices', 'follow-up'],
  },
  {
    id: '10',
    title: 'Organize team building event',
    description: 'Plan and schedule quarterly team building activity',
    status: 'pending',
    priority: 'low',
    assignedTo: '4',
    assignedToName: 'Sarah Manager',
    assignedBy: '1',
    assignedByName: 'John Admin',
    dueDate: '2024-03-01',
    createdAt: '2024-02-15T13:15:00Z',
    updatedAt: '2024-02-15T13:15:00Z',
    tags: ['HR', 'team', 'event'],
  },
];

let tasks = [...mockTasks];
let nextId = 11;

export class TaskService {
  static async getTasks(filters?: TaskFilters): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    let filteredTasks = [...tasks];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredTasks = filteredTasks.filter(task =>
          task.title.toLowerCase().includes(search) ||
          task.description?.toLowerCase().includes(search) ||
          task.assignedToName?.toLowerCase().includes(search)
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status);
      }
      
      if (filters.priority && filters.priority !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
      }
      
      if (filters.assignedTo && filters.assignedTo !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.assignedTo === filters.assignedTo);
      }
      
      if (filters.tags.length > 0) {
        filteredTasks = filteredTasks.filter(task =>
          filters.tags.some(tag => task.tags.includes(tag))
        );
      }
      
      if (filters.dateRange.start) {
        filteredTasks = filteredTasks.filter(task => 
          task.dueDate && new Date(task.dueDate) >= new Date(filters.dateRange.start!)
        );
      }
      
      if (filters.dateRange.end) {
        filteredTasks = filteredTasks.filter(task => 
          task.dueDate && new Date(task.dueDate) <= new Date(filters.dateRange.end!)
        );
      }
    }
    
    return filteredTasks.sort((a, b) => {
      // Sort by priority first (urgent > high > medium > low)
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then sort by due date (if both have due dates)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      // Tasks with due dates come before tasks without due dates
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      // Finally sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  static async getTaskById(id: string): Promise<Task | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return tasks.find(task => task.id === id) || null;
  }

  static async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'assignedToName' | 'assignedByName'>): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const assignedStaff = taskData.assignedTo ? mockStaff.find(s => s.id === taskData.assignedTo) : null;
    const assignedByStaff = mockStaff.find(s => s.id === taskData.assignedBy);
    
    if (!assignedByStaff) {
      throw new Error('Invalid assignedBy user');
    }
    
    const newTask: Task = {
      ...taskData,
      id: nextId.toString(),
      assignedToName: assignedStaff?.name,
      assignedByName: assignedByStaff.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    tasks.push(newTask);
    nextId++;
    
    return newTask;
  }

  static async updateTask(id: string, taskData: Partial<Task>): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    // If assignedTo is changing, update the assignedToName
    if (taskData.assignedTo && taskData.assignedTo !== tasks[index].assignedTo) {
      const assignedStaff = mockStaff.find(s => s.id === taskData.assignedTo);
      taskData.assignedToName = assignedStaff?.name;
    }
    
    // If status is changing to completed, set completedAt
    if (taskData.status === 'completed' && tasks[index].status !== 'completed') {
      taskData.completedAt = new Date().toISOString();
    }
    
    // If status is changing from completed, remove completedAt
    if (taskData.status && taskData.status !== 'completed' && tasks[index].status === 'completed') {
      taskData.completedAt = undefined;
    }
    
    tasks[index] = {
      ...tasks[index],
      ...taskData,
      updatedAt: new Date().toISOString(),
    };
    
    return tasks[index];
  }

  static async deleteTask(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    tasks.splice(index, 1);
  }

  static async getStaff(): Promise<Array<{ id: string; name: string; role: string }>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStaff;
  }

  static async getTaskStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    overdue: number;
    dueToday: number;
    dueTomorrow: number;
    byPriority: { priority: string; count: number }[];
    byAssignee: { assigneeId: string; assigneeName: string; count: number }[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const cancelled = tasks.filter(t => t.status === 'cancelled').length;
    
    const overdue = tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) < today && 
      (t.status === 'pending' || t.status === 'in-progress')
    ).length;
    
    const dueToday = tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) >= today && 
      new Date(t.dueDate) < tomorrow && 
      (t.status === 'pending' || t.status === 'in-progress')
    ).length;
    
    const dueTomorrow = tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) >= tomorrow && 
      new Date(t.dueDate) < dayAfterTomorrow && 
      (t.status === 'pending' || t.status === 'in-progress')
    ).length;
    
    // Count by priority
    const priorities = ['urgent', 'high', 'medium', 'low'];
    const byPriority = priorities.map(priority => ({
      priority,
      count: tasks.filter(t => t.priority === priority).length,
    }));
    
    // Count by assignee
    const assignees = new Map<string, { id: string; name: string; count: number }>();
    tasks.forEach(task => {
      if (task.assignedTo && task.assignedToName) {
        if (!assignees.has(task.assignedTo)) {
          assignees.set(task.assignedTo, { 
            id: task.assignedTo, 
            name: task.assignedToName, 
            count: 0 
          });
        }
        assignees.get(task.assignedTo)!.count++;
      }
    });
    
    const byAssignee = Array.from(assignees.values()).map(a => ({
      assigneeId: a.id,
      assigneeName: a.name,
      count: a.count,
    }));
    
    return {
      total,
      pending,
      inProgress,
      completed,
      cancelled,
      overdue,
      dueToday,
      dueTomorrow,
      byPriority,
      byAssignee,
    };
  }
}