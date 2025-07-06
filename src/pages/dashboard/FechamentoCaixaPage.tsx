import { useState, useEffect, useMemo, useCallback } from 'react';
import { type Order } from '@/types';
import { fetchAllOrders, clearAllOrders } from '@/services/pedidoService';

// Componentes da UI e Ícones
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { DollarSign, ShoppingCart, Trash2 } from 'lucide-react';
import { showMassage } from '@/adapters/showMassage';

export function FechamentoCaixaPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  const loadData = useCallback(async () => {
    const ordersData = await fetchAllOrders();
    setAllOrders(ordersData);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const paidOrders = useMemo(
    () => allOrders.filter(order => order.paymentStatus === 'pago'),
    [allOrders],
  );

  const totalSales = useMemo(() => {
    return paidOrders.reduce((sum, order) => sum + order.total, 0);
  }, [paidOrders]);

  const handleClearBox = async () => {
    setIsClearing(true);
    try {
      const success = await clearAllOrders();
      if (success) {
        showMassage.success('Caixa fechado com sucesso!');
        loadData();
      } else {
        throw new Error('A API retornou uma falha.');
      }
    } catch (error) {
      console.error('Erro ao fechar o caixa:', error);
      showMassage.error('Erro ao fechar o caixa. Tente novamente mais tarde.');
    } finally {
      setIsClearing(false);
    }
  };

  if (loading) {
    return (
      <div className='p-6 text-center text-muted-foreground'>
        Carregando dados do caixa...
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-800'>
          Visão Geral de Vendas
        </h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='destructive'
              disabled={paidOrders.length === 0 || isClearing}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              {isClearing ? 'Encerrando...' : 'Encerrar Expediente'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='bg-white'>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação irá apagar todos pedidos. Recomendado apenas no final
                do dia de trabalho.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearBox}
                className='bg-red-600 hover:bg-red-700'
              >
                Sim, fechar o caixa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Cards de Resumo */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Receita Total</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(totalSales)}
            </div>
            <p className='text-xs text-muted-foreground'>Receita do dia</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Pedidos Pagos</CardTitle>
            <ShoppingCart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{paidOrders.length}</div>
            <p className='text-xs text-muted-foreground'>
              Número total pedidos pagos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pedidos do Dia</CardTitle>
          <CardDescription>
            Lista de todos os pedidos com pagamento aprovado para conferência.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cód. Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status do Pedido</TableHead>
                <TableHead>Método Pag.</TableHead>
                <TableHead className='text-right'>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paidOrders.length > 0 ? (
                paidOrders.map(order => (
                  <TableRow key={order._id}>
                    <TableCell className='font-medium'>
                      {order.orderCode}
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className='capitalize'>
                      {order.orderStatus}
                    </TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell className='text-right'>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(order.total)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='text-center h-24'>
                    Nenhum pedido pago encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
