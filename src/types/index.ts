export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  is_super_admin?: boolean;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
  };
  isAdmin?: boolean;
}

export interface Transaction {
  id: string;
  sweet_id: string;
  user_id: string;
  transaction_type: 'purchase' | 'restock';
  quantity: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  sweet_id: string | Sweet | { name: string; image_url?: string; _id?: string };
  quantity: number;
  price_at_added: number;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  sweet_id: string;
  sweet_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Bill {
  id: string;
  bill_number: string;
  order_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  payment_method: 'cash' | 'card' | 'online';
  generated_at: string;
}

export interface RevenueData {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  revenue_by_date: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export interface DashboardStats {
  today: {
    orders: number;
    revenue: number;
  };
  this_month: {
    orders: number;
    revenue: number;
  };
  this_year: {
    revenue: number;
  };
  pending_orders: number;
  total_customers: number;
  low_stock_items: number;
  total_sweets: number;
}
