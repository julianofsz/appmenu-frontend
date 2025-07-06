import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { verifyPaymentStatus } from '@/services/paymentService';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function PagamentoAceitoPage() {
  const [status, setStatus] = useState<'verificando' | 'aprovado' | 'recusado'>(
    'verificando',
  );
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentId = searchParams.get('payment_id');
    const paymentStatus = searchParams.get('status');
    if (!paymentId) {
      console.error('Nenhum ID de pagamento encontrado na URL.');
      setStatus('recusado');
      return;
    }

    if (paymentStatus === 'approved') {
      verifyPayment(paymentId);
    } else {
      setStatus('recusado');
    }
  }, [location.search]);

  const verifyPayment = async (paymentId: string) => {
    try {
      const response = await verifyPaymentStatus(paymentId);
      if (response.status === 'approved') {
        setStatus('aprovado');
      } else {
        setStatus('recusado');
      }
    } catch (error) {
      console.error('Erro ao verificar o status do pagamento:', error);
      setStatus('recusado');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gray-50'>
      {status === 'verificando' && (
        <>
          <Loader2 className='h-24 w-24 text-gray-400 animate-spin mb-6' />
          <h1 className='text-3xl font-bold text-gray-700'>
            Verificando seu pagamento...
          </h1>
          <p className='mt-4 text-lg text-gray-500'>
            Aguarde um momento, estamos confirmando tudo com segurança.
          </p>
        </>
      )}
      {status === 'aprovado' && (
        <>
          <CheckCircle2 className='h-24 w-24 text-green-500 mb-6' />
          <h1 className='text-4xl font-bold text-gray-800'>
            Pagamento Aprovado!
          </h1>
          <p className='mt-4 text-lg text-gray-600'>
            Seu pedido foi recebido e já está sendo preparado.
          </p>
          <Link to='/' className='mt-8'>
            <Button>Voltar ao Início</Button>
          </Link>
        </>
      )}
      {status === 'recusado' && (
        <>
          <XCircle className='h-24 w-24 text-red-500 mb-6' />
          <h1 className='text-4xl font-bold text-gray-800'>
            Ocorreu um Problema
          </h1>
          <p className='mt-4 text-lg text-gray-600'>
            Não foi possível confirmar seu pagamento. Tente novamente ou contate
            o suporte.
          </p>
          <Link to='/' className='mt-8'>
            <Button variant='outline'>Voltar ao Início</Button>
          </Link>
        </>
      )}
    </div>
  );
}
