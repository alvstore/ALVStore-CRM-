export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  assignedToName?: string;
  assignedBy: string;
  assignedByName: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  tags: string[];
  relatedTo?: {
    type: 'client' | 'project' | 'repair' | 'quote' | 'invoice';
    id: string;
    name: string;
  };
}

export interface TaskFormData {
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  dueDate?: string;
  tags: string[];
  relatedToType?: 'client' | 'project' | 'repair' | 'quote' | 'invoice';
  relatedToId?: string;
}

export interface TaskFilters {
  search: string;
  status: string;
  priority: string;
  assignedTo: string;
  tags: string[];
  dateRange: {
    start?: string;
    end?: string;
  };
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: Task['status'];
  tasks: Task[];
  color: string;
}