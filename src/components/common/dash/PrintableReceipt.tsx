import { useEffect } from 'react';
import { OrderReceipt } from './OrderReceipt';
import { type Order } from '@/types';

interface PrintableReceiptProps {
  order: Order;
  onPrintFinished: () => void;
}

export function PrintableReceipt({
  order,
  onPrintFinished,
}: PrintableReceiptProps) {
  useEffect(() => {
    window.print();
    onPrintFinished();
  }, [onPrintFinished]);

  return (
    <div className='print-container'>
      <OrderReceipt order={order} />
    </div>
  );
}
