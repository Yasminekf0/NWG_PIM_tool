export interface Product {
  id: string;
  name: string;
  vendor: string;
  type: string;
  productType: string;
  amountOfPills: number;
  daysOfUsage: number;
  deliveryFrequency: string;
  rawDescription: string;
  description: string;
}

export interface AIContent {
  seoTitle: string;
  metaDescription: string;
  productBullets: string[];
}
