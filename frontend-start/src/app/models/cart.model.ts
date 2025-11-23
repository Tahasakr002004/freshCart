export interface CartItem {
  product: string;
  unitPrice: number;
  quantity: number;
}

export interface Cart {
  _id?: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
}