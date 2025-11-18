import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Cart } from '../types';
import { cartApi } from '../services/api';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (sweetId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    try {
      const cartData = await cartApi.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (sweetId: string, quantity: number) => {
    const updatedCart = await cartApi.addToCart(sweetId, quantity);
    setCart(updatedCart);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const updatedCart = await cartApi.updateCartItem(itemId, quantity);
    setCart(updatedCart);
  };

  const removeFromCart = async (itemId: string) => {
    const updatedCart = await cartApi.removeFromCart(itemId);
    setCart(updatedCart);
  };

  const clearCart = async () => {
    await cartApi.clearCart();
    await refreshCart();
  };

  return (
    <CartContext.Provider value={{ cart, loading, refreshCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

