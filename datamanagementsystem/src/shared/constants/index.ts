export const USER_ROLES = {
  STAFF: 'staff',
  POS: 'pos',
  MANAGER: 'manager',
  ADMIN: 'admin',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
} as const;

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  DIGITAL: 'digital',
} as const;

export const API_BASE_URL = 'http://localhost:3001/api';

export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: '/users',
  PRODUCTS: '/products',
  ORDERS: '/orders',
  TABLES: '/tables',
  INVENTORY: '/inventory',
  REPORTS: '/reports',
  STAFF: '/staff',
} as const;
