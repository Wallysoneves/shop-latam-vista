
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CartItem } from '../types/CartItem';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  total: number;
  shipping: number;
  shippingInfo: ShippingInfo;
  sellerId: string;
}

export interface GroupedOrders {
  [sellerId: string]: Order;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrdersByCustomer: (customerId: string) => Order[];
  getOrdersBySeller: (sellerId: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setOrders(prevOrders => [...prevOrders, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date() }
          : order
      )
    );
  };

  const getOrdersByCustomer = (customerId: string) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getOrdersBySeller = (sellerId: string) => {
    return orders.filter(order => order.sellerId === sellerId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrdersByCustomer,
        getOrdersBySeller
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
