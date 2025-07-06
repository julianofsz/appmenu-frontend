import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteCategory } from '@/services/categoryService';
import { AxiosError } from 'axios';
import { showMassage } from '@/adapters/showMassage';

interface DeleteCategoryDialogProps {
  categoryId: string;
  categoryName: string;
  onUpdate: () => void;
  children: React.ReactNode;
}

export function DeleteCategoryDialog({
  categoryId,
  categoryName,
  onUpdate,
  children,
}: DeleteCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteCategory(categoryId);
      showMassage.success(`Categoria "${categoryName}" excluída com sucesso!`);
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showMassage.error(error.response.data.message);
      } else {
        showMassage.error('Falha ao excluir a categoria.');
      }
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className='bg-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso irá excluir permanentemente a
            categoria
            <strong className='mx-1'>"{categoryName}"</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            className='bg-red-600 hover:bg-red-700'
          >
            {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
