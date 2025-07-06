// Seu componente CartProduct.tsx modificado
import { Minus, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import {
  useCartProducts,
  type CartItem,
} from '../../contexts/CartProductContext';

interface CartProductProps {
  item: CartItem;
}

export function CartProduct({ item }: CartProductProps) {
  const { updateItemQuantity, removeItemFromCart } = useCartProducts();

  const handleIncrease = () => updateItemQuantity(item._id, item.quantity + 1);
  const handleDecrease = () => updateItemQuantity(item._id, item.quantity - 1);
  const handleRemove = () => removeItemFromCart(item._id);
  const fullImageUrl = item.imageUrl
    ? `http://localhost:5000/images/produtos/${item.imageUrl}`
    : '/logosnack.png';
  return (
    <div className='flex items-center justify-between p-0.5 border rounded-md'>
      <img
        src={fullImageUrl}
        alt={item.name}
        width={60}
        height={60}
        className='object-cover rounded'
      />
      <div className='flex-grow space-y-1 ml-3'>
        <p className=' font-semibold text-xs'>{item.name}</p>
        <p className='text-xs text-muted-foreground'>
          Unit:{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(item.price)}
        </p>
        <p className='text-sm font-semibold'>
          Total:{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(item.price * item.quantity)}
        </p>
      </div>
      <div className='p-0.5 flex flex-col items-end space-y-2'>
        <div className='w-full flex items-center gap-1 text-center'>
          <Button
            size='icon'
            className='h-7 w-7'
            variant={'outline'}
            onClick={handleDecrease}
          >
            <Minus size={20} />
          </Button>
          <p className='w-7 text-sm font-medium text-center'>{item.quantity}</p>
          <Button
            size='icon'
            className='h-7 w-7'
            variant='destructive'
            onClick={handleIncrease}
          >
            <Plus size={20} />
          </Button>
          
        </div>
       
        <Button
          className='w-full h-8 px-1 bg-[#e7000b] text-lg'
          onClick={handleRemove}
        >
          Remover
        </Button>
      </div>
    </div>
  );
}
