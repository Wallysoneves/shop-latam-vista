import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useAuth } from '../../contexts/AuthContext';
import SellerLayout from './SellerLayout';
import { Package, Plus, Edit, Trash, AlertTriangle, Search, Filter, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Product } from '../../types/Product';
import { toast } from 'sonner';

const SellerProducts = () => {
  const { products, getProductsBySeller, updateProduct, deleteProduct } = useProducts();
  const { user } = useAuth();
  
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'inStock', 'outOfStock'
  
  // Categories
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    if (user) {
      const userProducts = getProductsBySeller(user.id);
      setSellerProducts(userProducts);
      setFilteredProducts(userProducts);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(userProducts.map(product => product.category))];
      setCategories(uniqueCategories);
      
      setLoading(false);
    }
  }, [user, products, getProductsBySeller]);
  
  useEffect(() => {
    // Apply filters
    let filtered = [...sellerProducts];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Stock filter
    if (stockFilter === 'inStock') {
      filtered = filtered.filter(product => product.stock > 0);
    } else if (stockFilter === 'outOfStock') {
      filtered = filtered.filter(product => product.stock === 0);
    }
    
    setFilteredProducts(filtered);
  }, [sellerProducts, searchTerm, categoryFilter, stockFilter]);
  
  const handleToggleActive = (product: Product) => {
    const newStatus = !product.isActive;
    updateProduct(product.id, { isActive: newStatus });
    
    toast.success(
      newStatus 
        ? `Produto "${product.name}" ativado com sucesso` 
        : `Produto "${product.name}" desativado com sucesso`
    );
  };
  
  const handleStockUpdate = (product: Product, newStock: number) => {
    if (newStock < 0) return;
    
    updateProduct(product.id, { stock: newStock });
    toast.success(`Estoque do produto "${product.name}" atualizado para ${newStock}`);
  };
  
  const handleDeleteProduct = (product: Product) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      deleteProduct(product.id);
      toast.success(`Produto "${product.name}" excluído com sucesso`);
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStockFilter('all');
  };
  
  return (
    <SellerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meus Produtos</h1>
          <Link
            to="/seller/products/create"
            className="bg-market-blue text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Cadastrar Produto
          </Link>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="pl-10 p-2 border border-gray-300 rounded-md w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="w-full md:w-64">
              <select
                className="p-2 border border-gray-300 rounded-md w-full"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Stock Filter */}
            <div className="w-full md:w-64">
              <select
                className="p-2 border border-gray-300 rounded-md w-full"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="all">Todos os produtos</option>
                <option value="inStock">Em estoque</option>
                <option value="outOfStock">Fora de estoque</option>
              </select>
            </div>
            
            {/* Reset Filters */}
            <button
              onClick={resetFilters}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
              title="Limpar filtros"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        
        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p>Carregando produtos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-500">Nenhum produto encontrado</h3>
              {searchTerm || categoryFilter || stockFilter !== 'all' ? (
                <p className="mt-2 text-gray-500">
                  Tente ajustar seus filtros ou{' '}
                  <button 
                    onClick={resetFilters}
                    className="text-market-blue hover:underline"
                  >
                    limpar todos os filtros
                  </button>
                </p>
              ) : (
                <p className="mt-2 text-gray-500">
                  <Link to="/seller/products/create" className="text-market-blue hover:underline">
                    Adicione seu primeiro produto
                  </Link>
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estoque
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={product.images[0]} 
                              alt={product.name} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description.length > 60 
                                ? `${product.description.substring(0, 60)}...` 
                                : product.description
                              }
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          R$ {product.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleStockUpdate(product, product.stock - 1)}
                            className="border rounded-l p-1 hover:bg-gray-100"
                            disabled={product.stock === 0}
                          >
                            -
                          </button>
                          <span className={`px-3 py-1 ${product.stock === 0 ? 'text-red-600' : product.stock <= 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {product.stock}
                          </span>
                          <button 
                            onClick={() => handleStockUpdate(product, product.stock + 1)}
                            className="border rounded-r p-1 hover:bg-gray-100"
                          >
                            +
                          </button>
                          {product.stock <= 5 && (
                            <span title={product.stock === 0 ? 'Fora de estoque' : 'Estoque baixo'}>
                              <AlertTriangle 
                                size={16} 
                                className={`ml-2 ${product.stock === 0 ? 'text-red-600' : 'text-yellow-600'}`} 
                              />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`inline-flex items-center px-2.5 py-1.5 rounded text-xs font-medium ${
                            product.isActive !== false
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.isActive !== false ? (
                            <>
                              <Eye size={14} className="mr-1" />
                              Ativo
                            </>
                          ) : (
                            <>
                              <EyeOff size={14} className="mr-1" />
                              Inativo
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/seller/products/edit/${product.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerProducts; 