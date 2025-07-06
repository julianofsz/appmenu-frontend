export * from './Category.types';
export * from './Product.types';
export * from './RestaurantConfig.types';
export interface OrderProductPayload {
  id: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerTelefone?: string;
  products: OrderProductPayload[];
  consumitionMethod: 'comer' | 'levar';
  tableNumber?: string | null;
}

export interface CreateOrderApiResponse {
  message: string;
  pedido: Order;
}

export interface Order {
  _id: string;
  id: string; //orderCode
  customerName: string;
  customerTelefone?: string;
  products: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  consumitionMethod: 'comer' | 'levar';
  tableNumber?: string | null;
  total: number;
  orderCode: string;
  paymentMethod: 'Pendente' | 'Cartão' | 'Pix' | 'Dinheiro';
  orderStatus: 'novo' | 'preparando' | 'finalizado' | 'cancelado';
  paymentStatus: 'pendente' | 'pago';
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginApiResponse {
  message: string;
  token: string;
  userId: string;
}

export interface CreatePreferencePayload {
  orderId: string;
  items: Order['products'];
  payerInfo: {
    name: string;
    email: string;
  };
}

export interface PaymentPreferenceResponse {
  paymentUrl: string;
}
