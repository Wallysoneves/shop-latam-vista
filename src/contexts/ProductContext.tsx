
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '../types/Product';
import productsData from '../data/products.json';

interface ProductContextType {
  products: Product[];
  categories: string[];
  locations: { country: string; state: string }[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  getProductsByCategory: (category: string) => Product[];
  getProductsBySeller: (sellerId: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  filterProducts: (filters: ProductFilters) => Product[];
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: {
    country?: string;
    state?: string;
  };
  sortBy?: 'newest' | 'bestSelling' | 'priceAsc' | 'priceDesc';
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<{ country: string; state: string }[]>([]);

  useEffect(() => {
    // Load initial products data
    setProducts(productsData as Product[]);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(productsData.map((product: Product) => product.category))];
    setCategories(uniqueCategories);
    
    // Extract unique locations
    const uniqueLocations = productsData.reduce((acc: { country: string; state: string }[], product: Product) => {
      const exists = acc.some(loc => 
        loc.country === product.seller.location.country && 
        loc.state === product.seller.location.state
      );
      
      if (!exists) {
        acc.push({ 
          country: product.seller.location.country, 
          state: product.seller.location.state 
        });
      }
      
      return acc;
    }, []);
    
    setLocations(uniqueLocations);
  }, []);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      sales: 0
    };

    setProducts(prevProducts => [...prevProducts, newProduct]);

    // Update categories if needed
    if (!categories.includes(newProduct.category)) {
      setCategories(prev => [...prev, newProduct.category]);
    }

    // Update locations if needed
    const locationExists = locations.some(
      loc => loc.country === newProduct.seller.location.country && 
             loc.state === newProduct.seller.location.state
    );

    if (!locationExists) {
      setLocations(prev => [
        ...prev, 
        { 
          country: newProduct.seller.location.country, 
          state: newProduct.seller.location.state 
        }
      ]);
    }
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, ...updates }
          : product
      )
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prevProducts =>
      prevProducts.filter(product => product.id !== productId)
    );
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const getProductsBySeller = (sellerId: string) => {
    return products.filter(product => product.seller.id === sellerId);
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const filterProducts = (filters: ProductFilters) => {
    return products.filter(product => {
      // Filter by search term
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !product.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Filter by category
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Filter by price range
      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false;
      }

      // Filter by location
      if (filters.location) {
        if (filters.location.country && 
            product.seller.location.country !== filters.location.country) {
          return false;
        }
        if (filters.location.state && 
            product.seller.location.state !== filters.location.state) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sort products based on the sortBy parameter
      if (!filters.sortBy) return 0;

      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'bestSelling':
          return b.sales - a.sales;
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        locations,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsByCategory,
        getProductsBySeller,
        getProductById,
        filterProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
