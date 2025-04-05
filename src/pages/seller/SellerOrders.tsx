import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrders, OrderStatus } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import SellerLayout from './SellerLayout';
import { 
  ShoppingBag, 
  Search, 
  RefreshCw, 
  Calendar, 
  ChevronRight, 
  Clock, 
  XCircle,
  Check,
  Truck,
  PackageCheck
} from 'lucide-react';
import { Order } from '../../contexts/OrderContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Componente de chip para status
const StatusChip = ({ status }: { status: OrderStatus }) => {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock size={12} className="mr-1" />
          Pendente
        </span>
      );
    case 'processing':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <ShoppingBag size={12} className="mr-1" />
          Em processamento
        </span>
      );
    case 'shipped':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          <Truck size={12} className="mr-1" />
          Enviado
        </span>
      );
    case 'delivered':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check size={12} className="mr-1" />
          Entregue
        </span>
      );
    case 'canceled':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle size={12} className="mr-1" />
          Cancelado
        </span>
      );
    default:
      return null;
  }
};

const SellerOrders = () => {
  const { orders, getOrdersBySeller } = useOrders();
  const { user } = useAuth();
  
  const [sellerOrders, setSellerOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');
  
  useEffect(() => {
    if (user) {
      // Simula um atraso de carregamento para demonstração
      setTimeout(() => {
        const sellerOrdersList = getOrdersBySeller(user.id);
        setSellerOrders(sellerOrdersList);
        setFilteredOrders(sellerOrdersList);
        setLoading(false);
      }, 500);
    }
  }, [user, orders, getOrdersBySeller]);
  
  useEffect(() => {
    // Aplicar filtros
    let filtered = [...sellerOrders];
    
    // Filtro de pesquisa
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Filtro por data
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getFullYear() === filterDate.getFullYear() &&
          orderDate.getMonth() === filterDate.getMonth() &&
          orderDate.getDate() === filterDate.getDate()
        );
      });
    }
    
    setFilteredOrders(filtered);
  }, [sellerOrders, searchTerm, statusFilter, dateFilter]);
  
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };
  
  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: ptBR });
  };
  
  const calculateTotal = (order: Order) => {
    return order.total.toFixed(2);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('');
  };
  
  return (
    <SellerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Pedidos</h1>
          <Link
            to="/seller/orders/create"
            className="bg-market-blue hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <ShoppingBag size={16} className="mr-2" />
            Novo Pedido
          </Link>
        </div>
        
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar pedidos por ID ou cliente..."
                  className="pl-10 p-2 border border-gray-300 rounded-md w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Filtro por Status */}
            <div className="w-full md:w-48">
              <select
                className="p-2 border border-gray-300 rounded-md w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="processing">Em processamento</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregue</option>
                <option value="canceled">Cancelado</option>
              </select>
            </div>
            
            {/* Filtro por Data */}
            <div className="w-full md:w-48">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  className="pl-10 p-2 border border-gray-300 rounded-md w-full"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
            
            {/* Limpar Filtros */}
            <button
              onClick={resetFilters}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
              title="Limpar filtros"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        
        {/* Lista de Pedidos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p>Carregando pedidos...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-500">Nenhum pedido encontrado</h3>
              {searchTerm || statusFilter !== 'all' || dateFilter ? (
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
                  Quando você receber pedidos, eles aparecerão aqui.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detalhes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                            <PackageCheck size={20} className="text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              #{order.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.shippingInfo.fullName}</div>
                        <div className="text-sm text-gray-500">{order.shippingInfo.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                        <div className="text-sm text-gray-500">{formatTime(order.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          R$ {calculateTotal(order)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Frete: R$ {order.shipping.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <StatusChip status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/seller/orders/${order.id}`}
                          className="text-market-blue hover:text-blue-800"
                        >
                          <div className="flex items-center justify-end space-x-1">
                            <span>Detalhes</span>
                            <ChevronRight size={16} />
                          </div>
                        </Link>
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

export default SellerOrders; 