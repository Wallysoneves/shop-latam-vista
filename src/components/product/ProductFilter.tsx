
import React, { useState, useEffect } from 'react';
import { useProducts, ProductFilters } from '../../contexts/ProductContext';
import { Slider } from 'lucide-react';

interface ProductFilterProps {
  currentFilters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ currentFilters, onFilterChange }) => {
  const { categories, locations } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<ProductFilters>(currentFilters);

  // Update local filters when currentFilters prop changes
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleCategoryChange = (category: string) => {
    setLocalFilters(prev => ({
      ...prev,
      category: prev.category === category ? undefined : category
    }));
  };

  const handleLocationChange = (country?: string, state?: string) => {
    setLocalFilters(prev => ({
      ...prev,
      location: { 
        country, 
        state 
      }
    }));
  };

  const handlePriceChange = (min?: number, max?: number) => {
    setLocalFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
  };

  const handleSortChange = (sortBy: 'newest' | 'bestSelling' | 'priceAsc' | 'priceDesc') => {
    setLocalFilters(prev => ({
      ...prev,
      sortBy
    }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const resetFilters = () => {
    const resetFilters: ProductFilters = {
      search: currentFilters.search // Keep search term
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      {/* Mobile filter toggle */}
      <div className="md:hidden p-4 border-b">
        <button
          onClick={toggleFilters}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium">Filtros</span>
          <Slider size={20} />
        </button>
      </div>

      {/* Filter content - always visible on desktop, toggleable on mobile */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block p-4`}>
        <h3 className="font-semibold text-lg mb-3 hidden md:block">Filtros</h3>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Categorias</h4>
          <div className="space-y-1">
            {categories.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.category === category}
                  onChange={() => handleCategoryChange(category)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-market-yellow focus:ring-market-yellow"
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Faixa de Preço</h4>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <span className="mr-2">R$</span>
              <input
                type="number"
                placeholder="Min"
                value={localFilters.minPrice || ''}
                onChange={(e) => handlePriceChange(
                  e.target.value ? Number(e.target.value) : undefined,
                  localFilters.maxPrice
                )}
                className="px-2 py-1 border rounded w-full"
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2">R$</span>
              <input
                type="number"
                placeholder="Max"
                value={localFilters.maxPrice || ''}
                onChange={(e) => handlePriceChange(
                  localFilters.minPrice,
                  e.target.value ? Number(e.target.value) : undefined
                )}
                className="px-2 py-1 border rounded w-full"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Localização do Vendedor</h4>
          <select
            value={localFilters.location?.country || ''}
            onChange={(e) => handleLocationChange(e.target.value || undefined, undefined)}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm mb-2"
          >
            <option value="">Todos os Países</option>
            {[...new Set(locations.map(loc => loc.country))].map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          {localFilters.location?.country && (
            <select
              value={localFilters.location?.state || ''}
              onChange={(e) => handleLocationChange(localFilters.location?.country, e.target.value || undefined)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Todos os Estados</option>
              {locations
                .filter(loc => loc.country === localFilters.location?.country)
                .map(loc => (
                  <option key={loc.state} value={loc.state}>{loc.state}</option>
                ))
              }
            </select>
          )}
        </div>

        {/* Sort By */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Ordenar Por</h4>
          <select
            value={localFilters.sortBy || ''}
            onChange={(e) => handleSortChange(e.target.value as any)}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Mais Relevantes</option>
            <option value="newest">Mais Recentes</option>
            <option value="bestSelling">Mais Vendidos</option>
            <option value="priceAsc">Menor Preço</option>
            <option value="priceDesc">Maior Preço</option>
          </select>
        </div>

        {/* Apply/Reset Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={applyFilters}
            className="bg-market-yellow hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded transition-colors flex-1"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={resetFilters}
            className="border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-50 transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
