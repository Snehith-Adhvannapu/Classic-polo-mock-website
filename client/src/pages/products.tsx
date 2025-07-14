import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import FiltersSidebar from "@/components/filters-sidebar";
import ProductGrid from "@/components/product-grid";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import type { Product } from "@shared/schema";
import type { FilterState } from "@/lib/types";

export default function Products() {
  const [match, params] = useRoute("/products/:category");
  const category = params?.category;

  const [filters, setFilters] = useState<FilterState>({
    categories: category ? [category] : [],
    priceRange: [0, 5000],
    sizes: [],
    colors: [],
    inStockOnly: false,
    sortBy: 'featured'
  });

  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', category ? `?category=${category}` : ''],
  });

  // Apply filters
  const filteredProducts = allProducts.filter(product => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    // Price filter
    const price = parseFloat(product.price);
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    // Size filter
    if (filters.sizes.length > 0) {
      const hasSize = filters.sizes.some(size => product.sizes?.includes(size));
      if (!hasSize) return false;
    }

    // Color filter
    if (filters.colors.length > 0) {
      const hasColor = filters.colors.some(color => 
        product.colors?.some(productColor => 
          productColor.toLowerCase().includes(color.toLowerCase())
        )
      );
      if (!hasColor) return false;
    }

    // Stock filter
    if (filters.inStockOnly && !product.inStock) {
      return false;
    }

    return true;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price_high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'newest':
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      case 'best_sellers':
        return (b.tags?.includes('best_seller') ? 1 : 0) - (a.tags?.includes('best_seller') ? 1 : 0);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <FiltersSidebar 
            filters={filters} 
            onFiltersChange={setFilters}
            productCount={sortedProducts.length}
          />
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {category ? `${category} Collection` : 'All Products'}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
                </span>
                <select 
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="best_sellers">Best Sellers</option>
                </select>
              </div>
            </div>
            
            <ProductGrid products={sortedProducts} />
          </div>
        </div>
      </div>
      
      <Footer />
      <CartSidebar />
    </div>
  );
}
