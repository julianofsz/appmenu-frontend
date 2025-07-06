import { ChefHatIcon, Minus, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useCartSheet } from '../../contexts/SheetContext';
import { useCartProducts } from '../../contexts/CartProductContext';
import { ScrollArea } from '../ui/scroll-area';
import { type Product } from '@/types';

interface ProdutoDetalhesProps {
  product: Product | null;
  loading: boolean;
}

export default function ProdutoDetalhes({
  product,
  loading,
}: ProdutoDetalhesProps) {
  const [quantity, setQuantity] = useState(1);
  const { openCart } = useCartSheet();
  const { addItemToCart } = useCartProducts();

  if (loading) {
    return (
      <div className='relative z-50 mt-[-1.5rem] rounded-t-3xl p-5 bg-white flex-auto flex flex-col items-center justify-center'>
        <p>Carregando detalhes do produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='relative z-50 mt-[-1.5rem] rounded-t-3xl p-5 bg-white flex-auto flex flex-col items-center justify-center'>
        <p>Produto não encontrado.</p>
      </div>
    );
  }
  const handleDecreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };
  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItemToCart(product, quantity);

    console.log(`Adicionado: ${product.name}, Qtd: ${quantity}`);
    openCart();
  };

  return (
    <div className='relative z-50 mt-[-1.5rem] rounded-t-3xl p-5 bg-white flex-auto flex flex-col overflow-hidden'>
      <div>
        <h2 className='mt-1 text-xl font-semibold'>{product.name}</h2>
        <div className='flex items-center justify-between mt-3'>
          <h3 className='text-xl font-semibold'>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(product!.price)}
          </h3>
          <div className='flex items-center gap-3 text-center'>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={handleDecreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus className='h-4 w-4' />
            </Button>
            <p className='w-4 font-medium text-center'>{quantity}</p>
            <Button
              variant='destructive'
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={handleIncreaseQuantity}
            >
              <Plus className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      <div className='flex-auto overflow-hidden mt-4'>
        <ScrollArea className='h-full pr-1'>
          <div className='space-y-3'>
            <h4 className='font-semibold'>Sobre</h4>
            <p className='text-sm text-muted-foreground'>
              {product!.description}
            </p>
          </div>
          <div className='mt-6 space-y-3'>
            <div className='flex items-center gap-1.5'>
              <ChefHatIcon size={18} />
              <h4 className='font-semibold'>Ingredientes Principais</h4>
            </div>
            <ul className='list-disc pl-5 text-sm text-muted-foreground space-y-1'>
              {product!.ingredients.map((ingredient, index) => (
                <li key={`main-ing-${index}`}>{ingredient}</li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </div>
      <div className='mt-auto pt-4 border-t'>
        <Button className='w-full bg-[#e7000b]' onClick={handleAddToCart}>
          Adicionar {quantity} ao pedido (
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(product!.price * quantity)}
          )
        </Button>
      </div>
    </div>
  );
}
