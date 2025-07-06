import { useState } from 'react';
import { type Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import { EditProductDialog } from './EditProductDialog';
import { deleteProduct, updateProductDetails } from '@/services/productService';
import { showMassage } from '@/adapters/showMassage';

interface ProductManagementCardProps {
  product: Product;
  onUpdate: () => void;
}

export function ProductManagementCard({
  product,
  onUpdate,
}: ProductManagementCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      await deleteProduct(product._id);
      showMassage.success(`Produto "${product.name}" excluído com sucesso.`);
      onUpdate();
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
      showMassage.error('Falha ao excluir o produto.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggle = async (isAvailable: boolean) => {
    setIsUpdating(true);
    try {
      await updateProductDetails(product._id, { isAvailable: isAvailable });
      onUpdate();
    } catch (error) {
      showMassage.error('Falha ao atualizar a disponibilidade.');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className='flex flex-col overflow-hidden rounded-lg border bg-white shadow-md transition-all hover:shadow-xl'>
      {/* Imagem */}
      <div className='aspect-video overflow-hidden'>
        <img
          src={`http://localhost:5000/images/produtos/${product.imageUrl}`}
          alt={product.name}
          className='h-full w-full object-cover'
        />
      </div>

      {/* Conteúdo */}
      <div className='flex flex-1 flex-col p-4'>
        <h4 className='flex-grow font-semibold text-lg text-gray-800'>
          {product.name}
        </h4>

        {/* Ações */}
        <div className='mt-4 flex flex-col gap-3'>
          <div className='flex items-center justify-between rounded-md border p-3'>
            <Label
              htmlFor={`disable-${product._id}`}
              className='font-semibold text-lg text-gray-900'
            >
              Disponível
            </Label>
            <Switch
              id={`disable-${product._id}`}
              checked={product.isAvailable}
              onCheckedChange={handleToggle}
              disabled={isUpdating}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <EditProductDialog product={product} onUpdate={onUpdate}>
              <Button
                disabled={isUpdating}
                className='w-full bg-amber-500 text-gray-900 font-semibold hover:bg-amber-600'
              >
                Alterar
              </Button>
            </EditProductDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='destructive'
                  className='w-full'
                  disabled={isUpdating}
                >
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. O produto "{product.name}"
                    será excluído.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className='bg-red-600 hover:bg-red-700'
                  >
                    Sim, excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
