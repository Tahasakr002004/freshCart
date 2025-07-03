export interface OrderItem {
    product: string;
    productName: string;
    quantity: number;
    unitPrice: number;
}

export interface Order {
    _id?: any | string;   //optional since typically returned by MongoDB
    address: string
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'paid' | 'shipped' | 'cancelled';
}
