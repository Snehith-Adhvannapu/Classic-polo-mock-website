import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const [match, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : 0;
  
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { addToCart, toggleCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['/api/products', productId],
    enabled: !!productId,
  });

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!selectedColor || !selectedSize) {
      toast({
        title: "Please select options",
        description: "Please select a color and size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToCart(product.id, selectedColor, selectedSize, quantity);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
      toggleCart();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  // Set default selections
  if (!selectedColor && product.colors && product.colors.length > 0) {
    setSelectedColor(product.colors[0]);
  }
  if (!selectedSize && product.sizes && product.sizes.length > 0) {
    setSelectedSize(product.sizes[0]);
  }

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'best_seller':
        return 'bg-green-100 text-green-800';
      case 'new_arrival':
        return 'bg-blue-100 text-blue-800';
      case 'limited':
        return 'bg-orange-100 text-orange-800';
      case 'performance':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Enhanced SEO and Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.images || ["/placeholder.jpg"],
            "sku": product.sku,
            "brand": {
              "@type": "Brand",
              "name": "Classic Polo"
            },
            "category": product.category,
            "color": product.colors?.join(", "),
            "size": product.sizes?.join(", "),
            "material": product.fabric,
            "manufacturer": {
              "@type": "Organization",
              "name": "Classic Polo"
            },
            "offers": {
              "@type": "Offer",
              "url": `/product/${product.id}`,
              "priceCurrency": "INR",
              "price": product.price,
              "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Classic Polo"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.5",
              "reviewCount": "127",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img 
                src={product.images?.[selectedImage] || '/placeholder.jpg'} 
                alt={product.name}
                className="w-full h-full object-cover"
                itemProp="image"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images?.map((image, index) => (
                <div 
                  key={index}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                    selectedImage === index ? 'border-secondary' : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              {product.tags?.map((tag) => (
                <Badge key={tag} className={`${getTagColor(tag)} mr-2`}>
                  {tag.replace('_', ' ')}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.category} • {product.subcategory}</p>
            <div className="text-3xl font-bold text-gray-900 mb-6">₹{product.price}</div>
            
            {product.description && (
              <p className="text-gray-700 mb-6">{product.description}</p>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Color: {selectedColor}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedColor === color 
                          ? 'border-secondary bg-secondary text-white' 
                          : 'border-gray-300 hover:border-secondary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Size: {selectedSize}
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedSize === size 
                          ? 'border-secondary bg-secondary text-white' 
                          : 'border-gray-300 hover:border-secondary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-secondary transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-secondary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex space-x-4 mb-6">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-secondary hover:bg-secondary/90 text-white"
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
                {product.fabric && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fabric:</span>
                    <span className="font-medium">{product.fabric}</span>
                  </div>
                )}
                {product.fit && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fit:</span>
                    <span className="font-medium">{product.fit}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock Status:</span>
                  <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                {product.stockCount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium">{product.stockCount} units</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <CartSidebar />
    </div>
  );
}
