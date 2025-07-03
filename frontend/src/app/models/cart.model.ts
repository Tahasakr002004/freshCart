import { Product } from './product.model';

export interface CartItem {
    product: string | Product;
    unitPrice: number;
    quantity: number;
}

export interface Cart {
    _id?: string;   //optional since typically returned by MongoDB
    userId: string;
    items: CartItem[];
    totalAmount: number;
    status: 'active' | 'completed';
}