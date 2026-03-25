"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { Download, Pencil, X } from "lucide-react";

interface ProductDetailProps {
  product: Product | null;
  onUpdateProduct: (product: Product) => void;
}

interface MetadataFieldProps {
  label: string;
  value: string | number;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: "text" | "number";
}

function MetadataField({
  label,
  value,
  isEditing,
  onChange,
  type = "text",
}: MetadataFieldProps) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-text-secondary mb-1">
        {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-border rounded-button bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      ) : (
        <p className="text-sm text-text-primary">{value}</p>
      )}
    </div>
  );
}

export function ProductDetail({ product, onUpdateProduct }: ProductDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);

  if (!product) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <p className="text-text-secondary">Select a product to view details</p>
      </div>
    );
  }

  const handleEdit = () => {
    setEditedProduct({ ...product });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProduct(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (editedProduct) {
      onUpdateProduct(editedProduct);
      // TODO: Implement API call to save product changes
    }
    setIsEditing(false);
    setEditedProduct(null);
  };

  const handleExportCSV = () => {
    // TODO: Implement CSV export functionality
    console.log("Export CSV clicked");
  };

  const currentProduct = isEditing && editedProduct ? editedProduct : product;

  const updateField = (field: keyof Product, value: string | number) => {
    if (editedProduct) {
      setEditedProduct({ ...editedProduct, [field]: value });
    }
  };

  return (
    <div className="flex-1 bg-background p-6 overflow-y-auto">
      <div className="bg-card rounded-card shadow-sm p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-semibold text-text-primary">
            {currentProduct.name}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded-button hover:bg-[#F3F4F6] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-button hover:bg-light-accent transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
          <MetadataField
            label="Vendor"
            value={currentProduct.vendor}
            isEditing={isEditing}
            onChange={(v) => updateField("vendor", v)}
          />
          <MetadataField
            label="Type"
            value={currentProduct.type}
            isEditing={isEditing}
            onChange={(v) => updateField("type", v)}
          />
          <MetadataField
            label="Product Type"
            value={currentProduct.productType}
            isEditing={isEditing}
            onChange={(v) => updateField("productType", v)}
          />
          <MetadataField
            label="Amount of Pills"
            value={currentProduct.amountOfPills}
            isEditing={isEditing}
            onChange={(v) => updateField("amountOfPills", parseInt(v) || 0)}
            type="number"
          />
          <MetadataField
            label="Days of Usage"
            value={currentProduct.daysOfUsage}
            isEditing={isEditing}
            onChange={(v) => updateField("daysOfUsage", parseInt(v) || 0)}
            type="number"
          />
          <MetadataField
            label="Delivery Frequency"
            value={currentProduct.deliveryFrequency}
            isEditing={isEditing}
            onChange={(v) => updateField("deliveryFrequency", v)}
          />
        </div>

        {/* Description Section */}
        <div className="border-t border-border pt-6">
          <h3 className="text-xs uppercase tracking-wider text-text-secondary mb-3">
            Product Description
          </h3>
          {isEditing ? (
            <textarea
              value={currentProduct.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-border rounded-button bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          ) : (
            <p className="text-sm text-text-primary leading-relaxed">
              {currentProduct.description || (
                <span className="italic text-text-secondary">
                  [Description will be extracted from JSON]
                </span>
              )}
            </p>
          )}
        </div>

        {/* Edit Mode Actions */}
        {isEditing && (
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-button hover:bg-primary-hover transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
