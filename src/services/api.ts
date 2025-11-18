import { Sweet, AuthResponse, Cart, Order, Bill, RevenueData, DashboardStats } from '../types';
import { tokenStorage } from '../utils/token';

const API_BASE_URL = "https://incubyte-assignment23.onrender.com";

export const authApi = {
  async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    // Store token and user info
    if (data.session?.access_token) {
      tokenStorage.setToken(data.session.access_token);
      tokenStorage.setUser({
        id: data.user.id,
        email: data.user.email,
        isAdmin: data.isAdmin || false,
        isSuperAdmin: data.isSuperAdmin || false,
      });
    }
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    // Store token and user info
    if (data.session?.access_token) {
      tokenStorage.setToken(data.session.access_token);
      tokenStorage.setUser({
        id: data.user.id,
        email: data.user.email,
        isAdmin: data.isAdmin || false,
        isSuperAdmin: data.isSuperAdmin || false,
      });
    }
    return data;
  },

  async logout(): Promise<void> {
    tokenStorage.removeToken();
  },
};

const getAuthHeaders = () => {
  const token = tokenStorage.getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const sweetsApi = {
  async getAll(): Promise<Sweet[]> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/sweets`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch sweets');
    }

    return response.json();
  },

  async search(params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Sweet[]> {
    const headers = getAuthHeaders();
    const searchParams = new URLSearchParams();

    if (params.name) searchParams.append('name', params.name);
    if (params.category) searchParams.append('category', params.category);
    if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());

    const response = await fetch(`${API_BASE_URL}/sweets/search?${searchParams}`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to search sweets');
    }

    return response.json();
  },

  async create(sweet: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>): Promise<Sweet> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/sweets`, {
      method: 'POST',
      headers,
      body: JSON.stringify(sweet),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create sweet');
    }

    return response.json();
  },

  async update(id: string, updates: Partial<Sweet>): Promise<Sweet> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/sweets/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update sweet');
    }

    return response.json();
  },

  async delete(id: string): Promise<void> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/sweets/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete sweet');
    }
  },
};

export const inventoryApi = {
  async purchase(sweetId: string, quantity: number): Promise<{ message: string; sweet: Sweet }> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/inventory/sweets/${sweetId}/purchase`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Purchase failed');
    }

    return response.json();
  },

  async restock(sweetId: string, quantity: number): Promise<{ message: string; sweet: Sweet }> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/inventory/sweets/${sweetId}/restock`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Restock failed');
    }

    return response.json();
  },
};

export const cartApi = {
  async getCart(): Promise<Cart> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch cart');
    }

    return response.json();
  },

  async addToCart(sweetId: string, quantity: number): Promise<Cart> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ sweet_id: sweetId, quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add item to cart');
    }

    return response.json();
  },

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update cart item');
    }

    return response.json();
  },

  async removeFromCart(itemId: string): Promise<Cart> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove item from cart');
    }

    return response.json();
  },

  async clearCart(): Promise<void> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to clear cart');
    }
  },
};

export const orderApi = {
  async createOrder(paymentMethod: string = 'cash'): Promise<{ order: Order; bill: Bill }> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/orders/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ payment_method: paymentMethod }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }

    return response.json();
  },

  async getMyOrders(): Promise<Order[]> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch orders');
    }

    return response.json();
  },

  async getAllOrders(params?: {
    status?: string;
    payment_status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Order[]> {
    const headers = getAuthHeaders();
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.payment_status) searchParams.append('payment_status', params.payment_status);
    if (params?.start_date) searchParams.append('start_date', params.start_date);
    if (params?.end_date) searchParams.append('end_date', params.end_date);

    const response = await fetch(`${API_BASE_URL}/orders?${searchParams}`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch orders');
    }

    return response.json();
  },

  async getOrder(orderId: string): Promise<Order> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch order');
    }

    return response.json();
  },

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update order status');
    }

    return response.json();
  },

  async cancelOrder(orderId: string): Promise<Order> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to cancel order');
    }

    return response.json();
  },
};

export const billApi = {
  async getBillByOrder(orderId: string): Promise<Bill> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/bills/order/${orderId}`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch bill');
    }

    return response.json();
  },

  async getBillByNumber(billNumber: string): Promise<Bill> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/bills/${billNumber}`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch bill');
    }

    return response.json();
  },

  async getAllBills(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<Bill[]> {
    const headers = getAuthHeaders();
    const searchParams = new URLSearchParams();
    if (params?.start_date) searchParams.append('start_date', params.start_date);
    if (params?.end_date) searchParams.append('end_date', params.end_date);

    const response = await fetch(`${API_BASE_URL}/bills?${searchParams}`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch bills');
    }

    return response.json();
  },
};

export const analyticsApi = {
  async getRevenue(params?: {
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'month' | 'year';
  }): Promise<RevenueData> {
    const headers = getAuthHeaders();
    const searchParams = new URLSearchParams();
    if (params?.start_date) searchParams.append('start_date', params.start_date);
    if (params?.end_date) searchParams.append('end_date', params.end_date);
    if (params?.group_by) searchParams.append('group_by', params.group_by);

    const response = await fetch(`${API_BASE_URL}/analytics/revenue?${searchParams}`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch revenue data');
    }

    return response.json();
  },

  async getTopSweets(params?: {
    limit?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<any[]> {
    const headers = getAuthHeaders();
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.start_date) searchParams.append('start_date', params.start_date);
    if (params?.end_date) searchParams.append('end_date', params.end_date);

    const response = await fetch(`${API_BASE_URL}/analytics/top-sweets?${searchParams}`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch top sweets');
    }

    return response.json();
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch dashboard stats');
    }

    return response.json();
  },
};
