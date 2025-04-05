import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrders, OrderStatus } from '../../contexts/OrderContext';
import { useProducts } from '../../contexts/ProductContext';
import SellerLayout from './SellerLayout';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Clock, 
  ShoppingBag, 
  Check, 
  Truck, 
  XCircle
} from 'lucide-react';
import { Order } from '../../contexts/OrderContext';
import { Product } from '../../types/Product';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SellerOrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders();
  const { getProductById } = useProducts();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('pending');
  
  useEffect(() => {
    if (orderId) {
      // Simula um pequeno delay para demonstração
      setTimeout(() => {
        const foundOrder = orders.find(o => o.id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
          setCurrentStatus(foundOrder.status);
        } else {
          toast.error('Pedido não encontrado');
          navigate('/seller/orders');
        }
        setLoading(false);
      }, 300);
    }
  }, [orderId, orders, navigate]);
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    setCurrentStatus(newStatus);
  };
  
  const updateStatus = () => {
    if (!order) return;
    
    if (order.status === currentStatus) {
      toast.info('O status do pedido permanece o mesmo');
      return;
    }
    
    updateOrderStatus(order.id, currentStatus);
    
    // Atualiza o pedido local
    setOrder({
      ...order,
      status: currentStatus,
      updatedAt: new Date()
    });
    
    toast.success(`Status do pedido atualizado para ${getStatusLabel(currentStatus)}`);
  };
  
  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'processing': return 'Em processamento';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'canceled': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };
  
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock size={18} className="text-yellow-500" />;
      case 'processing':
        return <ShoppingBag size={18} className="text-blue-500" />;
      case 'shipped':
        return <Truck size={18} className="text-indigo-500" />;
      case 'delivered':
        return <Check size={18} className="text-green-500" />;
      case 'canceled':
        return <XCircle size={18} className="text-red-500" />;
      default:
        return null;
    }
  };
  
  const formatCurrency = (value: number): string => {
    return value.toFixed(2);
  };
  
  const formatDate = (date: Date): string => {
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };
  
  const getProductDetails = (productId: string): Product | undefined => {
    return getProductById(productId);
  };
  
  if (loading) {
    return (
      <SellerLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Carregando detalhes do pedido...</p>
        </div>
      </SellerLayout>
    );
  }
  
  if (!order) {
    return (
      <SellerLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-xl font-semibold">Pedido não encontrado</h2>
          <button
            onClick={() => navigate('/seller/orders')}
            className="mt-4 px-4 py-2 bg-market-blue text-white rounded-md"
          >
            Voltar para Pedidos
          </button>
        </div>
      </SellerLayout>
    );
  }
  
  return (
    <SellerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/seller/orders')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Detalhes do Pedido #{order.id}</h1>
            <p className="text-gray-500">
              Realizado em {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        
        {/* Status do Pedido e Ações */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="p-2 rounded-full bg-gray-100 mr-4">
                {getStatusIcon(order.status)}
              </div>
              <div>
                <p className="text-sm text-gray-500">Status atual</p>
                <p className="text-lg font-semibold">{getStatusLabel(order.status)}</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <div>
                <select
                  value={currentStatus}
                  onChange={handleStatusChange}
                  className="p-2 border border-gray-300 rounded-md w-full md:w-auto"
                >
                  <option value="pending">Pendente</option>
                  <option value="processing">Em processamento</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregue</option>
                  <option value="canceled">Cancelado</option>
                </select>
              </div>
              <button
                onClick={updateStatus}
                className="px-4 py-2 bg-market-blue text-white rounded-md"
              >
                Atualizar Status
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Itens do Pedido */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Itens do Pedido</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {order.items.map((item, index) => {
                  const product = getProductDetails(item.product.id);
                  return (
                    <div key={index} className="p-6 flex flex-col sm:flex-row">
                      <div className="sm:w-20 sm:h-20 flex-shrink-0 mb-4 sm:mb-0">
                        <img 
                          src={product?.images[0] || item.product.images[0] || 'https://via.placeholder.com/80'} 
                          alt={product?.name || item.product.name || 'Produto'} 
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </div>
                      <div className="sm:ml-6 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-base font-medium">{product?.name || item.product.name || 'Produto indisponível'}</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Quantidade: {item.quantity}
                            </p>
                          </div>
                          <p className="text-base font-medium">
                            R$ {formatCurrency(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R$ {formatCurrency(order.total - order.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Frete</span>
                  <span>R$ {formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base mt-4 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>R$ {formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Informações do Cliente e Entrega */}
          <div className="space-y-6">
            {/* Informações do Cliente */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center">
                  <User size={18} className="mr-2" />
                  Dados do Cliente
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">{order.shippingInfo.fullName}</span>
                </p>
                <p className="flex items-center text-gray-600 text-sm mb-2">
                  <Mail size={14} className="mr-2" />
                  {order.shippingInfo.email}
                </p>
                <p className="flex items-center text-gray-600 text-sm">
                  <Phone size={14} className="mr-2" />
                  {order.shippingInfo.phone}
                </p>
              </div>
            </div>
            
            {/* Endereço de Entrega */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center">
                  <MapPin size={18} className="mr-2" />
                  Endereço de Entrega
                </h2>
              </div>
              <div className="p-6">
                <address className="not-italic">
                  <p className="text-gray-700 mb-1">{order.shippingInfo.address}</p>
                  <p className="text-gray-600 mb-1">
                    {order.shippingInfo.city}, {order.shippingInfo.state}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingInfo.zipCode}, {order.shippingInfo.country}
                  </p>
                </address>
              </div>
            </div>
            
            {/* Método de Pagamento (simulado) */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center">
                  <CreditCard size={18} className="mr-2" />
                  Pagamento
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-1 flex items-center">
                  <CreditCard size={16} className="mr-2" />
                  Cartão de Crédito 
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Pagamento aprovado
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerOrderDetail; 