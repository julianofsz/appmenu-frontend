import api from '@/lib/api';
import {
  type CreatePreferencePayload,
  type PaymentPreferenceResponse,
} from '@/types';

/**
 * Pede ao nosso backend para criar uma preferência de pagamento no Mercado Pago.
 * @param payload Os dados necessários para criar a preferência (ID do pedido, itens, dados do pagador).
 * @returns A URL de checkout do Mercado Pago para onde o cliente será redirecionado.
 */
export const createPaymentPreference = async (
  payload: CreatePreferencePayload,
): Promise<string> => {
  try {
    const response = await api.post<PaymentPreferenceResponse>(
      '/pagamentos/create-preference',
      payload,
    );
    return response.data.paymentUrl;
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    throw error;
  }
};

export const verifyPaymentStatus = async (
  paymentId: string,
): Promise<{ status: string }> => {
  try {
    const response = await api.get(`/pagamentos/status/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao verificar o pagamento ${paymentId}:`, error);
    throw error;
  }
};
