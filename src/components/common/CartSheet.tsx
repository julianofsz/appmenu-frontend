// Em CartSheet.tsx (ou onde você lista os produtos do carrinho)
import { useCartSheet } from '../../contexts/SheetContext';
import {
  useCartProducts,
  type CartItem,
} from '../../contexts/CartProductContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { CartProduct } from './CartProduct';
import { ScrollArea } from '../ui/scroll-area';
import { ShoppingBagIcon } from 'lucide-react';
import { FinishCart } from './FinishCart';

export function CartSheet(): React.ReactNode {
  const { isCartOpen, setIsCartOpen } = useCartSheet();
   const { cartItems, totalPrice } = useCartProducts();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className='w-[85%] flex flex-col'>
        <SheetHeader>
          <SheetTitle className='flex items-center justify-center gap-2 font-bold text-2xl'>
            <ShoppingBagIcon className='h-5 w-5 text-[#e7000b]' />
            <span>Meu Pedido</span>
          </SheetTitle>
          <SheetDescription>
            {cartItems.length > 0
              ? 'Confira os itens do seu pedido.'
              : 'Seu pedido está vazio.'}
          </SheetDescription>
        </SheetHeader>

        {cartItems.length > 0 ? (
          <ScrollArea className='flex-grow my-4'>
            <div className='space-y-4 pr-2'>
              {cartItems.map((item: CartItem) => (
                <CartProduct key={item._id} item={item} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className='flex-grow flex items-center justify-center'>
            <p>Nenhum item adicionado ainda.</p>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className='border-t pt-4 mt-auto'>
            <div className='flex justify-between font-bold text-2xl px-1'>
              <span>Valor total:</span>
              <span>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
              </span>
            </div>
            <FinishCart />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
