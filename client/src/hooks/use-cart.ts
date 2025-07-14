import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { CartContextType, CartItemWithProduct } from '@/lib/types';

const CartContext = createContext<CartContextType | undefined>(undefined);

const SESSION_ID = 'classic-polo-session';

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function useCartProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart'],
    queryFn: async () => {
      const response = await fetch('/api/cart', {
        headers: {
          'session-id': SESSION_ID
        }
      });
      if (!response.ok) throw new Error('Failed to fetch cart');
      return response.json();
    }
  });

  const addToCartMutation = useMutation({
    mutationFn: async (data: { productId: number; selectedColor: string; selectedSize: string; quantity: number }) => {
      const response = await apiRequest('POST', '/api/cart', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async (data: { itemId: number; quantity: number }) => {
      const response = await apiRequest('PATCH', `/api/cart/${data.itemId}`, { quantity: data.quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    }
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await apiRequest('DELETE', `/api/cart/${itemId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    }
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', '/api/cart');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    }
  });

  const addToCart = async (productId: number, color: string, size: string, quantity = 1) => {
    await addToCartMutation.mutateAsync({
      productId,
      selectedColor: color,
      selectedSize: size,
      quantity
    });
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCartMutation.mutateAsync(itemId);
    } else {
      await updateQuantityMutation.mutateAsync({ itemId, quantity });
    }
  };

  const removeFromCart = async (itemId: number) => {
    await removeFromCartMutation.mutateAsync(itemId);
  };

  const clearCart = async () => {
    await clearCartMutation.mutateAsync();
  };

  const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleCart = () => setIsOpen(!isOpen);

  return {
    items: cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    itemCount,
    isOpen,
    toggleCart
  };
}

export { CartContext };
