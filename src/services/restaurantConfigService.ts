import api from '@/lib/api';
import { type RestaurantConfig } from '@/types';

interface UpdateConfigApiResponse {
  config: RestaurantConfig;
}

export const fetchRestaurantConfig =
  async (): Promise<RestaurantConfig | null> => {
    try {
      const response = await api.get<RestaurantConfig>('/configuracao');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar configuração do restaurante:', error);
      return null;
    }
  };

export const updateRestaurantConfig = async (
  formData: FormData,
): Promise<RestaurantConfig> => {
  try {
    const response = await api.put<UpdateConfigApiResponse>(
      '/configuracao',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data.config;
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    throw error;
  }
};
