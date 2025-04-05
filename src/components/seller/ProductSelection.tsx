import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Product } from '../../services/productService';
import { productService } from '../../services/productService';

export interface OrderItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

interface ProductSelectionProps {
  items: OrderItem[];
  onItemsChange: (items: OrderItem[]) => void;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({ items, onItemsChange }) => {
  const { user } = useAuth();
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  useEffect(() => {
    if (user) {
      const prods = productService.getBySellerId(user.id).filter(p => p.stock > 0);
      setSellerProducts(prods);
      setFilteredProducts(prods);
    }
  }, [user]);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(sellerProducts);
    } else {
      const filtered = productService.searchProducts(searchTerm, user?.id);
      setFilteredProducts(filtered.filter(p => p.stock > 0));
    }
  }, [searchTerm, sellerProducts, user]);
  
  const handleAddProduct = (product: Product) => {
    // Verificar se o produto já está no carrinho
    const existingItemIndex = items.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Se já estiver, incrementar quantidade se houver estoque
      const updatedItems = [...items];
      if (updatedItems[existingItemIndex].quantity < product.stock) {
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
          subtotal: (updatedItems[existingItemIndex].quantity + 1) * product.price
        };
        onItemsChange(updatedItems);
      }
    } else {
      // Se não estiver, adicionar novo item
      const newItem: OrderItem = {
        product,
        quantity: 1,
        subtotal: product.price
      };
      onItemsChange([...items, newItem]);
    }
    
    setSearchTerm('');
    setShowDropdown(false);
  };
  
  const handleRemoveProduct = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    onItemsChange(updatedItems);
  };
  
  const handleIncreaseQuantity = (index: number) => {
    const updatedItems = [...items];
    const item = updatedItems[index];
    
    if (item.quantity < item.product.stock) {
      item.quantity += 1;
      item.subtotal = item.quantity * item.product.price;
      onItemsChange(updatedItems);
    }
  };
  
  const handleDecreaseQuantity = (index: number) => {
    const updatedItems = [...items];
    const item = updatedItems[index];
    
    if (item.quantity > 1) {
      item.quantity -= 1;
      item.subtotal = item.quantity * item.product.price;
      onItemsChange(updatedItems);
    } else {
      handleRemoveProduct(index);
    }
  };
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Produtos</h3>
        
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Buscar produtos por nome, descrição ou categoria..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-market-blue focus:border-market-blue"
          />
          <div className="absolute left-3 top-3 text-gray-400">
            <Search size={20} />
          </div>
          
          {searchTerm && showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-72 overflow-y-auto">
              {filteredProducts.length > 0 ? (
                <ul>
                  {filteredProducts.map((product) => {
                    const isInCart = items.some(item => item.product.id === product.id);
                    const cartItem = items.find(item => item.product.id === product.id);
                    const remainingStock = product.stock - (cartItem?.quantity || 0);
                    
                    return (
                      <li 
                        key={product.id}
                        className={`px-4 py-3 hover:bg-gray-100 border-b border-gray-100 ${
                          remainingStock <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        onClick={() => remainingStock > 0 && handleAddProduct(product)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={product.images[0]} 
                                alt={product.name} 
                              />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">
                                {product.category} | {remainingStock} em estoque
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-medium text-market-blue">
                              R$ {product.price.toFixed(2)}
                            </span>
                            {isInCart && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {cartItem?.quantity} no carrinho
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Nenhum produto encontrado
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Lista de itens selecionados */}
      {items.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Unitário
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={item.product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-md object-cover" 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                        />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">{item.product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleDecreaseQuantity(index)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(index)}
                        className={`p-1 rounded-full ${
                          item.quantity >= item.product.stock 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'hover:bg-gray-100'
                        }`}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    R$ {item.product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    R$ {item.subtotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhum produto selecionado</p>
          <p className="text-sm text-gray-400 mt-1">Use a barra de busca acima para adicionar produtos ao pedido</p>
        </div>
      )}
    </div>
  );
};

export default ProductSelection; 