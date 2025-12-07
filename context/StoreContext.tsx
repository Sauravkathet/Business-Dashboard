import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, InventoryItem, Document, User, Priority } from '../types';

interface StoreContextType {
  user: User;
  tasks: Task[];
  inventory: InventoryItem[];
  documents: Document[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  deleteTask: (id: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  deleteInventoryItem: (id: string) => void;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Sterling',
  email: 'alex@flowforge.os',
  role: 'Admin',
  avatar: 'https://picsum.photos/200',
};

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Q3 Financial Report', description: 'Compile P&L for Q3', status: 'In Progress', priority: Priority.High, assigneeId: 'u1', dueDate: '2023-10-15' },
  { id: 't2', title: 'Update Website Hero', description: 'New copy provided by marketing', status: 'To Do', priority: Priority.Medium, assigneeId: 'u2', dueDate: '2023-10-20' },
  { id: 't3', title: 'Client Meeting: TechCorp', description: 'Discuss renewal contract', status: 'Done', priority: Priority.Critical, assigneeId: 'u1', dueDate: '2023-10-01' },
  { id: 't4', title: 'Server Maintenance', description: 'Routine patch updates', status: 'Review', priority: Priority.Low, assigneeId: 'u3', dueDate: '2023-10-12' },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Ergonomic Chair', sku: 'FUR-001', category: 'Furniture', quantity: 12, price: 299.99, status: 'In Stock', lastUpdated: '2023-10-05' },
  { id: 'i2', name: 'Monitor Stand', sku: 'ACC-042', category: 'Accessories', quantity: 3, price: 49.50, status: 'Low Stock', lastUpdated: '2023-10-08' },
  { id: 'i3', name: 'Wireless Keyboard', sku: 'TEC-101', category: 'Electronics', quantity: 0, price: 89.99, status: 'Out of Stock', lastUpdated: '2023-09-28' },
  { id: 'i4', name: 'USB-C Hub', sku: 'ACC-015', category: 'Accessories', quantity: 45, price: 35.00, status: 'In Stock', lastUpdated: '2023-10-09' },
  { id: 'i5', name: 'Standing Desk', sku: 'FUR-009', category: 'Furniture', quantity: 8, price: 550.00, status: 'In Stock', lastUpdated: '2023-10-02' },
];

const INITIAL_DOCS: Document[] = [
  { id: 'd1', name: 'Employee_Handbook_2024.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'HR Dept', date: '2023-09-15' },
  { id: 'd2', name: 'Q3_Sales_Data.xlsx', type: 'XLSX', size: '1.1 MB', uploadedBy: 'Sales Team', date: '2023-10-01' },
  { id: 'd3', name: 'Project_Alpha_Specs.docx', type: 'DOCX', size: '500 KB', uploadedBy: 'Alex Sterling', date: '2023-10-05' },
  { id: 'd4', name: 'Office_Layout_Draft.img', type: 'IMG', size: '4.5 MB', uploadedBy: 'Design', date: '2023-08-20' },
];

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useState<User>(MOCK_USER);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [documents] = useState<Document[]>(INITIAL_DOCS);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial fetch
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: Math.random().toString(36).substr(2, 9) };
    setTasks([...tasks, newTask]);
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setInventory([...inventory, newItem]);
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(inventory.filter(i => i.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      user,
      tasks,
      inventory,
      documents,
      addTask,
      updateTaskStatus,
      deleteTask,
      addInventoryItem,
      deleteInventoryItem,
      isLoading
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
