import { products, cartItems, users, type Product, type InsertProduct, type CartItem, type InsertCartItem, type UpdateCartItem, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart methods
  getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, updates: UpdateCartItem): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private currentUserId: number;
  private currentProductId: number;
  private currentCartId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCartId = 1;
    
    // Initialize with sample products
    this.initializeProducts();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description?.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      createdAt: new Date(),
      sizes: insertProduct.sizes || null,
      description: insertProduct.description || null,
      subcategory: insertProduct.subcategory || null,
      originalPrice: insertProduct.originalPrice || null,
      fabric: insertProduct.fabric || null,
      fit: insertProduct.fit || null,
      colors: insertProduct.colors || null,
      images: insertProduct.images || null,
      tags: insertProduct.tags || null,
      inStock: insertProduct.inStock !== undefined ? insertProduct.inStock : true,
      stockCount: insertProduct.stockCount || 0
    };
    this.products.set(id, product);
    return product;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
    
    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId!)!
    })).filter(item => item.product);
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartId++;
    const item: CartItem = { 
      ...insertItem, 
      id,
      createdAt: new Date(),
      productId: insertItem.productId || null,
      quantity: insertItem.quantity || 1,
      selectedColor: insertItem.selectedColor || null,
      selectedSize: insertItem.selectedSize || null
    };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: number, updates: UpdateCartItem): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    const itemsToDelete = Array.from(this.cartItems.entries())
      .filter(([, item]) => item.sessionId === sessionId)
      .map(([id]) => id);
    
    itemsToDelete.forEach(id => this.cartItems.delete(id));
  }

  private initializeProducts() {
    const menProducts: InsertProduct[] = [
      {
        sku: "MP-001",
        name: "Navy Piqué Polo",
        description: "Classic navy polo shirt made from premium cotton piqué fabric. Perfect for casual and semi-formal occasions.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1499",
        fabric: "Cotton Piqué",
        fit: "Classic Fit",
        colors: ["Navy", "White", "Gray"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["best_seller"],
        inStock: true,
        stockCount: 50
      },
      {
        sku: "MP-002",
        name: "White Jersey Polo",
        description: "Slim-fit white polo shirt in premium jersey fabric. Modern styling with comfortable stretch.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1299",
        fabric: "Jersey Cotton",
        fit: "Slim Fit",
        colors: ["White", "Light Blue", "Mint"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["new_arrival"],
        inStock: true,
        stockCount: 35
      },
      {
        sku: "MP-003",
        name: "Gray Striped Polo",
        description: "Sophisticated gray polo with subtle stripes. Limited edition design with classic appeal.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1399",
        fabric: "Cotton Blend",
        fit: "Classic Fit",
        colors: ["Gray", "Navy"],
        sizes: ["S", "M", "L"],
        images: [
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["limited"],
        inStock: true,
        stockCount: 15
      },
      {
        sku: "MP-004",
        name: "Black Performance Polo",
        description: "High-performance black polo with moisture-wicking technology. Perfect for active lifestyles.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1599",
        fabric: "Performance Polyester",
        fit: "Athletic Fit",
        colors: ["Black", "Charcoal", "Navy"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["performance"],
        inStock: true,
        stockCount: 40
      },
      {
        sku: "MP-005",
        name: "Green Tech-Dry Polo",
        description: "Eco-friendly green polo with advanced moisture management. Sustainable and comfortable.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1699",
        fabric: "Recycled Polyester",
        fit: "Regular Fit",
        colors: ["Forest Green", "Olive", "Sage"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["performance", "eco"],
        inStock: true,
        stockCount: 25
      },
      {
        sku: "MP-006",
        name: "Burgundy Rugby Polo",
        description: "Classic rugby-style polo in rich burgundy. Traditional design with modern comfort.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1799",
        fabric: "Heavy Cotton",
        fit: "Classic Fit",
        colors: ["Burgundy", "Navy", "Forest Green"],
        sizes: ["M", "L", "XL", "XXL"],
        images: [
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["classic"],
        inStock: true,
        stockCount: 30
      },
      {
        sku: "MP-007",
        name: "Yellow Golf Polo",
        description: "Bright yellow golf polo with UV protection. Perfect for outdoor activities.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1549",
        fabric: "Technical Mesh",
        fit: "Athletic Fit",
        colors: ["Yellow", "Orange", "Coral"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["sport", "performance"],
        inStock: true,
        stockCount: 20
      },
      {
        sku: "MP-008",
        name: "Maroon Long-Sleeve Polo",
        description: "Elegant maroon long-sleeve polo for cooler weather. Sophisticated and versatile.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1899",
        fabric: "Merino Wool Blend",
        fit: "Classic Fit",
        colors: ["Maroon", "Navy", "Charcoal"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["premium"],
        inStock: true,
        stockCount: 18
      },
      {
        sku: "MP-009",
        name: "Olive Piqué Polo",
        description: "Military-inspired olive piqué polo. Durable and stylish for everyday wear.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1499",
        fabric: "Cotton Piqué",
        fit: "Regular Fit",
        colors: ["Olive", "Khaki", "Brown"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["casual"],
        inStock: true,
        stockCount: 35
      },
      {
        sku: "MP-010",
        name: "Sky Blue Piqué Polo",
        description: "Fresh sky blue piqué polo perfect for summer. Light and breathable fabric.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1499",
        fabric: "Cotton Piqué",
        fit: "Classic Fit",
        colors: ["Sky Blue", "Powder Blue", "Turquoise"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["summer"],
        inStock: true,
        stockCount: 42
      },
      {
        sku: "MP-011",
        name: "Red Striped Polo",
        description: "Bold red striped polo with contemporary design. Makes a statement while staying classic.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1599",
        fabric: "Cotton Jersey",
        fit: "Slim Fit",
        colors: ["Red", "Burgundy", "Crimson"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["trendy"],
        inStock: true,
        stockCount: 28
      },
      {
        sku: "MP-012",
        name: "Beige Summer Polo",
        description: "Lightweight beige polo perfect for warm weather. Elegant neutral tone for versatile styling.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1449",
        fabric: "Linen Blend",
        fit: "Regular Fit",
        colors: ["Beige", "Cream", "Sand"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["summer", "light"],
        inStock: true,
        stockCount: 38
      },
      {
        sku: "MP-013",
        name: "Charcoal Slim Polo",
        description: "Sophisticated charcoal polo with modern slim fit. Professional and comfortable.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1599",
        fabric: "Premium Cotton",
        fit: "Slim Fit",
        colors: ["Charcoal", "Black", "Dark Gray"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["professional"],
        inStock: true,
        stockCount: 32
      },
      {
        sku: "MP-014",
        name: "Coral Sport Polo",
        description: "Vibrant coral sport polo with enhanced breathability. Perfect for active pursuits.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1649",
        fabric: "Moisture-Wicking Blend",
        fit: "Athletic Fit",
        colors: ["Coral", "Salmon", "Peach"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["sport", "performance"],
        inStock: true,
        stockCount: 24
      },
      {
        sku: "MP-015",
        name: "Teal Mesh Polo",
        description: "Modern teal mesh polo with advanced ventilation. Stylish and functional for any activity.",
        category: "Men",
        subcategory: "Polo Shirts",
        price: "1699",
        fabric: "Technical Mesh",
        fit: "Athletic Fit",
        colors: ["Teal", "Turquoise", "Aqua"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["performance", "mesh"],
        inStock: true,
        stockCount: 22
      }
    ];

    const womenProducts: InsertProduct[] = [
      {
        sku: "WP-001",
        name: "Pink Tech-Piqué Polo",
        description: "Feminine pink tech-piqué polo with moisture-wicking properties. Perfect blend of style and function.",
        category: "Women",
        subcategory: "Polo Shirts",
        price: "1399",
        fabric: "Technical Piqué",
        fit: "Fitted",
        colors: ["Pink", "Rose", "Blush"],
        sizes: ["XS", "S", "M", "L"],
        images: [
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["new_arrival"],
        inStock: true,
        stockCount: 45
      },
      {
        sku: "WP-002",
        name: "White Slim Polo",
        description: "Classic white slim-fit polo for women. Timeless elegance with modern comfort.",
        category: "Women",
        subcategory: "Polo Shirts",
        price: "1299",
        fabric: "Cotton Jersey",
        fit: "Slim Fit",
        colors: ["White", "Cream", "Off-White"],
        sizes: ["XS", "S", "M", "L"],
        images: [
          "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["classic", "best_seller"],
        inStock: true,
        stockCount: 55
      },
      {
        sku: "WP-003",
        name: "Lavender Piqué Polo",
        description: "Soft lavender piqué polo with feminine silhouette. Elegant and comfortable for any occasion.",
        category: "Women",
        subcategory: "Polo Shirts",
        price: "1499",
        fabric: "Cotton Piqué",
        fit: "Regular Fit",
        colors: ["Lavender", "Purple", "Lilac"],
        sizes: ["XS", "S", "M", "L"],
        images: [
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["feminine"],
        inStock: true,
        stockCount: 38
      },
      {
        sku: "WP-004",
        name: "Mint Green Polo",
        description: "Fresh mint green polo with breathable fabric. Perfect for spring and summer styling.",
        category: "Women",
        subcategory: "Polo Shirts",
        price: "1399",
        fabric: "Cotton Blend",
        fit: "Fitted",
        colors: ["Mint", "Sage", "Seafoam"],
        sizes: ["XS", "S", "M", "L"],
        images: [
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["spring", "fresh"],
        inStock: true,
        stockCount: 42
      },
      {
        sku: "WP-005",
        name: "Coral Performance Polo",
        description: "Vibrant coral performance polo with UV protection. Ideal for outdoor activities.",
        category: "Women",
        subcategory: "Polo Shirts",
        price: "1599",
        fabric: "Performance Polyester",
        fit: "Athletic Fit",
        colors: ["Coral", "Salmon", "Peach"],
        sizes: ["XS", "S", "M", "L"],
        images: [
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["performance", "sport"],
        inStock: true,
        stockCount: 35
      },
      {
        sku: "WP-006",
        name: "Navy Feminine Polo",
        description: "Classic navy polo with feminine cut and detailing. Professional yet stylish.",
        category: "Women",
        subcategory: "Polo Shirts",
        price: "1449",
        fabric: "Premium Cotton",
        fit: "Fitted",
        colors: ["Navy", "Midnight", "Royal Blue"],
        sizes: ["XS", "S", "M", "L"],
        images: [
          "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["professional", "classic"],
        inStock: true,
        stockCount: 48
      },
      {
        sku: "WP-007",
        name: "Dusty Rose Polo",
        description: "Elegant dusty rose polo with soft texture. Sophisticated color for versatile styling.",
        category: "Women",
        subcategory: "Polo Shirts",
        price: "1549",
        fabric: "Soft Cotton",
        fit: "Regular Fit",
        colors: ["Dusty Rose", "Mauve", "Blush"],
        sizes: ["XS", "S", "M", "L"],
        images: [
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["elegant", "soft"],
        inStock: true,
        stockCount: 32
      },
      {
        sku: "WP-008",
        name: "Turquoise Sport Polo",
        description: "Bright turquoise sport polo with moisture management. Perfect for active lifestyles.",
        category: "Women",
        subcategory: "Polo Shirts",
        price: "1599",
        fabric: "Sport Mesh",
        fit: "Athletic Fit",
        colors: ["Turquoise", "Teal", "Aqua"],
        sizes: ["XS", "S", "M", "L"],
        images: [
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["sport", "performance"],
        inStock: true,
        stockCount: 28
      },
      {
        sku: "WP-009",
        name: "Burgundy Elegant Polo",
        description: "Rich burgundy polo with refined styling. Perfect for professional and casual wear.",
        category: "Women",
        subcategory: "Polo Shirts",
        price: "1649",
        fabric: "Premium Cotton",
        fit: "Fitted",
        colors: ["Burgundy", "Wine", "Maroon"],
        sizes: ["XS", "S", "M", "L"],
        images: [
          "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["elegant", "premium"],
        inStock: true,
        stockCount: 25
      },
      {
        sku: "WP-010",
        name: "Charcoal Gray Polo",
        description: "Sophisticated charcoal gray polo with modern cut. Versatile and stylish for any occasion.",
        category: "Women",
        subcategory: "Polo Shirts",
        price: "1499",
        fabric: "Cotton Jersey",
        fit: "Slim Fit",
        colors: ["Charcoal", "Gray", "Silver"],
        sizes: ["XS", "S", "M", "L"],
        images: [
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["versatile", "modern"],
        inStock: true,
        stockCount: 40
      },
      {
        sku: "WH-001",
        name: "Navy Hoodie",
        description: "Comfortable navy hoodie with premium cotton blend. Perfect for casual wear and layering.",
        category: "Women",
        subcategory: "Hoodies",
        price: "1999",
        fabric: "Cotton Blend",
        fit: "Regular Fit",
        colors: ["Navy", "Black", "Gray"],
        sizes: ["XS", "S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["casual", "comfortable"],
        inStock: true,
        stockCount: 35
      },
      {
        sku: "WH-002",
        name: "Gray Crop Hoodie",
        description: "Trendy gray crop hoodie with modern silhouette. Perfect for contemporary styling.",
        category: "Women",
        subcategory: "Hoodies",
        price: "1899",
        fabric: "Cotton French Terry",
        fit: "Cropped Fit",
        colors: ["Gray", "Charcoal", "Light Gray"],
        sizes: ["XS", "S", "M", "L"],
        images: [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["trendy", "crop"],
        inStock: true,
        stockCount: 30
      },
      {
        sku: "WL-001",
        name: "Black Leggings",
        description: "High-quality black leggings with compression fit. Perfect for workouts and casual wear.",
        category: "Women",
        subcategory: "Leggings",
        price: "1699",
        fabric: "Performance Stretch",
        fit: "Compression Fit",
        colors: ["Black", "Navy", "Gray"],
        sizes: ["XS", "S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1506629905687-42b46d30d554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["performance", "compression"],
        inStock: true,
        stockCount: 50
      },
      {
        sku: "WH-003",
        name: "Maroon Hoodie",
        description: "Cozy maroon hoodie with soft interior lining. Perfect for cool weather comfort.",
        category: "Women",
        subcategory: "Hoodies",
        price: "1999",
        fabric: "Cotton Fleece",
        fit: "Regular Fit",
        colors: ["Maroon", "Burgundy", "Wine"],
        sizes: ["XS", "S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["cozy", "warm"],
        inStock: true,
        stockCount: 25
      },
      {
        sku: "WP-011",
        name: "Sage Green Polo",
        description: "Calming sage green polo with soft texture. Natural and elegant color choice.",
        category: "Women",
        subcategory: "Polo Shirts",
        price: "1449",
        fabric: "Organic Cotton",
        fit: "Regular Fit",
        colors: ["Sage", "Mint", "Eucalyptus"],
        sizes: ["XS", "S", "M", "L"],
        images: [
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["natural", "organic"],
        inStock: true,
        stockCount: 33
      }
    ];

    const kidsProducts: InsertProduct[] = [
      {
        sku: "KP-001",
        name: "Kids Red Polo",
        description: "Bright red polo shirt for kids. Durable and comfortable for active play.",
        category: "Kids",
        subcategory: "Polo Shirts",
        price: "799",
        fabric: "Cotton Blend",
        fit: "Regular Fit",
        colors: ["Red", "Bright Red", "Crimson"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12", "14", "16"],
        images: [
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["colorful", "durable"],
        inStock: true,
        stockCount: 60
      },
      {
        sku: "KP-002",
        name: "Kids Blue Striped Polo",
        description: "Fun blue striped polo for kids. Classic design with playful appeal.",
        category: "Kids",
        subcategory: "Polo Shirts",
        price: "849",
        fabric: "Cotton Jersey",
        fit: "Regular Fit",
        colors: ["Blue Stripe", "Navy Stripe", "Royal Stripe"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12", "14", "16"],
        images: [
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["striped", "playful"],
        inStock: true,
        stockCount: 45
      },
      {
        sku: "KP-003",
        name: "Kids Yellow Polo",
        description: "Bright yellow polo that kids love. Cheerful and easy to care for.",
        category: "Kids",
        subcategory: "Polo Shirts",
        price: "799",
        fabric: "Cotton Blend",
        fit: "Regular Fit",
        colors: ["Yellow", "Bright Yellow", "Lemon"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12", "14", "16"],
        images: [
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["bright", "cheerful"],
        inStock: true,
        stockCount: 55
      },
      {
        sku: "KP-004",
        name: "Kids Green Polo",
        description: "Fresh green polo for active kids. Comfortable and vibrant color.",
        category: "Kids",
        subcategory: "Polo Shirts",
        price: "799",
        fabric: "Cotton Piqué",
        fit: "Regular Fit",
        colors: ["Green", "Forest Green", "Lime"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12", "14", "16"],
        images: [
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["fresh", "active"],
        inStock: true,
        stockCount: 48
      },
      {
        sku: "KP-005",
        name: "Kids Purple Polo",
        description: "Vibrant purple polo for kids. Unique color that stands out.",
        category: "Kids",
        subcategory: "Polo Shirts",
        price: "849",
        fabric: "Cotton Jersey",
        fit: "Regular Fit",
        colors: ["Purple", "Violet", "Plum"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12", "14", "16"],
        images: [
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["unique", "vibrant"],
        inStock: true,
        stockCount: 38
      },
      {
        sku: "KP-006",
        name: "Kids Orange Polo",
        description: "Bold orange polo for energetic kids. Perfect for playtime and casual wear.",
        category: "Kids",
        subcategory: "Polo Shirts",
        price: "799",
        fabric: "Cotton Blend",
        fit: "Regular Fit",
        colors: ["Orange", "Bright Orange", "Coral"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12", "14", "16"],
        images: [
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["energetic", "bold"],
        inStock: true,
        stockCount: 42
      },
      {
        sku: "KP-007",
        name: "Kids Pink Polo",
        description: "Sweet pink polo for kids. Soft and comfortable with adorable styling.",
        category: "Kids",
        subcategory: "Polo Shirts",
        price: "849",
        fabric: "Soft Cotton",
        fit: "Regular Fit",
        colors: ["Pink", "Rose", "Blush"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12", "14", "16"],
        images: [
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["sweet", "soft"],
        inStock: true,
        stockCount: 50
      },
      {
        sku: "KP-008",
        name: "Kids Turquoise Polo",
        description: "Cool turquoise polo for kids. Modern color that's both fun and stylish.",
        category: "Kids",
        subcategory: "Polo Shirts",
        price: "799",
        fabric: "Cotton Piqué",
        fit: "Regular Fit",
        colors: ["Turquoise", "Teal", "Aqua"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12", "14", "16"],
        images: [
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["modern", "cool"],
        inStock: true,
        stockCount: 35
      },
      {
        sku: "KP-009",
        name: "Kids Navy Polo",
        description: "Classic navy polo for kids. Versatile and timeless design.",
        category: "Kids",
        subcategory: "Polo Shirts",
        price: "849",
        fabric: "Premium Cotton",
        fit: "Regular Fit",
        colors: ["Navy", "Dark Blue", "Midnight"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12", "14", "16"],
        images: [
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["classic", "versatile"],
        inStock: true,
        stockCount: 65
      },
      {
        sku: "KP-010",
        name: "Kids White Polo",
        description: "Clean white polo for kids. Perfect for school and special occasions.",
        category: "Kids",
        subcategory: "Polo Shirts",
        price: "799",
        fabric: "Cotton Blend",
        fit: "Regular Fit",
        colors: ["White", "Cream", "Off-White"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12", "14", "16"],
        images: [
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["clean", "school"],
        inStock: true,
        stockCount: 58
      },
      {
        sku: "KH-001",
        name: "Kids Rainbow Hoodie",
        description: "Colorful rainbow hoodie for kids. Fun and cozy for cooler weather.",
        category: "Kids",
        subcategory: "Hoodies",
        price: "1299",
        fabric: "Cotton Fleece",
        fit: "Regular Fit",
        colors: ["Rainbow", "Multi-Color"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12", "14", "16"],
        images: [
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["colorful", "fun"],
        inStock: true,
        stockCount: 30
      },
      {
        sku: "KH-002",
        name: "Kids Space Hoodie",
        description: "Space-themed hoodie for kids. Perfect for little explorers and dreamers.",
        category: "Kids",
        subcategory: "Hoodies",
        price: "1399",
        fabric: "Cotton Blend",
        fit: "Regular Fit",
        colors: ["Space Blue", "Galaxy", "Cosmic"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12", "14", "16"],
        images: [
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["space", "explorer"],
        inStock: true,
        stockCount: 25
      },
      {
        sku: "KS-001",
        name: "Kids Denim Shorts",
        description: "Comfortable denim shorts for kids. Perfect for summer adventures.",
        category: "Kids",
        subcategory: "Shorts",
        price: "899",
        fabric: "Cotton Denim",
        fit: "Regular Fit",
        colors: ["Light Blue", "Dark Blue", "Faded Blue"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12", "14", "16"],
        images: [
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["summer", "adventure"],
        inStock: true,
        stockCount: 40
      },
      {
        sku: "KS-002",
        name: "Kids Khaki Shorts",
        description: "Versatile khaki shorts for kids. Great for school and play.",
        category: "Kids",
        subcategory: "Shorts",
        price: "799",
        fabric: "Cotton Twill",
        fit: "Regular Fit",
        colors: ["Khaki", "Beige", "Tan"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12", "14", "16"],
        images: [
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["versatile", "school"],
        inStock: true,
        stockCount: 45
      }
    ];

    const accessoriesProducts: InsertProduct[] = [
      {
        sku: "AC-001",
        name: "Blue Baseball Cap",
        description: "Classic blue baseball cap with adjustable strap. Perfect for casual wear and sun protection.",
        category: "Accessories",
        subcategory: "Caps",
        price: "499",
        fabric: "Cotton Twill",
        fit: "One Size",
        colors: ["Blue", "Navy", "Royal Blue"],
        sizes: ["One Size"],
        images: [
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["casual", "sun_protection"],
        inStock: true,
        stockCount: 75
      },
      {
        sku: "AC-002",
        name: "Red Leather Belt",
        description: "Premium red leather belt with polished buckle. Adds a pop of color to any outfit.",
        category: "Accessories",
        subcategory: "Belts",
        price: "699",
        fabric: "Genuine Leather",
        fit: "Adjustable",
        colors: ["Red", "Burgundy", "Crimson"],
        sizes: ["28", "30", "32", "34", "36", "38", "40", "42", "44"],
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["premium", "leather"],
        inStock: true,
        stockCount: 45
      },
      {
        sku: "AC-003",
        name: "Gray Cotton Socks",
        description: "Comfortable gray cotton socks. Soft and breathable for all-day wear.",
        category: "Accessories",
        subcategory: "Socks",
        price: "299",
        fabric: "Cotton Blend",
        fit: "Regular",
        colors: ["Gray", "Charcoal", "Light Gray"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["comfortable", "breathable"],
        inStock: true,
        stockCount: 100
      },
      {
        sku: "AC-004",
        name: "Black Leather Wallet",
        description: "Sleek black leather wallet with multiple compartments. Perfect for organizing cards and cash.",
        category: "Accessories",
        subcategory: "Wallets",
        price: "899",
        fabric: "Genuine Leather",
        fit: "Standard",
        colors: ["Black", "Dark Brown", "Tan"],
        sizes: ["One Size"],
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["sleek", "organized"],
        inStock: true,
        stockCount: 65
      },
      {
        sku: "AC-005",
        name: "White Sports Socks",
        description: "Performance white sports socks with cushioned sole. Perfect for athletic activities.",
        category: "Accessories",
        subcategory: "Socks",
        price: "399",
        fabric: "Performance Blend",
        fit: "Athletic",
        colors: ["White", "Off-White", "Cream"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["performance", "athletic"],
        inStock: true,
        stockCount: 85
      },
      {
        sku: "AC-006",
        name: "Navy Canvas Backpack",
        description: "Durable navy canvas backpack with laptop compartment. Perfect for work and travel.",
        category: "Accessories",
        subcategory: "Bags",
        price: "1299",
        fabric: "Canvas",
        fit: "One Size",
        colors: ["Navy", "Black", "Khaki"],
        sizes: ["One Size"],
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["durable", "laptop"],
        inStock: true,
        stockCount: 40
      },
      {
        sku: "AC-007",
        name: "Brown Leather Belt",
        description: "Classic brown leather belt with brass buckle. Timeless accessory for any wardrobe.",
        category: "Accessories",
        subcategory: "Belts",
        price: "799",
        fabric: "Genuine Leather",
        fit: "Adjustable",
        colors: ["Brown", "Tan", "Cognac"],
        sizes: ["28", "30", "32", "34", "36", "38", "40", "42", "44"],
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["classic", "timeless"],
        inStock: true,
        stockCount: 55
      },
      {
        sku: "AC-008",
        name: "Black Baseball Cap",
        description: "Versatile black baseball cap with embroidered logo. Perfect for any casual outfit.",
        category: "Accessories",
        subcategory: "Caps",
        price: "549",
        fabric: "Cotton Twill",
        fit: "One Size",
        colors: ["Black", "Charcoal", "Dark Gray"],
        sizes: ["One Size"],
        images: [
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["versatile", "embroidered"],
        inStock: true,
        stockCount: 80
      },
      {
        sku: "AC-009",
        name: "Navy Dress Socks",
        description: "Elegant navy dress socks for formal occasions. Soft and comfortable for long wear.",
        category: "Accessories",
        subcategory: "Socks",
        price: "449",
        fabric: "Cotton Blend",
        fit: "Dress",
        colors: ["Navy", "Black", "Charcoal"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["elegant", "formal"],
        inStock: true,
        stockCount: 90
      },
      {
        sku: "AC-010",
        name: "Gray Wool Beanie",
        description: "Warm gray wool beanie for cold weather. Soft and cozy with timeless design.",
        category: "Accessories",
        subcategory: "Hats",
        price: "599",
        fabric: "Wool Blend",
        fit: "One Size",
        colors: ["Gray", "Charcoal", "Light Gray"],
        sizes: ["One Size"],
        images: [
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["warm", "cozy"],
        inStock: true,
        stockCount: 60
      },
      {
        sku: "AC-011",
        name: "Tan Leather Wallet",
        description: "Premium tan leather wallet with RFID protection. Modern security meets classic style.",
        category: "Accessories",
        subcategory: "Wallets",
        price: "999",
        fabric: "Genuine Leather",
        fit: "Standard",
        colors: ["Tan", "Brown", "Cognac"],
        sizes: ["One Size"],
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["premium", "rfid"],
        inStock: true,
        stockCount: 35
      },
      {
        sku: "AC-012",
        name: "White Canvas Sneakers",
        description: "Classic white canvas sneakers for casual wear. Comfortable and versatile footwear.",
        category: "Accessories",
        subcategory: "Shoes",
        price: "1499",
        fabric: "Canvas",
        fit: "Regular",
        colors: ["White", "Off-White", "Cream"],
        sizes: ["6", "7", "8", "9", "10", "11", "12"],
        images: [
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["classic", "comfortable"],
        inStock: true,
        stockCount: 50
      },
      {
        sku: "AC-013",
        name: "Red Wool Scarf",
        description: "Cozy red wool scarf for winter warmth. Soft texture with elegant drape.",
        category: "Accessories",
        subcategory: "Scarves",
        price: "799",
        fabric: "Wool Blend",
        fit: "One Size",
        colors: ["Red", "Burgundy", "Crimson"],
        sizes: ["One Size"],
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["cozy", "winter"],
        inStock: true,
        stockCount: 45
      },
      {
        sku: "AC-014",
        name: "Black Leather Gloves",
        description: "Elegant black leather gloves with soft lining. Perfect for cold weather protection.",
        category: "Accessories",
        subcategory: "Gloves",
        price: "899",
        fabric: "Genuine Leather",
        fit: "Standard",
        colors: ["Black", "Brown", "Tan"],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["elegant", "protection"],
        inStock: true,
        stockCount: 30
      },
      {
        sku: "AC-015",
        name: "Gray Canvas Tote Bag",
        description: "Spacious gray canvas tote bag for everyday use. Durable and stylish carry-all.",
        category: "Accessories",
        subcategory: "Bags",
        price: "999",
        fabric: "Canvas",
        fit: "One Size",
        colors: ["Gray", "Charcoal", "Light Gray"],
        sizes: ["One Size"],
        images: [
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
        ],
        tags: ["spacious", "everyday"],
        inStock: true,
        stockCount: 38
      }
    ];

    // Add all products to storage
    [...menProducts, ...womenProducts, ...kidsProducts, ...accessoriesProducts].forEach(product => {
      const id = this.currentProductId++;
      const fullProduct: Product = {
        ...product,
        id,
        createdAt: new Date(),
        description: product.description || null,
        subcategory: product.subcategory || null,
        originalPrice: product.originalPrice || null,
        fabric: product.fabric || null,
        fit: product.fit || null,
        colors: product.colors || null,
        sizes: product.sizes || null,
        images: product.images || null,
        tags: product.tags || null,
        inStock: product.inStock !== undefined ? product.inStock : true,
        stockCount: product.stockCount || 0
      };
      this.products.set(id, fullProduct);
    });
  }
}

export const storage = new MemStorage();
