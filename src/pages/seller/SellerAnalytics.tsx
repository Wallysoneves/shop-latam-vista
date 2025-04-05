import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useOrders } from '../../contexts/OrderContext';
import SellerLayout from './SellerLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { AlertTriangle, ArrowDown, ArrowUp, DollarSign, PackageCheck, ShoppingCart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
// Importando os dados mocados
import { 
  getMockedAnalyticsData, 
  getMockedDailySales, 
  getMockedMonthlySales,
  getMockedPerformanceData
} from '../../data/analyticsData';

// Cores para gráficos
const COLORS = ['#5AA5E0', '#FFC844', '#4CAF50', '#FF9800', '#9C27B0', '#E91E63', '#3F51B5', '#009688'];

const SellerAnalytics = () => {
  const { user } = useAuth();
  const { products, getProductsBySeller } = useProducts();
  const { orders, getOrdersBySeller } = useOrders();
  
  const [sellerProducts, setSellerProducts] = useState<any[]>([]);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dados para os gráficos
  const [salesByDay, setSalesByDay] = useState<any[]>([]);
  const [salesByMonth, setSalesByMonth] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<any[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any>({});
  const [compareData, setCompareData] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [colors, setColors] = useState<any>({});
  
  // Período selecionado
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('month');
  
  useEffect(() => {
    if (user) {
      // Busca produtos e pedidos do vendedor
      const prods = getProductsBySeller(user.id);
      const ords = getOrdersBySeller(user.id);
      
      setSellerProducts(prods);
      setSellerOrders(ords);
      
      // Carrega dados mocados para os gráficos
      loadMockedData();
      
      setLoading(false);
    }
  }, [user, products, orders, getProductsBySeller, getOrdersBySeller]);
  
  useEffect(() => {
    // Atualiza os dados quando o período muda
    loadMockedData();
  }, [timePeriod]);
  
  const loadMockedData = () => {
    // Transforma o tipo de período para o formato esperado pelos dados mocados
    const periodType = timePeriod === 'day' 
      ? 'daily' 
      : timePeriod === 'week' 
        ? 'weekly' 
        : 'monthly';
    
    // Carrega todos os dados mocados de uma vez
    const mockedData = getMockedAnalyticsData(periodType);
    
    // Atualiza os estados com os dados mocados
    setSalesByDay(mockedData.salesByDay);
    setSalesByMonth(mockedData.salesByMonth);
    setTopProducts(mockedData.topProducts.map(p => ({
      ...p,
      name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
      vendas: p.sales
    })));
    setSalesByCategory(mockedData.categorySales);
    setOrdersByStatus(mockedData.ordersByStatus);
    setLowStockProducts(mockedData.lowStockProducts);
    setColors(mockedData.colors);
    
    // Dados de performance
    const perfData = mockedData.performance;
    setPerformanceData(perfData);
    
    // Gera dados para o gráfico comparativo
    const compareMetrics = [
      { 
        name: 'Vendas', 
        passado: perfData.previousPeriodSales, 
        atual: perfData.salesTotal 
      },
      { 
        name: 'Pedidos', 
        passado: perfData.previousPeriodOrders, 
        atual: perfData.ordersCount 
      },
      { 
        name: 'Ticket Médio', 
        passado: perfData.previousAverageOrder, 
        atual: perfData.averageOrderValue 
      },
      { 
        name: 'Conversão (%)', 
        passado: perfData.previousConversionRate, 
        atual: perfData.conversionRate 
      }
    ];
    setCompareData(compareMetrics);
  };
  
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous * 100).toFixed(1);
  };
  
  const getTimePeriodData = () => {
    switch (timePeriod) {
      case 'day':
        return {
          sales: salesByDay,
          period: 'hoje',
          previousPeriod: 'ontem'
        };
      case 'week':
        return {
          sales: salesByDay,
          period: 'esta semana',
          previousPeriod: 'semana passada'
        };
      case 'month':
      default:
        return {
          sales: salesByMonth,
          period: 'este mês',
          previousPeriod: 'mês passado'
        };
    }
  };
  
  const { sales, period, previousPeriod } = getTimePeriodData();
  
  // Usando os dados de performance mocados
  const currentSales = performanceData.salesTotal || 0;
  const previousSales = performanceData.previousPeriodSales || 0;
  const currentOrders = performanceData.ordersCount || 0;
  const previousOrders = performanceData.previousPeriodOrders || 0;
  const currentVisits = 1250; // Não temos esse dado no mock, mantendo valor fixo
  const previousVisits = 980; // Não temos esse dado no mock, mantendo valor fixo
  const conversionRate = performanceData.conversionRate || 0;
  const prevConversionRate = performanceData.previousConversionRate || 0;
  
  const salesGrowth = calculateGrowth(currentSales, previousSales);
  const ordersGrowth = calculateGrowth(currentOrders, previousOrders);
  const visitsGrowth = calculateGrowth(currentVisits, previousVisits);
  const conversionGrowth = calculateGrowth(Number(conversionRate), Number(prevConversionRate));
  
  if (loading) {
    return (
      <SellerLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Carregando relatórios...</p>
        </div>
      </SellerLayout>
    );
  }
  
  return (
    <SellerLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Relatórios e Métricas</h1>
        
        {/* Filtro de Período */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center">
            <span className="text-gray-700 mr-4">Período:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimePeriod('day')}
                className={`px-4 py-2 rounded-md ${
                  timePeriod === 'day' 
                    ? 'bg-market-blue text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Diário
              </button>
              <button
                onClick={() => setTimePeriod('week')}
                className={`px-4 py-2 rounded-md ${
                  timePeriod === 'week' 
                    ? 'bg-market-blue text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Semanal
              </button>
              <button
                onClick={() => setTimePeriod('month')}
                className={`px-4 py-2 rounded-md ${
                  timePeriod === 'month' 
                    ? 'bg-market-blue text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mensal
              </button>
            </div>
          </div>
        </div>
        
        {/* Cards Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card Vendas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-blue-100 text-blue-600 mr-4">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Vendas {period}</p>
                <h3 className="text-2xl font-bold">R$ {currentSales.toFixed(2)}</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {Number(salesGrowth) >= 0 ? (
                <span className="flex items-center text-green-600 text-sm">
                  <ArrowUp size={16} className="mr-1" />
                  {salesGrowth}%
                </span>
              ) : (
                <span className="flex items-center text-red-600 text-sm">
                  <ArrowDown size={16} className="mr-1" />
                  {Math.abs(Number(salesGrowth))}%
                </span>
              )}
              <span className="text-gray-600 text-sm ml-2">vs {previousPeriod}</span>
            </div>
          </div>
          
          {/* Card Pedidos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-green-100 text-green-600 mr-4">
                <ShoppingCart size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pedidos {period}</p>
                <h3 className="text-2xl font-bold">{currentOrders}</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {Number(ordersGrowth) >= 0 ? (
                <span className="flex items-center text-green-600 text-sm">
                  <ArrowUp size={16} className="mr-1" />
                  {ordersGrowth}%
                </span>
              ) : (
                <span className="flex items-center text-red-600 text-sm">
                  <ArrowDown size={16} className="mr-1" />
                  {Math.abs(Number(ordersGrowth))}%
                </span>
              )}
              <span className="text-gray-600 text-sm ml-2">vs {previousPeriod}</span>
            </div>
          </div>
          
          {/* Card Visitas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-purple-100 text-purple-600 mr-4">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Visitas {period}</p>
                <h3 className="text-2xl font-bold">{currentVisits}</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {Number(visitsGrowth) >= 0 ? (
                <span className="flex items-center text-green-600 text-sm">
                  <ArrowUp size={16} className="mr-1" />
                  {visitsGrowth}%
                </span>
              ) : (
                <span className="flex items-center text-red-600 text-sm">
                  <ArrowDown size={16} className="mr-1" />
                  {Math.abs(Number(visitsGrowth))}%
                </span>
              )}
              <span className="text-gray-600 text-sm ml-2">vs {previousPeriod}</span>
            </div>
          </div>
          
          {/* Card Taxa de Conversão */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-yellow-100 text-yellow-600 mr-4">
                <PackageCheck size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Taxa de Conversão</p>
                <h3 className="text-2xl font-bold">{conversionRate}%</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {Number(conversionGrowth) >= 0 ? (
                <span className="flex items-center text-green-600 text-sm">
                  <ArrowUp size={16} className="mr-1" />
                  {conversionGrowth}%
                </span>
              ) : (
                <span className="flex items-center text-red-600 text-sm">
                  <ArrowDown size={16} className="mr-1" />
                  {Math.abs(Number(conversionGrowth))}%
                </span>
              )}
              <span className="text-gray-600 text-sm ml-2">vs {previousPeriod}</span>
            </div>
          </div>
        </div>
        
        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Gráfico de Vendas */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Vendas por Período</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, 'Valor']} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="valor" 
                    name="Vendas" 
                    stroke={colors.primary} 
                    fill={colors.primary} 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Pedidos por Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Pedidos por Status</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors.chart[index % colors.chart.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Gráficos Secundários */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Produtos Mais Vendidos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Produtos Mais Vendidos</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={topProducts}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip formatter={(value) => [`${value} unidades`, 'Vendas']} />
                  <Bar dataKey="sales" name="Vendas" fill={colors.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Vendas por Categoria */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Vendas por Categoria</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors.chart[index % colors.chart.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Alertas de Estoque Baixo */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Alertas de Estoque Baixo</h2>
          
          {lowStockProducts.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Nenhum produto com estoque baixo no momento.</p>
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
                      Estoque Atual
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lowStockProducts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Estoque mínimo: {product.minimumStock} unidades
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.stock === 0 
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.stock} unidades
                          </span>
                          <AlertTriangle 
                            size={16} 
                            className="ml-2 text-yellow-500" 
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/seller/products/edit/${product.id}`}
                          className="text-market-blue hover:text-blue-800"
                        >
                          Atualizar Estoque
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Gráfico de Desempenho Comparativo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Comparativo de Desempenho</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={compareData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="passado" name="Período Anterior" fill="#9e9e9e" />
                <Bar dataKey="atual" name="Período Atual" fill={colors.primary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerAnalytics; 