export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'staff' | 'pos' | 'manager' | 'admin';
  fullName?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: number;
  orderNumber: string;
  tableId?: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod?: 'cash' | 'card' | 'digital';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  floor?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  supplierId?: number;
  lastRestocked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: number;
  userId: number;
  checkIn: Date;
  checkOut?: Date;
  status: 'present' | 'absent' | 'late';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  id: number;
  userId: number;
  shiftStart: Date;
  shiftEnd: Date;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
