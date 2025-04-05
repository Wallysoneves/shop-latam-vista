import productsData from '../data/products.json';
import ordersData from '../data/orders.json';
import { Product } from '../types/Product';
import { Order, OrderStatus } from '../contexts/OrderContext';

// Função para converter os dados JSON de produtos em formato de Product
export const convertToProduct = (productData: any): Product => {
  return {
    id: productData.id,
    name: productData.name,
    description: productData.description,
    price: productData.price,
    images: productData.images,
    category: productData.category,
    stock: productData.stock,
    seller: {
      id: productData.sellerId,
      name: productData.sellerId === 'seller1' ? 'Tech Store' : 'PhotoPro',
      reputation: 4.5,
      location: {
        country: 'Brasil',
        state: productData.sellerId === 'seller1' ? 'SP' : 'RJ'
      }
    },
    createdAt: productData.createdAt,
    sales: productData.sales || 0,
    isActive: true,
    brand: productData.brand,
    sku: productData.sku
  };
};

// Função para obter produtos de um vendedor específico
export const getSellerProducts = (sellerId: string): Product[] => {
  return productsData
    .filter((product: any) => product.sellerId === sellerId)
    .map(convertToProduct);
};

// Função para converter dados JSON de pedidos
export const convertToOrder = (orderData: any): Order => {
  return {
    ...orderData,
    createdAt: new Date(orderData.createdAt),
    updatedAt: new Date(orderData.updatedAt)
  };
};

// Função para obter pedidos de um vendedor específico
export const getSellerOrders = (sellerId: string): Order[] => {
  return ordersData
    .filter((order: any) => order.sellerId === sellerId)
    .map(convertToOrder);
};

// Função para obter vendas totais de um vendedor
export const getSellerTotalSales = (sellerId: string): number => {
  return ordersData
    .filter((order: any) => order.sellerId === sellerId && 
            (order.status === 'delivered' || order.status === 'shipped'))
    .reduce((total, order) => total + order.total, 0);
};

// Função para obter contagem de pedidos por status
export const getSellerOrdersByStatus = (sellerId: string): Record<OrderStatus, number> => {
  const orders = getSellerOrders(sellerId);
  const orderCounts: Record<OrderStatus, number> = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    canceled: 0
  };
  
  orders.forEach(order => {
    orderCounts[order.status]++;
  });
  
  return orderCounts;
};

export const sellerService = {
  getSellerProducts,
  getSellerOrders,
  getSellerTotalSales,
  getSellerOrdersByStatus
}; 