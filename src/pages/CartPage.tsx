
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SellerGroup {
  sellerId: string;
  sellerName: string;
  location: { country: string; state: string };
  items: Array<{ productId: string; quantity: number; name: string; price: number; image: string; stock: number }>;
  subtotal: number;
}

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, calculateSubtotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [groupedItems, setGroupedItems] = useState<SellerGroup[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  
  useEffect(() => {
    // Group items by seller
    const grouped: Record<string, SellerGroup> = {};
    
    items.forEach(item => {
      const { product, quantity } = item;
      const sellerId = product.seller.id;
      
      if (!grouped[sellerId]) {
        grouped[sellerId] = {
          sellerId,
          sellerName: product.seller.name,
          location: product.seller.location,
          items: [],
          subtotal: 0
        };
      }
      
      grouped[sellerId].items.push({
        productId: product.id,
        quantity,
        name: product.name,
        price: product.price,
        image: product.images[0],
        stock: product.stock
      });
      
      grouped[sellerId].subtotal += product.price * quantity;
    });
    
    setGroupedItems(Object.values(grouped));
    setTotalItems(items.reduce((total, item) => total + item.quantity, 0));
  }, [items]);
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast.success('Item removido do carrinho');
  };
  
  const handleUpdateQuantity = (productId: string, newQuantity: number, stock: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > stock) {
      toast.error(`Apenas ${stock} unidades disponíveis`);
      return;
    }
    
    updateQuantity(productId, newQuantity);
  };
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Faça login para continuar com a compra');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    navigate('/checkout');
  };
  
  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
            <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-600 mb-8">
              Parece que você ainda não adicionou nenhum item ao seu carrinho.
            </p>
            <Link
              to="/products"
              className="bg-market-yellow hover:bg-yellow-500 text-white font-medium px-6 py-3 rounded-lg transition-colors inline-block"
            >
              Explorar Produtos
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Carrinho de Compras</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            {groupedItems.map(group => (
              <div key={group.sellerId} className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h3 className="font-medium">
                    Vendido por <span className="font-semibold">{group.sellerName}</span>
                  </h3>
                  <div className="text-sm text-gray-500">
                    Localização: {group.location.state}, {group.location.country}
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {group.items.map(item => (
                    <div key={item.productId} className="p-6 flex flex-col sm:flex-row">
                      <div className="sm:w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      
                      <div className="sm:ml-6 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h4 className="font-medium mb-1">{item.name}</h4>
                            <div className="text-lg font-semibold mb-3">
                              R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          
                          <div className="mt-2 sm:mt-0">
                            <div className="flex items-center mb-3">
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, item.stock)}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l hover:bg-gray-50"
                              >
                                <Minus size={16} />
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1, item.stock)}
                                min="1"
                                max={item.stock}
                                className="w-12 h-8 border-y border-gray-300 text-center"
                              />
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, item.stock)}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r hover:bg-gray-50"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              className="text-red-500 hover:text-red-700 text-sm flex items-center"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Remover
                            </button>
                          </div>
                        </div>
                        
                        {item.quantity >= item.stock && (
                          <div className="mt-2 flex items-center text-amber-600 text-sm">
                            <AlertCircle size={14} className="mr-1" />
                            Quantidade máxima disponível
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 px-6 py-4 text-right">
                  <div className="text-gray-600">
                    Subtotal ({group.items.reduce((sum, item) => sum + item.quantity, 0)} itens):
                    <span className="font-semibold ml-2">
                      R$ {group.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Resumo do Pedido</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} itens)</span>
                  <span>R$ {calculateSubtotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span>Calculado no checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>R$ {calculateSubtotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    * Sem frete incluído
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-market-yellow hover:bg-yellow-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <span>Continuar para o Checkout</span>
                <ArrowRight size={18} className="ml-2" />
              </button>
              
              <div className="mt-6">
                <Link
                  to="/products"
                  className="text-market-blue hover:text-blue-700 text-sm flex items-center justify-center"
                >
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
