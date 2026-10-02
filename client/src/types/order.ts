export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  _id: string;
  user: string;
  products: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  products: Array<{
    product: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}
