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
import { toggleCategoryStatus } from '@/services/categoryService';
import { showMassage } from '@/adapters/showMassage';

interface ToggleCategoryDialogProps {
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  onUpdate: () => void;
  children: React.ReactNode;
}

export function ToggleCategoryDialog({
  categoryId,
  categoryName,
  isActive,
  onUpdate,
  children,
}: ToggleCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const actionText = isActive ? 'Desabilitar' : 'Habilitar';
  const colorClass = isActive
    ? 'bg-yellow-600 hover:bg-yellow-700'
    : 'bg-green-600 hover:bg-green-700';

  const handleConfirmToggle = async () => {
    setIsToggling(true);
    try {
      await toggleCategoryStatus(categoryId);
      showMassage.success(
        `Categoria "${categoryName}" atualizada com sucesso!`,
      );
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao alterar status da categoria:', error);
      showMassage.error('Falha ao alterar o status da categoria.');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className='bg-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja {actionText.toLowerCase()}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ao {actionText.toLowerCase()} a categoria{' '}
            <strong className='mx-1'>"{categoryName}"</strong>, ela{' '}
            {isActive ? 'não aparecerá mais' : 'voltará a aparecer'} para os
            clientes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmToggle}
            disabled={isToggling}
            className={colorClass}
          >
            {isToggling ? 'Aguarde...' : `Sim, ${actionText}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
