export interface Seller {
  id: string;
  name: string;
  reputation: number;
  location: {
    country: string;
    state: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  seller: Seller;
  createdAt: string;
  sales: number;
  isActive?: boolean;
  brand?: string;
  sku?: string;
}
