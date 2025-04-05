import { format, subDays, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função para gerar dados de vendas diárias
export const getMockedDailySales = (days: number = 30) => {
  const data = [];
  let totalValue = 0;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    // Gera um valor aleatório entre 100 e 1500
    const value = Math.floor(Math.random() * 1400) + 100;
    totalValue += value;
    
    data.push({
      date: format(date, 'dd/MM'),
      fullDate: format(date, 'dd/MM/yyyy'),
      valor: value,
    });
  }
  
  return { data, totalValue };
};

// Função para gerar dados de vendas mensais
export const getMockedMonthlySales = (months: number = 12) => {
  const data = [];
  let totalValue = 0;
  
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    // Gera um valor entre 3000 e 15000
    const value = Math.floor(Math.random() * 12000) + 3000;
    totalValue += value;
    
    data.push({
      date: format(date, 'MMM', { locale: ptBR }),
      fullDate: format(date, 'MM/yyyy'),
      valor: value,
    });
  }
  
  return { data, totalValue };
};

// Função para gerar dados dos produtos mais vendidos
export const getMockedTopProducts = () => {
  return [
    { name: 'Smartphone Galaxy S23', sales: 42, revenue: 83916 },
    { name: 'Notebook Dell Inspiron', sales: 28, revenue: 56000 },
    { name: 'Smart TV 50"', sales: 19, revenue: 28500 },
    { name: 'Fones de Ouvido Bluetooth', sales: 53, revenue: 15900 },
    { name: 'Console Playstation 5', sales: 15, revenue: 37500 },
  ];
};

// Função para gerar dados de vendas por categoria
export const getMockedCategorySales = () => {
  return [
    { name: 'Eletrônicos', value: 45 },
    { name: 'Informática', value: 23 },
    { name: 'Celulares', value: 18 },
    { name: 'Áudio e Vídeo', value: 8 },
    { name: 'Acessórios', value: 6 },
  ];
};

// Função para gerar dados de pedidos por status
export const getMockedOrdersByStatus = () => {
  return [
    { name: 'Pendente', value: 12 },
    { name: 'Em processamento', value: 26 },
    { name: 'Enviado', value: 18 },
    { name: 'Entregue', value: 38 },
    { name: 'Cancelado', value: 6 },
  ];
};

// Função para gerar dados de performance
export const getMockedPerformanceData = () => {
  return {
    salesTotal: 22450,
    previousPeriodSales: 19850,
    ordersCount: 87,
    previousPeriodOrders: 74,
    averageOrderValue: 258.05,
    previousAverageOrder: 268.24,
    conversionRate: 3.2,
    previousConversionRate: 2.8
  };
};

// Função para gerar dados de produtos com estoque baixo
export const getMockedLowStockProducts = () => {
  return [
    { id: 'p1', name: 'Smartphone Galaxy S23', stock: 2, minimumStock: 5 },
    { id: 'p2', name: 'Headset Gamer RGB', stock: 1, minimumStock: 10 },
    { id: 'p3', name: 'Mouse sem fio', stock: 3, minimumStock: 8 },
    { id: 'p4', name: 'Carregador USB-C', stock: 4, minimumStock: 15 },
  ];
};

// Função para gerar cores para gráficos
export const getChartColors = () => {
  return {
    primary: '#3182ce',
    secondary: '#63b3ed',
    accent: '#4c51bf',
    success: '#48bb78',
    warning: '#ecc94b',
    danger: '#e53e3e',
    chart: [
      '#3182ce', '#63b3ed', '#4c51bf', '#48bb78', '#ecc94b',
      '#e53e3e', '#805ad5', '#d53f8c', '#38b2ac', '#f6ad55'
    ]
  };
};

// Função para gerar distribuição geográfica de vendas
export const getMockedGeographicData = () => {
  return [
    { state: 'SP', value: 42 },
    { state: 'RJ', value: 18 },
    { state: 'MG', value: 12 },
    { state: 'RS', value: 8 },
    { state: 'PR', value: 7 },
    { state: 'BA', value: 5 },
    { state: 'Outros', value: 8 },
  ];
};

// Função principal que retorna todos os dados simulados
export const getMockedAnalyticsData = (period: 'daily' | 'weekly' | 'monthly' = 'monthly') => {
  // Escolhe o período de dados baseado no parâmetro
  const dailySales = getMockedDailySales(period === 'daily' ? 30 : period === 'weekly' ? 12 : 7);
  const monthlySales = getMockedMonthlySales(period === 'monthly' ? 12 : 6);
  
  return {
    salesByDay: dailySales.data,
    totalDailySales: dailySales.totalValue,
    salesByMonth: monthlySales.data, 
    totalMonthlySales: monthlySales.totalValue,
    topProducts: getMockedTopProducts(),
    categorySales: getMockedCategorySales(),
    ordersByStatus: getMockedOrdersByStatus(),
    performance: getMockedPerformanceData(),
    lowStockProducts: getMockedLowStockProducts(),
    geographicData: getMockedGeographicData(),
    colors: getChartColors()
  };
}; 