import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

export function Voltar() {
  const navigate = useNavigate();
  const handleVoltar = () => {
    navigate(-1);
  };
  return (
    <Button
      onClick={handleVoltar}
      variant='secondary'
      size='icon'
      className='absolute top-4 left-4 rounded-1.2 z-50 min-w-[80px] flex items-center justify-center text-sm font-semibold text-black hover:bg-gray-100 shadow-md'
    >
      <ArrowLeft />
      Voltar
    </Button>
  );
}
