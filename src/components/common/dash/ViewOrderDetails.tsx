import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type Order } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ViewOrderDetailsProps {
  children: React.ReactNode;
  order: Order;
}

const statusMap = {
  novo: {
    text: 'Novo',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  preparando: {
    text: 'Em Preparo',
    className: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  finalizado: {
    text: 'Finalizado',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  cancelado: {
    text: 'Cancelado',
    className: 'bg-red-100 text-red-800 border-red-300',
  },
};

export function ViewOrderDetails({ children, order }: ViewOrderDetailsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-lg bg-white text-gray-900 border-gray-200 shadow-lg'>
        <DialogHeader>
          {/* Usando o orderCode que é mais amigável */}
          <DialogTitle className='text-2xl text-center'>
            Pedido {order.orderCode}
          </DialogTitle>
          <DialogDescription className='text-center'>
            Detalhes do pedido para {order.customerName}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[70vh]'>
          <div className='py-4 pr-6'>
            <div className='grid grid-cols-2 gap-4 rounded-lg border bg-gray-50 p-4 mb-6'>
              <div>
                <p className='text-sm text-gray-500'>Cliente</p>
                <p className='font-semibold'>{order.customerName}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Status</p>

                <Badge
                  variant='outline'
                  className={statusMap[order.orderStatus].className}
                >
                  {statusMap[order.orderStatus].text}
                </Badge>
              </div>
              <div className='col-span-2'>
                <p className='text-sm text-gray-500'>Método</p>
                <p className='font-semibold'>
                  {order.consumitionMethod === 'comer'
                    ? `Mesa ${order.tableNumber}`
                    : 'Para Levar'}
                </p>
              </div>
            </div>

            <div className='space-y-2'>
              <h3 className='font-semibold text-gray-800'>Itens do Pedido</h3>
              <Separator />

              {order.products.map((item, index) => (
                <div
                  key={index}
                  className='flex justify-between items-center text-sm py-1'
                >
                  <div>
                    <span className='font-medium text-gray-800'>
                      {item.productName}
                    </span>
                    <span className='text-gray-500 ml-2'>x{item.quantity}</span>
                  </div>
                  <span className='text-gray-600'>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <Separator />
            </div>

            <div className='flex justify-between font-bold text-xl text-gray-900 mt-6'>
              <span>TOTAL:</span>
              <span>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(order.total)}
              </span>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className='pt-2 border-t'>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
