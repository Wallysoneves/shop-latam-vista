
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilter from '../components/product/ProductFilter';
import { useProducts, ProductFilters } from '../contexts/ProductContext';
import { Product } from '../types/Product';

const ProductsPage = () => {
  const { filterProducts } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>({});
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Extract filters from URL search params on component mount
  useEffect(() => {
    const initialFilters: ProductFilters = {};
    
    // Search term
    const search = searchParams.get('search');
    if (search) initialFilters.search = search;
    
    // Category
    const category = searchParams.get('category');
    if (category) initialFilters.category = category;
    
    // Price range
    const minPrice = searchParams.get('minPrice');
    if (minPrice) initialFilters.minPrice = Number(minPrice);
    
    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) initialFilters.maxPrice = Number(maxPrice);
    
    // Location
    const country = searchParams.get('country');
    const state = searchParams.get('state');
    if (country || state) {
      initialFilters.location = {};
      if (country) initialFilters.location.country = country;
      if (state) initialFilters.location.state = state;
    }
    
    // Sort by
    const sortBy = searchParams.get('sortBy') as 'newest' | 'bestSelling' | 'priceAsc' | 'priceDesc' | null;
    if (sortBy) initialFilters.sortBy = sortBy;
    
    setFilters(initialFilters);
  }, [searchParams]);

  // Apply filters and update product list
  useEffect(() => {
    setLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      const filtered = filterProducts(filters);
      setFilteredProducts(filtered);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filters, filterProducts]);

  // Update URL when filters change
  const handleFilterChange = (newFilters: ProductFilters) => {
    const newSearchParams = new URLSearchParams();
    
    if (newFilters.search) newSearchParams.set('search', newFilters.search);
    if (newFilters.category) newSearchParams.set('category', newFilters.category);
    if (newFilters.minPrice !== undefined) newSearchParams.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice !== undefined) newSearchParams.set('maxPrice', newFilters.maxPrice.toString());
    
    if (newFilters.location) {
      if (newFilters.location.country) newSearchParams.set('country', newFilters.location.country);
      if (newFilters.location.state) newSearchParams.set('state', newFilters.location.state);
    }
    
    if (newFilters.sortBy) newSearchParams.set('sortBy', newFilters.sortBy);
    
    setSearchParams(newSearchParams);
    setFilters(newFilters);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with filters */}
          <div className="md:w-1/4">
            <ProductFilter 
              currentFilters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </div>
          
          {/* Main content */}
          <div className="md:w-3/4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {filters.category ? filters.category : 'Todos os Produtos'}
              </h1>
              <p className="text-gray-600">
                {loading ? 'Carregando produtos...' : `${filteredProducts.length} produtos encontrados`}
              </p>
            </div>
            
            <ProductGrid products={filteredProducts} loading={loading} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
