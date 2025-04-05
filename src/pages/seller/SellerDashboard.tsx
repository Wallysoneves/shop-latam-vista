import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ShoppingBag, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Users, 
  ChevronRight 
} from 'lucide-react';

import SellerLayout from './SellerLayout';
import { sellerService } from '../../services/sellerService';

const SellerDashboard = () => {
  const { user } = useAuth();
  
  const [sellerProducts, setSellerProducts] = useState<any[]>([]);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productStats, setProductStats] = useState<{
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  }>({
    total: 0,
    active: 0,
    lowStock: 0,
    outOfStock: 0
  });
  
  const [salesStats, setSalesStats] = useState<{
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    canceled: number;
    total: number;
  }>({
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    canceled: 0,
    total: 0
  });
  
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      try {
        // Get seller products using sellerService
        const sellerProds = sellerService.getSellerProducts(user.id);
        setSellerProducts(sellerProds);
        
        // Get seller orders using sellerService
        const sellerOrds = sellerService.getSellerOrders(user.id);
        setSellerOrders(sellerOrds);
        
        // Calculate product stats
        setProductStats({
          total: sellerProds.length,
          active: sellerProds.filter(p => p.isActive !== false).length,
          lowStock: sellerProds.filter(p => p.stock > 0 && p.stock <= 5).length,
          outOfStock: sellerProds.filter(p => p.stock === 0).length
        });
        
        // Get order stats from service
        const orderCounts = sellerService.getSellerOrdersByStatus(user.id);
        const totalSales = sellerService.getSellerTotalSales(user.id);
        
        setSalesStats({
          pending: orderCounts.pending,
          processing: orderCounts.processing,
          shipped: orderCounts.shipped,
          delivered: orderCounts.delivered,
          canceled: orderCounts.canceled,
          total: sellerProds.reduce((sum, p) => sum + (p.sales || 0), 0)
        });
        
        // Prepare chart data
        // Monthly sales data (mock data)
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const mockSalesData = monthNames.map(month => ({
          name: month,
          vendas: Math.floor(Math.random() * 100)
        }));
        setSalesData(mockSalesData);
        
        // Category data
        const categories = sellerProds.reduce((acc: Record<string, number>, product) => {
          const { category } = product;
          acc[category] = (acc[category] || 0) + (product.sales || 0);
          return acc;
        }, {});
        
        const categoryChartData = Object.entries(categories).map(([name, value]) => ({
          name,
          value
        }));
        
        setCategoryData(categoryChartData);
      } catch (error) {
        console.error('Erro ao carregar dados do painel:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);
  
  const COLORS = ['#FFC844', '#5AA5E0', '#4CAF50', '#FF9800', '#9C27B0', '#E91E63'];
  
  return (
    <SellerLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard do Vendedor</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Products Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-market-blue mr-4">
                <Package size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total de Produtos</p>
                <h3 className="text-2xl font-bold">{productStats.total}</h3>
              </div>
            </div>
            <div className="mt-4 text-sm">
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Ativos: {productStats.active}</span>
                <span>Estoque baixo: {productStats.lowStock}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-market-blue h-2 rounded-full" 
                  style={{ width: `${(productStats.active / Math.max(productStats.total, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Sales Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total de Vendas</p>
                <h3 className="text-2xl font-bold">{salesStats.total}</h3>
              </div>
            </div>
            <div className="mt-4 text-sm">
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Pedidos: {sellerOrders.length}</span>
                <span>Entregues: {salesStats.delivered}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(salesStats.delivered / Math.max(sellerOrders.length, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Orders Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pedidos Pendentes</p>
                <h3 className="text-2xl font-bold">{salesStats.pending + salesStats.processing}</h3>
              </div>
            </div>
            <div className="mt-4 text-sm">
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Pendentes: {salesStats.pending}</span>
                <span>Em processamento: {salesStats.processing}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${((salesStats.pending + salesStats.processing) / Math.max(sellerOrders.length, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Reputation Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <Star size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Reputação</p>
                <h3 className="text-2xl font-bold">{user?.reputation || '4.8'}</h3>
              </div>
            </div>
            <div className="mt-4 text-sm">
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Clientes satisfeitos: 95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: '95%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6">Vendas Mensais</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="vendas" fill="#5AA5E0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Category Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-6">Vendas por Categoria</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Pedidos Recentes</h3>
            <Link 
              to="/seller/orders" 
              className="text-market-blue hover:text-blue-700 flex items-center text-sm"
            >
              <span>Ver Todos</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          
          {sellerOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID do Pedido
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sellerOrders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link 
                          to={`/seller/orders/${order.id}`}
                          className="text-market-blue hover:underline"
                        >
                          #{order.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.shippingInfo.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'pending' ? 'Pendente' :
                           order.status === 'processing' ? 'Processando' :
                           order.status === 'shipped' ? 'Enviado' :
                           order.status === 'delivered' ? 'Entregue' :
                           'Cancelado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Nenhum pedido recebido ainda</p>
            </div>
          )}
        </div>
        
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Produtos Mais Vendidos</h3>
            <Link 
              to="/seller/products" 
              className="text-market-blue hover:text-blue-700 flex items-center text-sm"
            >
              <span>Ver Todos</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          
          {sellerProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellerProducts
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 3)
                .map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="h-48 relative">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-market-yellow text-white text-xs font-bold px-2 py-1 rounded">
                        {product.sales} vendidos
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-1 line-clamp-1">{product.name}</h4>
                      <p className="text-gray-500 text-sm mb-2">Categoria: {product.category}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">
                          R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className={`text-xs ${
                          product.stock > 10 ? 'text-green-600' :
                          product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {product.stock > 10 ? 'Em estoque' :
                           product.stock > 0 ? `Apenas ${product.stock} restantes` : 'Esgotado'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Nenhum produto cadastrado ainda</p>
              <Link 
                to="/seller/products/add" 
                className="inline-block mt-4 bg-market-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Adicionar Produto
              </Link>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerDashboard;
