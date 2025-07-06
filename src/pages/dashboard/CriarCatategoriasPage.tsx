import React, { useState } from 'react';
import { createCategory } from '@/services/categoryService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showMassage } from '@/adapters/showMassage';

export function CriarCategoriasPage() {
  const [categoryName, setCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      showMassage.warning('Por favor, digite o nome da categoria.');
      return;
    }
    setIsSubmitting(true); // Desabilita o botão

    try {
      const newCategoryData = { nome: categoryName };
      await createCategory(newCategoryData);
      showMassage.success(`Categoria "${categoryName}" criada com sucesso!`);
      setCategoryName(''); // Limpa o campo após a criação
    } catch (error) {
      showMassage.warning('Falha ao criar categoria:' + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCategoryName('');
  };

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='w-full max-w-lg bg-white p-8 rounded-xl border border-gray-200 shadow-lg'>
        <h2 className='text-3xl font-bold text-gray-900 text-center mb-8'>
          Criar Nova Categoria
        </h2>
        <form className='space-y-6'>
          <div>
            <Label
              htmlFor='categoryName'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Nome da Categoria
            </Label>
            <Input
              id='categoryName'
              type='text'
              value={categoryName}
              onChange={e => setCategoryName(e.target.value)}
              placeholder='Ex: Lanches, Bebidas, Sobremesas'
              className='w-full p-3 rounded-md bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition'
            />
          </div>
          <div className='flex items-center justify-between gap-2 pt-2'>
            <Button
              type='button'
              variant='destructive'
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button
              onClick={handleCreate}
              disabled={isSubmitting}
              className=' w-60 rounded-md bg-amber-500 text-gray-900 font-semibold transition hover:bg-amber-600'
            >
              Criar Categoria
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
