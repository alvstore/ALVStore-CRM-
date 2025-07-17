import { create } from 'zustand';
import { Task, TaskFilters, KanbanColumn } from '../types';
import { TaskService } from '../services/taskService';

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
  staff: Array<{ id: string; name: string; role: string }>;
  
  // Actions
  fetchTasks: () => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  createTask: (taskData: any) => Promise<void>;
  updateTask: (id: string, taskData: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TaskFilters>) => void;
  clearError: () => void;
  setSelectedTask: (task: Task | null) => void;
  fetchStaff: () => Promise<void>;
  
  // Kanban specific
  getKanbanColumns: () => KanbanColumn[];
  moveTaskToStatus: (taskId: string, newStatus: Task['status']) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
  staff: [],
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    tags: [],
    dateRange: {},
  },

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await TaskService.getTasks(get().filters);
      set({ tasks, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch tasks', loading: false });
    }
  },

  fetchTaskById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const task = await TaskService.getTaskById(id);
      set({ selectedTask: task, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch task', loading: false });
    }
  },

  createTask: async (taskData: any) => {
    set({ loading: true, error: null });
    try {
      const newTask = await TaskService.createTask({
        ...taskData,
        assignedBy: '1', // Mock current user ID
      });
      set(state => ({ 
        tasks: [...state.tasks, newTask], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create task', loading: false });
      throw error;
    }
  },

  updateTask: async (id: string, taskData: any) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await TaskService.updateTask(id, taskData);
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === id ? updatedTask : task
        ),
        selectedTask: state.selectedTask?.id === id ? updatedTask : state.selectedTask,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update task', loading: false });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await TaskService.deleteTask(id);
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete task', loading: false });
      throw error;
    }
  },

  setFilters: (filters: Partial<TaskFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setSelectedTask: (task: Task | null) => {
    set({ selectedTask: task });
  },

  fetchStaff: async () => {
    try {
      const staff = await TaskService.getStaff();
      set({ staff });
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    }
  },

  getKanbanColumns: () => {
    const tasks = get().tasks;
    const columns: KanbanColumn[] = [
      {
        id: 'pending',
        title: 'To Do',
        status: 'pending',
        tasks: tasks.filter(task => task.status === 'pending'),
        color: '#f5f5f5',
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        status: 'in-progress',
        tasks: tasks.filter(task => task.status === 'in-progress'),
        color: '#e3f2fd',
      },
      {
        id: 'completed',
        title: 'Completed',
        status: 'completed',
        tasks: tasks.filter(task => task.status === 'completed'),
        color: '#e8f5e9',
      },
      {
        id: 'cancelled',
        title: 'Cancelled',
        status: 'cancelled',
        tasks: tasks.filter(task => task.status === 'cancelled'),
        color: '#ffebee',
      },
    ];
    return columns;
  },

  moveTaskToStatus: async (taskId: string, newStatus: Task['status']) => {
    try {
      await get().updateTask(taskId, { status: newStatus });
    } catch (error) {
      throw error;
    }
  },
}));