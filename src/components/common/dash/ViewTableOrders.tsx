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
import { User } from 'lucide-react';

interface ViewTableOrdersProps {
  tableNumber: string;
  orders: Order[];
  children: React.ReactNode;
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

export function ViewTableOrders({
  tableNumber,
  orders,
  children,
}: ViewTableOrdersProps) {
  const totalGeralDaMesa = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-xl bg-white text-gray-900 border-gray-200 shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>
            Pedidos da Mesa {tableNumber}
          </DialogTitle>
          <DialogDescription>
            {orders.length} pedido(s) registrado(s) para esta mesa.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[60vh] -mr-6 pr-6'>
          <div className='space-y-4 my-4'>
            {orders.map(order => (
              <div
                key={order._id}
                className='p-4 rounded-lg border border-gray-200 bg-gray-50'
              >
                <div className='flex justify-between items-center'>
                  <p className='font-bold text-gray-800'>{order.orderCode}</p>
                  <Badge
                    variant='outline'
                    className={statusMap[order.orderStatus].className}
                  >
                    {statusMap[order.orderStatus].text}
                  </Badge>
                </div>
                <p className='flex items-center gap-2 text-sm text-muted-foreground mt-1'>
                  <User size={14} />
                  {order.customerName}
                </p>
                <Separator className='my-3 bg-gray-200' />
                <div className='space-y-1 text-sm text-gray-600'>
                  {order.products.map((item, index) => (
                    <div key={index} className='flex justify-between'>
                      <span>
                        {item.quantity}x {item.productName}
                      </span>
                      <span className='text-gray-800 font-medium'>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className='pt-4 border-t !justify-between'>
          <div className='font-bold text-xl text-gray-900'>
            <span>TOTAL DA MESA:</span>
            <span className='ml-2'>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(totalGeralDaMesa)}
            </span>
          </div>
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
