import api from '@/lib/api';
import { type Category } from '@/types';

interface SingleCategoryApiResponse {
  message: string;
  category: Category;
}

interface CategoryListApiResponse {
  categories: Category[];
}

export const fetchAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<CategoryListApiResponse>('/categorias');
    return response.data.categories || [];
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
};

export const createCategory = async (data: {
  nome: string;
}): Promise<Category> => {
  try {
    const response = await api.post<SingleCategoryApiResponse>(
      '/categorias',
      data,
    );
    return response.data.category;
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  data: { nome: string },
): Promise<Category> => {
  try {
    // Usamos PUT para substituir os dados
    const response = await api.put<SingleCategoryApiResponse>(
      `/categorias/${id}`,
      data,
    );
    return response.data.category;
  } catch (error) {
    console.error(`Erro ao atualizar categoria ${id}:`, error);
    throw error;
  }
};

export const toggleCategoryStatus = async (id: string): Promise<Category> => {
  try {
    // Usamos PATCH para uma atualização parcial
    const response = await api.patch<SingleCategoryApiResponse>(
      `/categorias/${id}/toggle`,
    );
    return response.data.category;
  } catch (error) {
    console.error(`Erro ao alterar status da categoria ${id}:`, error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/categorias/${id}`);
    return true;
  } catch (error) {
    console.error(`Erro ao deletar categoria ${id}:`, error);
    return false;
  }
};
