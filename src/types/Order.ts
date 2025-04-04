
import { CartItem } from './CartItem';

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
