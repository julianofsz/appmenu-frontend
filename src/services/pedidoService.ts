import api from '@/lib/api';
import {
  type Order,
  type CreateOrderPayload,
  type CreateOrderApiResponse,
} from '@/types';
import { type Order as FrontendOrder } from '@/types';
import { type Order as BackendOrder } from '@/types';
export const createOrder = async (
  orderData: CreateOrderPayload,
): Promise<Order> => {
  try {
    const response = await api.post<CreateOrderApiResponse>(
      '/pedidos',
      orderData,
    );
    return response.data.pedido;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
};

interface GetOrdersApiResponse {
  pedidos: BackendOrder[];
}

interface UpdateOrderApiResponse {
  pedido: BackendOrder;
}

/**
 * Funçãoque converte um pedido do formato do backend
 * para o formato que o frontend espera.
 */
function toFrontendOrder(backendOrder: BackendOrder): Order {
  return {
    _id: backendOrder._id,
    id: backendOrder.orderCode,
    customerName: backendOrder.customerName,
    customerTelefone: backendOrder.customerTelefone,
    orderStatus: backendOrder.orderStatus,
    products: backendOrder.products,
    total: backendOrder.total,
    consumitionMethod: backendOrder.consumitionMethod,
    tableNumber: backendOrder.tableNumber,
    orderCode: backendOrder.orderCode,
    paymentMethod: backendOrder.paymentMethod,
    paymentStatus: backendOrder.paymentStatus,
    createdAt: backendOrder.createdAt,
    updatedAt: backendOrder.updatedAt,
  };
}

export const fetchAllOrders = async (): Promise<
  (FrontendOrder & { _id: string })[]
> => {
  try {
    const response = await api.get<GetOrdersApiResponse>('/pedidos');
    return response.data.pedidos.map(toFrontendOrder); // Traduz cada pedido
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return [];
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: 'preparando' | 'finalizado' | 'cancelado',
): Promise<BackendOrder> => {
  try {
    const response = await api.patch<UpdateOrderApiResponse>(
      `/pedidos/${orderId}`,
      { orderStatus: status },
    );
    return response.data.pedido;
  } catch (error) {
    console.error(`Erro ao atualizar pedido ${orderId}:`, error);
    throw error;
  }
};

export const finalizeTableOrders = async (
  tableNumber: string,
): Promise<boolean> => {
  try {
    await api.delete(`/pedidos/mesa/${tableNumber}`);
    return true;
  } catch (error) {
    console.error(`Erro ao finalizar a mesa ${tableNumber}:`, error);
    return false;
  }
};

export const clearAllOrders = async (): Promise<boolean> => {
  try {
    await api.delete('/pedidos');
    return true;
  } catch (error) {
    console.error('Erro ao limpar os pedidos:', error);
    return false;
  }
};
