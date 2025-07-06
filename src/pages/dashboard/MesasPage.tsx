import { useState, useEffect, useCallback } from 'react';
import { type Order } from '@/types';
import { fetchAllOrders } from '@/services/pedidoService';
import { TableCard } from '@/components/common/dash/TableCard';

type TableState = {
  tableNumber: string;
  status: 'ativa' | 'finalizada';
  orders: Order[];
};

export function MesasPage() {
  const [tables, setTables] = useState<TableState[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTablesData = useCallback(async () => {
    const allOrders = await fetchAllOrders();

    const ordersWithTables = allOrders.filter(order => order.tableNumber && order.paymentStatus === 'pago');

    const uniqueTableNumbers = [
      ...new Set(ordersWithTables.map(order => order.tableNumber!)),
    ];

    const tablesData = uniqueTableNumbers
      .map((tableNum): TableState => {
        const ordersForThisTable = ordersWithTables.filter(
          (o) => o.tableNumber === tableNum,
        );
        const hasActiveOrder = ordersForThisTable.some(
          o => o.orderStatus === 'novo' || o.orderStatus === 'preparando',
        );

        return {
          tableNumber: tableNum,
          status: hasActiveOrder ? 'ativa' : 'finalizada',
          orders: ordersForThisTable,
        };
      })
      .sort((a, b) => parseInt(a.tableNumber) - parseInt(b.tableNumber));

    setTables(tablesData);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTablesData();
    const intervalId = setInterval(loadTablesData, 10000);
    return () => clearInterval(intervalId);
  }, [loadTablesData]);

  if (loading) {
    return (
      <div className='p-6 text-center text-muted-foreground'>
        Carregando status das mesas...
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col gap-6 p-6'>
      <h1 className='text-3xl font-bold text-gray-800'>
        Gerenciamento de Mesas
      </h1>

      {tables.length > 0 ? (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
          {tables.map(table => (
            <TableCard
              key={table.tableNumber}
              tableNumber={table.tableNumber}
              status={table.status}
              ordersForThisTable={table.orders}
              onUpdate={loadTablesData}
            />
          ))}
        </div>
      ) : (
        <div className='flex-grow flex items-center justify-center bg-white rounded-lg border'>
          <p className='text-center text-gray-500'>
            Nenhuma mesa com pedidos no momento.
          </p>
        </div>
      )}
    </div>
  );
}
