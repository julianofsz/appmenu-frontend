import { useState } from 'react';
import { type Order } from '@/types'; // Importa o tipo centralizado
import { Button } from '@/components/ui/button';
import { ViewOrderDetails } from './ViewOrderDetails';
import { PrintableReceipt } from './PrintableReceipt';
import { updateOrderStatus } from '@/services/pedidoService'; // Nosso serviço de API

import {
  Utensils,
  ShoppingBag,
  User,
  Hash,
  Eye,
  Printer,
  ChefHat,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
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
import { showMassage } from '@/adapters/showMassage';

interface OrderListItemProps {
  order: Order;
  onUpdate: () => void;
}

export function OrderListItem({ order, onUpdate }: OrderListItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);
  const totalItems = order.products.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const handleStatusChange = async (
    newStatus: 'preparando' | 'finalizado' | 'cancelado',
  ) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(order._id, newStatus);
      showMassage.success(
        `Pedido #${order.orderCode} atualizado para "${newStatus}"!`,
      );
      onUpdate();
    } catch (error) {
      showMassage.error('Houve uma falha ao atualizar o status do pedido.');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {orderToPrint && (
        <PrintableReceipt
          order={orderToPrint}
          onPrintFinished={() => setOrderToPrint(null)}
        />
      )}
      <div className='border rounded-lg p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:bg-gray-50/50 transition-colors'>
        <div className='w-full lg:w-auto flex justify-between lg:justify-start lg:gap-8'>
          <div className='space-y-1'>
            <p className='font-bold text-lg text-gray-800 flex items-center gap-2'>
              <Hash size={18} /> Pedido {order.orderCode}
            </p>
            <p className='text-sm text-gray-600 flex items-center gap-2'>
              <User size={16} /> {order.customerName}
            </p>
            <p className='text-xs text-gray-500'>
              {totalItems} {totalItems > 1 ? 'itens' : 'item'}
            </p>
          </div>
          <div
            className={`flex items-center justify-center gap-2 text-sm font-medium px-3 py-1 rounded-full h-fit ${
              order.consumitionMethod === 'comer'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {order.consumitionMethod === 'comer' ? (
              <Utensils size={14} />
            ) : (
              <ShoppingBag size={14} />
            )}
            <span>
              {order.consumitionMethod === 'comer'
                ? `Mesa ${order.tableNumber}`
                : 'Para Levar'}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2 flex-wrap justify-end w-full lg:w-auto'>
          {order.orderStatus === 'novo' && order.paymentStatus === 'pago' && (
            <>
              <ViewOrderDetails order={order}>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-2'
                  disabled={isUpdating}
                >
                  <Eye size={16} /> Visualizar
                </Button>
              </ViewOrderDetails>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2'
                onClick={() => setOrderToPrint(order)}
                disabled={isUpdating}
              >
                <Printer size={16} /> Imprimir
              </Button>
              <Button
                className='bg-amber-500 hover:bg-amber-600 flex items-center gap-2'
                size='sm'
                onClick={() => handleStatusChange('preparando')}
                disabled={isUpdating}
              >
                <ChefHat size={16} /> {isUpdating ? 'Aguarde...' : 'Em Preparo'}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='destructive'
                    size='sm'
                    className='flex items-center gap-2'
                    disabled={isUpdating}
                  >
                    <XCircle size={16} /> Cancelar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancelar Pedido?</AlertDialogTitle>
                    <AlertDialogDescription>
                      O pedido {order.orderCode} será marcado como cancelado.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleStatusChange('cancelado')}
                      className='bg-red-600 hover:bg-red-700'
                    >
                      Sim, cancelar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          {order.orderStatus === 'preparando' && (
            <>
              <ViewOrderDetails order={order}>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-2'
                >
                  <Eye size={16} /> Visualizar
                </Button>
              </ViewOrderDetails>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2'
                onClick={() => setOrderToPrint(order)}
              >
                <Printer size={16} /> Imprimir
              </Button>
              <Button
                className='bg-green-600 hover:bg-green-700 flex items-center gap-2'
                size='sm'
                onClick={() => handleStatusChange('finalizado')}
                disabled={isUpdating}
              >
                <CheckCircle2 size={16} />{' '}
                {isUpdating ? 'Aguarde...' : 'Finalizar'}
              </Button>
            </>
          )}

          {(order.orderStatus === 'finalizado' ||
            order.orderStatus === 'cancelado') && (
            <ViewOrderDetails order={order}>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2'
              >
                <Eye size={16} /> Visualizar
              </Button>
            </ViewOrderDetails>
          )}
        </div>
      </div>
    </>
  );
}
