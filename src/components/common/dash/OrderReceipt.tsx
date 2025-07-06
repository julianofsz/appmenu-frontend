import React from 'react';
import { type Order } from '@/types';

interface OrderReceiptProps {
  order: Order;
}

// Usamos React.forwardRef para que a biblioteca de impressão possa ter uma referência a este componente
export const OrderReceipt = React.forwardRef<HTMLDivElement, OrderReceiptProps>(({ order }, ref) => {
 const totalItems = order.products.reduce((sum, item) => sum + item.quantity, 0);
  const now = new Date();

  return (
    // O 'ref' é passado para este div, que é o container principal do nosso recibo
    <div ref={ref} className="p-4 bg-white text-black font-mono text-xs w-[302px]"> {/* Largura aprox. 80mm */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold">Snack Dash</h1>
      </div>

      <div className="border-t border-b border-dashed border-black py-2 my-2">
        <p>Data: {now.toLocaleDateString('pt-BR')} - Hora: {now.toLocaleTimeString('pt-BR')}</p>
        <p>Pedido: {order.id} / Mesa: {order.tableNumber || 'N/A'}</p>
        <p>Cliente: {order.customerName}</p>
        <p>Método: {order.consumitionMethod === 'comer' ? 'Comer no Local' : 'Para Levar'}</p>
      </div>

      <div className="space-y-1 my-2">
        <div className="flex justify-between font-bold">
          <span>QTD. ITEM</span>
          <span>TOTAL</span>
        </div>
        {order.products.map((item, index) => (
          <div key={index} className="flex justify-between">
            <div className='flex flex-col'>
              <span>{item.quantity}x {item.productName}</span>
              <span className='pl-4'>
                (un. {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)})
              </span>
            </div>
            <span>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-black pt-2 mt-2">
        <div className="flex justify-between">
          <span>Total de Itens:</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between font-bold text-base mt-2">
          <span>TOTAL:</span>
          <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}</span>
        </div>
      </div>
      
      <p className="text-center mt-4 text-xs">*** CUPOM NÃO FISCAL ***</p>
    </div>
  );
});