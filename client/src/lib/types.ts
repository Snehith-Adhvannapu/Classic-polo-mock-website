export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price_low' | 'price_high' | 'newest' | 'best_sellers';
}

export interface CartContextType {
  items: CartItemWithProduct[];
  addToCart: (productId: number, color: string, size: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  itemCount: number;
  isOpen: boolean;
  toggleCart: () => void;
}

export interface CartItemWithProduct {
  id: number;
  productId: number;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  product: {
    id: number;
    name: string;
    price: string;
    images: string[];
    category: string;
  };
}
