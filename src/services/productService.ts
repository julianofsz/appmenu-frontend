import api from '@/lib/api';
import {
  type Product,
  type ApiUpdateProductResponse,
  type ApiCreateProductResponse,
} from '@/types';
interface ProductListApiResponse {
  products: Product[];
}

interface SingleProductApiResponse {
  product: Product;
}

export const fetchProducts = async (
  categoryId?: string,
): Promise<Product[]> => {
  try {
    const params = categoryId ? { categoria: categoryId } : {};
    const response = await api.get<ProductListApiResponse>('/produtos', {
      params,
    });
    return response.data.products || [];
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await api.get<SingleProductApiResponse>(`/produtos/${id}`);
    return response.data.product;
  } catch (error) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error);
    return null;
  }
};
export const createProduct = async (formData: FormData): Promise<Product> => {
  try {
    const response = await api.post<ApiCreateProductResponse>(
      '/produtos/create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data.newProduct;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
};
export const updateProduct = async (
  id: string,
  formData: FormData,
): Promise<Product> => {
  try {
    const response = await api.put<ApiUpdateProductResponse>(
      `/produtos/${id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data.updatedProduct;
  } catch (error) {
    console.error(`Erro ao atualizar produto ${id}:`, error);
    throw error;
  }
};

export const updateProductDetails = async (
  id: string,
  updateData: Partial<{ isAvailable: boolean }>,
): Promise<Product> => {
  try {
    const response = await api.patch<ApiUpdateProductResponse>(
      `/produtos/${id}`,
      updateData,
    );
    return response.data.updatedProduct;
  } catch (error) {
    console.error(`Erro ao atualizar detalhes do produto ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/produtos/${id}`);
    return true;
  } catch (error) {
    console.error(`Erro ao deletar produto ${id}:`, error);
    return false;
  }
};
