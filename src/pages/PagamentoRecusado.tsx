import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export function PagamentoRecusadoPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-50'>
      <XCircle className='h-24 w-24 text-red-500 mb-6' />
      <h1 className='text-4xl font-bold text-gray-800'>Falha no Pagamento</h1>
      <p className='mt-4 text-lg text-gray-600'>
        Não foi possível processar seu pagamento.
      </p>
      <p className='mt-2 text-gray-500'>
        Por favor, verifique seus dados ou tente novamente.
      </p>
      <Link to='/' className='mt-8'>
        <Button variant='outline'>Voltar ao Início</Button>
      </Link>
    </div>
  );
}
