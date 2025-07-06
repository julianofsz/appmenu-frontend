import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Eye, ChefHat } from 'lucide-react';
import { ViewTableOrders } from './ViewTableOrders';
import { type Order } from '@/types';
import { finalizeTableOrders } from '@/services/pedidoService';
import { showMassage } from '@/adapters/showMassage';

interface TableCardProps {
  tableNumber: string;
  status: 'ativa' | 'finalizada';
  ordersForThisTable: Order[];
  onUpdate: () => void;
}

export function TableCard({
  tableNumber,
  status,
  ordersForThisTable,
  onUpdate,
}: TableCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFinalizeTable = async () => {
    setIsUpdating(true);
    const success = await finalizeTableOrders(tableNumber);
    if (success) {
      showMassage.success(`Mesa ${tableNumber} finalizada com sucesso!`);
      onUpdate();
    } else {
      showMassage.error(`Falha ao finalizar a mesa ${tableNumber}.`);
    }
    setIsUpdating(false);
  };

  const canFinalizeTable =
    status === 'finalizada' &&
    ordersForThisTable.every(o => o.orderStatus === 'finalizado');

  return (
    <div className='flex flex-col justify-between gap-4 rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg'>
      <div className='text-center'>
        <p className='text-sm font-medium text-gray-500'>Mesa</p>
        <p className='text-6xl font-bold text-gray-800 tracking-tighter'>
          {tableNumber}
        </p>
      </div>

      <div className='mt-4 space-y-3'>
        {status === 'ativa' && (
          <>
            <div className='flex items-center justify-center gap-2 rounded-md p-2 text-sm font-semibold bg-amber-100 text-amber-800'>
              <ChefHat size={16} />
              <span>Pedido em preparo</span>
            </div>
            <ViewTableOrders
              tableNumber={tableNumber}
              orders={ordersForThisTable}
            >
              <Button className='w-full bg-amber-500 text-gray-900 font-semibold hover:bg-amber-600'>
                <Eye className='mr-2 h-4 w-4' />
                Visualizar Pedidos
              </Button>
            </ViewTableOrders>
          </>
        )}

        {status === 'finalizada' && (
          <>
            <div className='flex items-center justify-center gap-2 rounded-md p-2 text-sm font-semibold bg-green-100 text-green-800'>
              <CheckCircle2 size={16} />
              <span>Pedidos Finalizados</span>
            </div>
            <div className='flex flex-col gap-2'>
              <ViewTableOrders
                tableNumber={tableNumber}
                orders={ordersForThisTable}
              >
                <Button className='w-full bg-amber-500 text-gray-900 font-semibold hover:bg-amber-600'>
                  <Eye className='mr-2 h-4 w-4' />
                  Visualizar Pedidos
                </Button>
              </ViewTableOrders>

              {canFinalizeTable && (
                <Button
                  variant='destructive'
                  className='w-full'
                  onClick={handleFinalizeTable}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Finalizando...' : 'Finalizar Mesa'}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
