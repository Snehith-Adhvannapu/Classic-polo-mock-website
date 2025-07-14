import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Navigation from "@/components/navigation";
import ProductCard from "@/components/product-card";
import Footer from "@/components/footer";
import type { Product } from "@shared/schema";

export default function AllProducts() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Update document title for SEO
  useEffect(() => {
    document.title = "All Products - Classic Polo | Complete Product Catalog";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `Browse our complete catalog of ${products.length} premium polo shirts and accessories. Find the perfect fit from our collection of men's, women's, and kids' clothing at Classic Polo.`
      );
    }
  }, [products.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* SEO-friendly page structure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            All Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our complete collection of {products.length} premium polo shirts, 
            accessories, and curated outfits for men, women, and kids.
          </p>
        </div>

        {/* Product Count and Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span>Total Products: {products.length}</span>
            <span>•</span>
            <span>Men's: {products.filter(p => p.category === 'Men').length}</span>
            <span>•</span>
            <span>Women's: {products.filter(p => p.category === 'Women').length}</span>
            <span>•</span>
            <span>Kids': {products.filter(p => p.category === 'Kids').length}</span>
            <span>•</span>
            <span>Accessories: {products.filter(p => p.category === 'Accessories').length}</span>
          </div>
        </div>

        {/* Structured Data for all products */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "All Products - Classic Polo",
              "description": `Complete catalog of ${products.length} premium polo shirts and accessories`,
              "url": "/all-products",
              "mainEntity": {
                "@type": "ItemList",
                "numberOfItems": products.length,
                "itemListElement": products.map((product, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Product",
                    "name": product.name,
                    "description": product.description,
                    "image": product.images?.[0] || "/placeholder.jpg",
                    "sku": product.sku,
                    "url": `/product/${product.id}`,
                    "brand": {
                      "@type": "Brand",
                      "name": "Classic Polo"
                    },
                    "offers": {
                      "@type": "Offer",
                      "url": `/product/${product.id}`,
                      "priceCurrency": "INR",
                      "price": product.price,
                      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                    },
                    "category": product.category,
                    "color": product.colors?.join(", "),
                    "size": product.sizes?.join(", "),
                    "material": product.fabric
                  }
                }))
              }
            })
          }}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} itemScope itemType="https://schema.org/Product">
              <meta itemProp="name" content={product.name} />
              <meta itemProp="description" content={product.description || ""} />
              <meta itemProp="image" content={product.images?.[0] || "/placeholder.jpg"} />
              <meta itemProp="sku" content={product.sku} />
              <meta itemProp="brand" content="Classic Polo" />
              <meta itemProp="category" content={product.category} />
              <meta itemProp="color" content={product.colors?.join(", ") || ""} />
              <meta itemProp="size" content={product.sizes?.join(", ") || ""} />
              <meta itemProp="material" content={product.fabric || ""} />
              
              <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <meta itemProp="priceCurrency" content="INR" />
                <meta itemProp="price" content={product.price} />
                <meta itemProp="availability" content={product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
                <meta itemProp="url" content={`/product/${product.id}`} />
              </div>
              
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No products found
            </h2>
            <p className="text-gray-600">
              We're updating our catalog. Please check back soon!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}