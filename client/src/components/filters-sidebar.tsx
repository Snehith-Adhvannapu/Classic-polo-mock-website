import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { FilterState } from "@/lib/types";

interface FiltersSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  productCount: number;
}

const categories = [
  { id: "Men", label: "Men" },
  { id: "Women", label: "Women" },
  { id: "Kids", label: "Kids" },
  { id: "Accessories", label: "Accessories" },
];

const sizes = [
  { id: "XS", label: "XS" },
  { id: "S", label: "S" },
  { id: "M", label: "M" },
  { id: "L", label: "L" },
  { id: "XL", label: "XL" },
  { id: "XXL", label: "XXL" },
];

const colors = [
  { id: "black", label: "Black", colorClass: "bg-black" },
  { id: "white", label: "White", colorClass: "bg-white border-2 border-gray-300" },
  { id: "navy", label: "Navy", colorClass: "bg-blue-900" },
  { id: "gray", label: "Gray", colorClass: "bg-gray-500" },
  { id: "red", label: "Red", colorClass: "bg-red-500" },
  { id: "blue", label: "Blue", colorClass: "bg-blue-600" },
  { id: "green", label: "Green", colorClass: "bg-green-600" },
  { id: "pink", label: "Pink", colorClass: "bg-pink-500" },
  { id: "purple", label: "Purple", colorClass: "bg-purple-500" },
  { id: "yellow", label: "Yellow", colorClass: "bg-yellow-500" },
  { id: "orange", label: "Orange", colorClass: "bg-orange-500" },
  { id: "brown", label: "Brown", colorClass: "bg-amber-600" },
];

export default function FiltersSidebar({ filters, onFiltersChange, productCount }: FiltersSidebarProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    sizes: true,
    colors: true,
    stock: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    updateFilter('categories', newCategories);
  };

  const toggleSize = (sizeId: string) => {
    const newSizes = filters.sizes.includes(sizeId)
      ? filters.sizes.filter(id => id !== sizeId)
      : [...filters.sizes, sizeId];
    updateFilter('sizes', newSizes);
  };

  const toggleColor = (colorId: string) => {
    const newColors = filters.colors.includes(colorId)
      ? filters.colors.filter(id => id !== colorId)
      : [...filters.colors, colorId];
    updateFilter('colors', newColors);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 5000],
      sizes: [],
      colors: [],
      inStockOnly: false,
      sortBy: 'featured'
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || 
                         filters.sizes.length > 0 || 
                         filters.colors.length > 0 || 
                         filters.inStockOnly || 
                         filters.priceRange[0] > 0 || 
                         filters.priceRange[1] < 5000;

  return (
    <div className="w-full lg:w-64 space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
        {productCount} product{productCount !== 1 ? 's' : ''} found
      </div>

      {/* Categories Filter */}
      <Card>
        <Collapsible open={openSections.categories} onOpenChange={() => toggleSection('categories')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Category</CardTitle>
                {openSections.categories ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label
                      htmlFor={category.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Price Range</CardTitle>
                {openSections.price ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilter('priceRange', value)}
                  max={5000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>₹{filters.priceRange[0]}</span>
                  <span>₹{filters.priceRange[1]}</span>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Size Filter */}
      <Card>
        <Collapsible open={openSections.sizes} onOpenChange={() => toggleSection('sizes')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Size</CardTitle>
                {openSections.sizes ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size.id}
                    variant={filters.sizes.includes(size.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSize(size.id)}
                    className={`text-sm ${
                      filters.sizes.includes(size.id) 
                        ? 'bg-secondary hover:bg-secondary/90 text-white' 
                        : 'hover:border-secondary hover:text-secondary'
                    }`}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Color Filter */}
      <Card>
        <Collapsible open={openSections.colors} onOpenChange={() => toggleSection('colors')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Color</CardTitle>
                {openSections.colors ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => toggleColor(color.id)}
                    className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                      color.colorClass
                    } ${
                      filters.colors.includes(color.id) 
                        ? 'border-secondary ring-2 ring-secondary ring-offset-2' 
                        : 'border-gray-300 hover:border-secondary'
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Stock Filter */}
      <Card>
        <Collapsible open={openSections.stock} onOpenChange={() => toggleSection('stock')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Availability</CardTitle>
                {openSections.stock ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStockOnly"
                  checked={filters.inStockOnly}
                  onCheckedChange={(checked) => updateFilter('inStockOnly', checked)}
                />
                <Label
                  htmlFor="inStockOnly"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  In Stock Only
                </Label>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}
