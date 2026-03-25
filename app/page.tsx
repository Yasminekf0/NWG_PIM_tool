"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ProductList } from "@/components/product-list";
import { ProductDetail } from "@/components/product-detail";
import { AIEnrichment } from "@/components/ai-enrichment";
import { mockProducts } from "@/data/products";
import { Product } from "@/types/product";

export default function Home() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    mockProducts[0]
  );

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setSelectedProduct(updatedProduct);
    // TODO: Implement API call to persist changes
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      
      {/* Desktop Layout - Three Panels */}
      <div className="flex-1 flex overflow-hidden max-lg:flex-col max-lg:overflow-y-auto">
        {/* Panel 1: Product List */}
        <div className="max-lg:w-full max-lg:min-h-[300px] max-lg:border-b max-lg:border-border">
          <ProductList
            products={products}
            selectedProductId={selectedProduct?.id || null}
            onSelectProduct={handleSelectProduct}
          />
        </div>

        {/* Panel 2: Product Detail */}
        <div className="flex-1 max-lg:min-h-[400px]">
          <ProductDetail
            product={selectedProduct}
            onUpdateProduct={handleUpdateProduct}
          />
        </div>

        {/* Panel 3: AI Enrichment */}
        <div className="max-lg:w-full max-lg:min-h-[400px]">
          <AIEnrichment product={selectedProduct} />
        </div>
      </div>
    </div>
  );
}
