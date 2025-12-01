export interface CartItem {
  product: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface Cart {
  _id?: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
}