import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const heroSlides = [
  {
    title: "Premium Polos for Every Occasion",
    subtitle: "Discover our curated collection of timeless polo shirts and outfits crafted for style and comfort.",
    buttonText: "Shop Now",
    buttonLink: "/products",
    backgroundImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
  },
  {
    title: "New Spring Collection",
    subtitle: "Fresh colors and modern fits for the upcoming season. Style meets comfort in every piece.",
    buttonText: "Explore Collection",
    buttonLink: "/products",
    backgroundImage: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
  },
  {
    title: "Performance Wear",
    subtitle: "Advanced moisture-wicking fabrics and athletic cuts for your active lifestyle.",
    buttonText: "Shop Performance",
    buttonLink: "/products",
    backgroundImage: "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative h-96 bg-gradient-to-r from-primary to-gray-800 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 transition-opacity duration-1000"
        style={{ backgroundImage: `url(${currentHero.backgroundImage})` }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-white max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {currentHero.title}
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            {currentHero.subtitle}
          </p>
          <Link href={currentHero.buttonLink}>
            <Button 
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 text-lg"
            >
              {currentHero.buttonText}
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
