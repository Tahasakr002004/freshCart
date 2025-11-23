export interface OrderItem {
  product: string;          // product id
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  _id?: string;
  userId: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled' | 'completed';
}

export interface CheckoutRequest {
  address: string;
}