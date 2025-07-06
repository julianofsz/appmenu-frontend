// Em components/common/HeaderProduto.tsx

import { Button } from "../ui/button";
import { useCartSheet } from "../../contexts/SheetContext";
import { ShoppingCart } from "lucide-react";

export function CartButton() {
  const { openCart } = useCartSheet();
  return (
      <Button
        variant='secondary'
        size='icon'
        className='absolute top-4 right-4 rounded-1.2 z-50 min-w-[100px] flex items-center justify-center text-sm font-semibold text-black hover:bg-gray-100 shadow-md'
        onClick={openCart}
      >
        <ShoppingCart />
        Ver Pedido
      </Button>
  );
}