import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Heart, Minus, Plus, ShoppingCart, X } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { addToCart, toggleCart } = useCart();
  const { toast } = useToast();

  // Reset state when modal opens/closes or product changes
  useState(() => {
    if (product && isOpen) {
      setSelectedColor(product.colors?.[0] || "");
      setSelectedSize(product.sizes?.[0] || "");
      setQuantity(1);
      setSelectedImage(0);
    }
  }, [product, isOpen]);

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
      onClose();
      toggleCart();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Product Details</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img 
                src={product.images?.[selectedImage] || '/placeholder.jpg'} 
                alt={product.name}
                className="w-full h-full object-cover"
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
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-4 shadow-lg transition-all ${
                        selectedColor === color 
                          ? 'border-secondary ring-2 ring-secondary ring-offset-2' 
                          : 'border-gray-300 hover:border-secondary'
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : 
                                       color.toLowerCase() === 'black' ? '#000000' :
                                       color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                       color.toLowerCase() === 'gray' || color.toLowerCase() === 'grey' ? '#6b7280' :
                                       color.toLowerCase() === 'red' ? '#dc2626' :
                                       color.toLowerCase() === 'blue' ? '#2563eb' :
                                       color.toLowerCase() === 'green' ? '#059669' :
                                       color.toLowerCase() === 'yellow' ? '#eab308' :
                                       color.toLowerCase() === 'pink' ? '#ec4899' :
                                       color.toLowerCase() === 'purple' ? '#9333ea' :
                                       color.toLowerCase() === 'orange' ? '#ea580c' :
                                       color.toLowerCase() === 'brown' ? '#92400e' :
                                       '#6b7280'
                      }}
                      title={color}
                    />
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
                      className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                        selectedSize === size 
                          ? 'border-secondary bg-secondary text-white' 
                          : 'border-gray-300 hover:border-secondary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button className="text-sm text-secondary hover:underline mt-2">
                  Size Guide
                </button>
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
              <Button 
                variant="outline" 
                size="icon"
                className="border-2 border-gray-300 hover:border-secondary"
              >
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
      </DialogContent>
    </Dialog>
  );
}
