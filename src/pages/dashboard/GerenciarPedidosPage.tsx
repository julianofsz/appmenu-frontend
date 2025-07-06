import { useState, useEffect } from 'react';
import { type Order } from '@/types';
import { fetchAllOrders } from '@/services/pedidoService';
import { Bell, ChefHat, CheckCircle, type LucideIcon } from 'lucide-react';
import { OrderStatusCard } from '@/components/common/dash/OrderStatusCard';
import { OrderListItem } from '@/components/common/dash/OrderListItem';

type StatusType = 'novo' | 'preparando' | 'finalizado';

const statusList: {
  name: string;
  value: StatusType;
  icon: LucideIcon;
  color: string;
}[] = [
  {
    name: 'Novos Pedidos',
    value: 'novo',
    icon: Bell,
    color: 'bg-gradient-to-br from-blue-700 to-blue-900',
  },
  {
    name: 'Em Preparo',
    value: 'preparando',
    icon: ChefHat,
    color: 'bg-gradient-to-br from-amber-500 to-amber-700',
  },
  {
    name: 'Finalizados',
    value: 'finalizado',
    icon: CheckCircle,
    color: 'bg-gradient-to-br from-green-600 to-green-800',
  },
];

export function GerenciarPedidosPage() {
  const [selectedStatus, setSelectedStatus] = useState<StatusType>('novo');
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    const ordersFromApi = await fetchAllOrders();
    setAllOrders(ordersFromApi);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();

    const intervalId = setInterval(() => {
      console.log('Atualizando pedidos...');
      loadOrders();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const filteredOrders = allOrders.filter(
    order => order.orderStatus === selectedStatus,
  );
  const getOrderCountByStatus = (status: StatusType) =>
    allOrders.filter(order => order.orderStatus === status).length;

  return (
    <div className='h-full flex flex-col gap-6'>
      <h1 className='text-3xl font-bold text-gray-800'>Gerenciar Pedidos</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {statusList.map(statusInfo => (
          <OrderStatusCard
            key={statusInfo.value}
            statusName={statusInfo.name}
            orderCount={getOrderCountByStatus(statusInfo.value)}
            Icon={statusInfo.icon}
            colorClassName={statusInfo.color}
            isSelected={selectedStatus === statusInfo.value}
            onSelect={() => setSelectedStatus(statusInfo.value)}
          />
        ))}
      </div>

      <div className='flex-grow bg-white rounded-lg p-6 border'>
        <h2 className='text-xl font-semibold text-gray-700 mb-4'>
          Pedidos
          <span className='ml-2 px-2 py-1 text-sm rounded-full bg-gray-200 text-gray-700'>
            {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
          </span>
        </h2>

        {loading ? (
          <p className='text-center text-gray-500 py-10'>
            Carregando pedidos...
          </p>
        ) : filteredOrders.length > 0 ? (
          <div className='space-y-4'>
            {filteredOrders.map(order => (
              <OrderListItem
                key={order.id}
                order={order}
                onUpdate={loadOrders}
              />
            ))}
          </div>
        ) : (
          <p className='text-center text-gray-500 py-10'>
            Nenhum pedido encontrado neste status.
          </p>
        )}
      </div>
    </div>
  );
}
