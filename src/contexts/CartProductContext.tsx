import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  type ReactNode,
} from 'react';
import { type Product } from '@/types';

export interface CartItem extends Product {
  quantity: number;
}

export interface ICartContext {
  cartItems: CartItem[];
  addItemToCart: (product: Product, quantity: number) => void;
  updateItemQuantity: (productId: string, newQuantity: number) => void;
  removeItemFromCart: (productId: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

const defaultCartState: ICartContext = {
  cartItems: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
  removeItemFromCart: () => {},
  clearCart: () => {},
  totalPrice: 0,
};

export const CartProductContext = createContext<ICartContext>(defaultCartState);

export const CartProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addItemToCart = useCallback((product: Product, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);

      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  }, []);

  const updateItemQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeItemFromCart(productId);
        return;
      }
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    },
    [],
  );

  const removeItemFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const contextValue: ICartContext = {
    cartItems,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart,
    totalPrice,
  };

  return (
    <CartProductContext.Provider value={contextValue}>
      {children}
    </CartProductContext.Provider>
  );
};

export const useCartProducts = (): ICartContext => {
  return useContext(CartProductContext);
};
