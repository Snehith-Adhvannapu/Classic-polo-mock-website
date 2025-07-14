import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use first available color and size for quick add
    const firstColor = product.colors?.[0] || "";
    const firstSize = product.sizes?.[0] || "";
    
    if (!firstColor || !firstSize) {
      toast({
        title: "Please select options",
        description: "Please visit the product page to select color and size.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToCart(product.id, firstColor, firstSize, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
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

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'navy': 'bg-blue-900',
      'blue': 'bg-blue-600',
      'white': 'bg-white border-2 border-gray-300',
      'black': 'bg-black',
      'gray': 'bg-gray-500',
      'grey': 'bg-gray-500',
      'red': 'bg-red-500',
      'green': 'bg-green-600',
      'yellow': 'bg-yellow-500',
      'pink': 'bg-pink-500',
      'purple': 'bg-purple-500',
      'orange': 'bg-orange-500',
      'brown': 'bg-amber-600',
      'beige': 'bg-amber-100',
      'tan': 'bg-amber-200',
      'maroon': 'bg-red-800',
      'burgundy': 'bg-red-900',
      'olive': 'bg-green-700',
      'turquoise': 'bg-cyan-500',
      'teal': 'bg-teal-500',
      'coral': 'bg-coral-500',
      'lavender': 'bg-purple-300',
      'mint': 'bg-green-300',
      'charcoal': 'bg-gray-700',
      'khaki': 'bg-yellow-600',
    };

    const normalizedColor = color.toLowerCase().replace(/[\s-]/g, '');
    return colorMap[normalizedColor] || 'bg-gray-400';
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
        <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Tags */}
          <div className="absolute top-2 left-2">
            {product.tags?.slice(0, 1).map((tag) => (
              <Badge key={tag} className={`${getTagColor(tag)} text-xs`}>
                {tag.replace('_', ' ')}
              </Badge>
            ))}
          </div>
          
          {/* Wishlist Button */}
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 hover:bg-white shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: Implement wishlist functionality
              }}
            >
              <Heart className="h-4 w-4 text-gray-600" />
            </Button>
          </div>

          {/* Quick Add Button - appears on hover */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleQuickAdd}
              className="w-full bg-secondary hover:bg-secondary/90 text-white text-sm"
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.category}</p>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
            
            {/* Color Swatches */}
            <div className="flex items-center space-x-1">
              {product.colors?.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full border ${getColorClasses(color)}`}
                  title={color}
                />
              ))}
              {product.colors && product.colors.length > 3 && (
                <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {product.sizes?.length ? `Sizes: ${product.sizes.slice(0, 3).join(', ')}${product.sizes.length > 3 ? '...' : ''}` : 'One Size'}
            </div>
            <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
