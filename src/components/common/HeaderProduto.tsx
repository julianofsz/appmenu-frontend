import { Voltar } from './Voltar';
import { CartButton } from './CartButtom';
import { type Product } from '@/types';
interface HeaderProdutoProps {
  product: Product | null;
  loading: boolean;
}

export function HeaderProduto({ product, loading }: HeaderProdutoProps) {
  if (loading) {
    return (
      <div className='relative min-h-[300px] w-full bg-muted animate-pulse'>
        <Voltar />
      </div>
    );
  }

  const imageUrl = product
    ? `http://localhost:5000/images/produtos/${product.imageUrl}`
    : '/a.png';
  const altText = product ? product.name : 'Imagem do produto';

  return (
    <div className='relative min-h-[300px] w-full'>
      <Voltar />
      <img
        src={imageUrl}
        alt={altText}
        className='absolute inset-0 h-full w-full object-cover'
      />
      <CartButton />
    </div>
  );
}
