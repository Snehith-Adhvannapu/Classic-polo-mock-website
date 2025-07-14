import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount, toggleCart } = useCart();
  const isMobile = useIsMobile();

  const navigation = [
    { name: "Men", href: "/products/Men" },
    { name: "Women", href: "/products/Women" },
    { name: "Kids", href: "/products/Kids" },
    { name: "Accessories", href: "/products/Accessories" },
    { name: "All Products", href: "/all-products" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Classic Polo</h1>
              <span className="text-sm text-gray-500 ml-2 hidden sm:inline">
                Timeless polos & curated outfits
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-gray-700 hover:text-secondary transition-colors ${
                    location.includes(item.href) ? 'text-secondary font-medium' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Search and Cart */}
            <div className="flex items-center space-x-4">
              {!isMobile && (
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </form>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCart}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-gray-700 hover:text-secondary transition-colors ${
                    location.includes(item.href) ? 'text-secondary font-medium' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
