import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, X, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";

export default function CartSidebar() {
  const { items, updateQuantity, removeFromCart, clearCart, total, itemCount, isOpen, toggleCart } = useCart();

  const subtotal = total;
  const shipping = subtotal > 1500 ? 0 : 99; // Free shipping over ₹1500
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const finalTotal = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={toggleCart}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-4">Add some items to get started!</p>
              <Link href="/products">
                <Button onClick={toggleCart} className="bg-secondary hover:bg-secondary/90">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart
              <Badge variant="secondary" className="ml-2">
                {itemCount}
              </Badge>
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-gray-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </SheetHeader>
        
        <Separator className="my-4" />

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.product.images?.[0] || '/placeholder.jpg'}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{item.product.name}</h3>
                <p className="text-sm text-gray-600">
                  {item.selectedSize} • {item.selectedColor}
                </p>
                <p className="text-sm font-medium text-gray-900">₹{item.product.price}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeFromCart(item.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Cart Summary */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping:</span>
            <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
              {shipping === 0 ? 'Free' : `₹${shipping}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (GST):</span>
            <span className="font-medium">₹{tax}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
          
          {shipping > 0 && (
            <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
              Add ₹{(1500 - subtotal).toFixed(2)} more for free shipping!
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            className="w-full bg-secondary hover:bg-secondary/90 text-white"
            onClick={() => {
              // TODO: Implement checkout functionality
              alert('Checkout functionality would be implemented here');
            }}
          >
            Proceed to Checkout
          </Button>
          <Link href="/products">
            <Button
              variant="outline"
              className="w-full"
              onClick={toggleCart}
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
