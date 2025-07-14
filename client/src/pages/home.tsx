import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import CategoryGrid from "@/components/category-grid";
import ProductGrid from "@/components/product-grid";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

export default function Home() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Get featured products (first 8)
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      <CategoryGrid />
      
      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium polos and accessories
            </p>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
      
      <Footer />
      <CartSidebar />
    </div>
  );
}
