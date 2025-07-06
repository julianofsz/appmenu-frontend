import { Voltar } from './Voltar';
import { CartButton } from './CartButtom';

interface HeaderAppProps {
  imageUrl: string;
}

export function HeaderApp({ imageUrl }: HeaderAppProps) {
  const fullImageUrl = imageUrl
    ? `http://localhost:5000/images/configuracao/${imageUrl}`
    : '/snackhause.png';

  return (
    <>
      <div className='relative h-[250px] w-full'>
        <Voltar />
        <img
          src={fullImageUrl}
          alt='Fachada do restaurante'
          className='h-full w-full object-cover'
        />
        <CartButton />
      </div>
    </>
  );
}
