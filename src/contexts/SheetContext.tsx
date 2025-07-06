import { createContext, useContext, useState, type ReactNode } from 'react';

export interface ICartSheetContext {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}
const defaultState: ICartSheetContext = {
  isCartOpen: false,
  setIsCartOpen: () =>
    console.warn('setIsCartOpen chamado fora do CartSheetProvider'),
  openCart: () => console.warn('openCart chamado fora do CartSheetProvider'),
  closeCart: () =>
    console.warn('closeCart chamado fora do CartSheetProvider'),
};

export const CartSheetContext = createContext<ICartSheetContext>(defaultState);

interface CartSheetProviderProps {
  children: ReactNode;
}

export const CartSheetProvider: React.FC<CartSheetProviderProps> = ({
  children,
}) => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const contextValue: ICartSheetContext = {
    isCartOpen,
    setIsCartOpen,
    openCart,
    closeCart,
  };

  return (
    <CartSheetContext.Provider value={contextValue}>
      {children}
    </CartSheetContext.Provider>
  );
};

export const useCartSheet = (): ICartSheetContext => {
  const context = useContext(CartSheetContext);
  return context;
};
