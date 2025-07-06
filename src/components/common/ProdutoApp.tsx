import { type Product } from '@/types';
import { Link } from 'react-router-dom';

interface ProdutoAppProps {
  product: Product;
}

export function ProdutoApp({ product }: ProdutoAppProps) {
  if (!product) {
    return <p>Dados do produto não fornecidos.</p>;
  }
  if (!product._id) {
    console.error('Produto na lista está sem ID:', product);
    return (
      <div className='p-4 border-b text-red-500'>
        Produto inválido (sem ID) encontrado.
      </div>
    );
  }
  return (
    <div className='space-y-3 px-1.5'>
      <Link
        to={`/App3`}
        state={{ productId: product._id }}
        className='flex items-center justify-between gap-10 py-3 border-b'
      >
        <div>
          <h3 className='text-sm font-medium'>{product.name}</h3>
          <p className='line-clamp-2 text-sm text-muted-foreground'>
            {product.description}
          </p>
          <p className='pt-3 text-sm font-semibold'>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(product.price)}
          </p>
        </div>

        <div className='relative min-h-[80px] min-w-[120px] flex-shrink-0'>
          <img
            src={`http://localhost:5000/images/produtos/${product.imageUrl}`}
            alt={product.name}
            className='absolute inset-0 h-full w-full rounded-md object-cover'
          />
        </div>
      </Link>
    </div>
  );
}
