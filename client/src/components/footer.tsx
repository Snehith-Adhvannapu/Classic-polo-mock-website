import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Youtube, ArrowRight, Download } from "lucide-react";

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    alert('Newsletter subscription would be implemented here');
  };

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Classic Polo</h3>
            <p className="text-gray-300 mb-4">
              Timeless polos & curated outfits for every occasion. Quality craftsmanship meets modern style.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/products/Men" className="hover:text-white transition-colors">
                  Men's Polos
                </Link>
              </li>
              <li>
                <Link href="/products/Women" className="hover:text-white transition-colors">
                  Women's Polos
                </Link>
              </li>
              <li>
                <Link href="/products/Kids" className="hover:text-white transition-colors">
                  Kids' Collection
                </Link>
              </li>
              <li>
                <Link href="/products/Accessories" className="hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/products?tags=new_arrival" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?tags=best_seller" className="hover:text-white transition-colors">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">
              Subscribe for updates, exclusive offers, and style tips.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex space-x-2 mb-4">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
              <Button
                type="submit"
                size="icon"
                className="bg-secondary hover:bg-secondary/90"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            
            {/* CSV Download Button */}
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => {
                  window.open('/api/products/export/csv', '_blank');
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Products CSV
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="text-center text-gray-300 text-sm">
          <p>
            &copy; 2024 Classic Polo. All rights reserved. |{' '}
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>{' '}
            |{' '}
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
