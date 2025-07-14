import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertCartItemSchema, updateCartItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search } = req.query;
      let products;
      
      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers["session-id"] as string || "default-session";
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers["session-id"] as string || "default-session";
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        sessionId
      });
      
      // Check if item with same product, color, and size already exists
      const existingItems = await storage.getCartItems(sessionId);
      const existingItem = existingItems.find(item => 
        item.productId === validatedData.productId &&
        item.selectedColor === validatedData.selectedColor &&
        item.selectedSize === validatedData.selectedSize
      );
      
      if (existingItem) {
        // Update quantity instead of creating new item
        const updatedItem = await storage.updateCartItem(existingItem.id, {
          quantity: existingItem.quantity + (validatedData.quantity || 1)
        });
        res.json(updatedItem);
      } else {
        const cartItem = await storage.addToCart(validatedData);
        res.json(cartItem);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid cart item data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateCartItemSchema.parse(req.body);
      
      const updatedItem = await storage.updateCartItem(id, validatedData);
      
      if (!updatedItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid update data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromCart(id);
      
      if (!success) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers["session-id"] as string || "default-session";
      await storage.clearCart(sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // Categories endpoint
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = [
        { name: "Men", count: 15 },
        { name: "Women", count: 15 },
        { name: "Kids", count: 15 },
        { name: "Accessories", count: 15 }
      ];
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // CSV download route
  app.get("/api/products/export/csv", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      
      // Create CSV headers
      const headers = [
        'ID', 'SKU', 'Name', 'Description', 'Category', 'Subcategory', 
        'Price', 'Original Price', 'Fabric', 'Fit', 'Colors', 'Sizes', 
        'Images', 'Tags', 'In Stock', 'Stock Count', 'Product Link'
      ];
      
      // Create CSV rows
      const rows = products.map(product => [
        product.id,
        product.sku,
        `"${product.name}"`,
        `"${product.description || ''}"`,
        product.category,
        product.subcategory || '',
        product.price,
        product.originalPrice || '',
        product.fabric || '',
        product.fit || '',
        `"${product.colors?.join(', ') || ''}"`,
        `"${product.sizes?.join(', ') || ''}"`,
        `"${product.images?.join(', ') || ''}"`,
        `"${product.tags?.join(', ') || ''}"`,
        product.inStock ? 'Yes' : 'No',
        product.stockCount || 0,
        `"${req.protocol}://${req.get('host')}/product/${product.id}"`
      ]);
      
      // Combine headers and rows
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      
      // Set response headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="classic_polo_products.csv"');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ error: "Failed to export products" });
    }
  });

  // Sitemap route for SEO
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      const urls = [
        { url: baseUrl, changefreq: 'daily', priority: '1.0' },
        { url: `${baseUrl}/products`, changefreq: 'daily', priority: '0.9' },
        { url: `${baseUrl}/all-products`, changefreq: 'daily', priority: '0.9' },
        { url: `${baseUrl}/products/Men`, changefreq: 'weekly', priority: '0.8' },
        { url: `${baseUrl}/products/Women`, changefreq: 'weekly', priority: '0.8' },
        { url: `${baseUrl}/products/Kids`, changefreq: 'weekly', priority: '0.8' },
        { url: `${baseUrl}/products/Accessories`, changefreq: 'weekly', priority: '0.8' },
        ...products.map(product => ({
          url: `${baseUrl}/product/${product.id}`,
          changefreq: 'weekly',
          priority: '0.7'
        }))
      ];
      
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, changefreq, priority }) => `  <url>
    <loc>${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;
      
      res.setHeader('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate sitemap" });
    }
  });

  // Robots.txt for SEO
  app.get("/robots.txt", (req, res) => {
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  const httpServer = createServer(app);
  return httpServer;
}
