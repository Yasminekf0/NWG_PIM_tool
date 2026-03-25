"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { ProductList } from "@/components/product-list";
import { ProductDetail } from "@/components/product-detail";
import { AIEnrichment } from "@/components/ai-enrichment";
import { loadProducts } from "@/lib/parseProducts";
import { Product } from "@/types/product";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts().then((data) => {
      setProducts(data);
      setSelectedProduct(data[0] || null);
      setLoading(false);
    });
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setSelectedProduct(updatedProduct);
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-secondary text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden max-lg:flex-col max-lg:overflow-y-auto">
        <div className="max-lg:w-full max-lg:min-h-[300px] max-lg:border-b max-lg:border-border">
          <ProductList
            products={products}
            selectedProductId={selectedProduct?.id || null}
            onSelectProduct={handleSelectProduct}
          />
        </div>
        <div className="flex-1 max-lg:min-h-[400px]">
          <ProductDetail
            product={selectedProduct}
            onUpdateProduct={handleUpdateProduct}
            allProducts={products}
            onExport={(updatedProducts) => {
              import("papaparse").then((Papa) => {
                const csv = Papa.unparse(
                  updatedProducts.map((p) => ({
                    "Product name": p.name,
                    Vendor: p.vendor,
                    Type: p.type,
                    "Amount of pills": p.amountOfPills,
                    "Days of usage": p.daysOfUsage,
                    "Product type": p.productType,
                    "Delivery frequency every [number] month": p.deliveryFrequency.replace("Every ", "").replace(" month(s)", ""),
                    "Product description": p.rawDescription,
                  })),
                  { delimiter: ";" }
                );
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "nwg-products-export.csv";
                a.click();
                URL.revokeObjectURL(url);
              });
            }}
          />
        </div>
        <div className="max-lg:w-full max-lg:min-h-[400px]">
          <AIEnrichment product={selectedProduct} />
        </div>
      </div>
    </div>
  );
}
