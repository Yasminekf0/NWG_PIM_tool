"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface ProductListProps {
  products: Product[];
  selectedProductId: string | null;
  onSelectProduct: (product: Product) => void;
}

export function ProductList({
  products,
  selectedProductId,
  onSelectProduct,
}: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[280px] min-w-[280px] h-full bg-card border-r border-border flex flex-col">
      {/* Search Input */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-button bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Product Count */}
      <div className="px-4 py-2">
        <span className="text-xs text-text-secondary">
          {filteredProducts.length} products
        </span>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className={cn(
              "px-4 py-3 cursor-pointer border-l-[3px] transition-colors",
              selectedProductId === product.id
                ? "border-l-primary bg-light-accent"
                : "border-l-transparent hover:bg-[#F3F4F6]"
            )}
          >
            <h3 className="font-semibold text-sm text-text-primary">
              {product.name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-light-accent text-primary">
                {product.type}
              </span>
            </div>
            <p className="mt-1 text-xs text-text-secondary">{product.vendor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
