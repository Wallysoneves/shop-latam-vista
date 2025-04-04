
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.images[currentImageIndex]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {product.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={16} />
            </button>
            
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {product.images.map((_, index) => (
                <div 
                  key={index} 
                  className={`w-1.5 h-1.5 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                />
              ))}
            </div>
          </>
        )}
        
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Últimas unidades
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-lg font-bold">
            Esgotado
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2 mb-1">
          {product.name}
        </h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin size={14} className="mr-1" />
          <span>{product.seller.location.state}, {product.seller.location.country}</span>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">{product.seller.reputation.toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-500">
            Vendido por <span className="font-medium">{product.seller.name}</span>
          </span>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xl font-bold text-gray-800">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-market-yellow hover:bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors">
            Ver detalhes
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
