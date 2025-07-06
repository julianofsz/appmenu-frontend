import { showMassage } from '@/adapters/showMassage';
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  type ReactNode,
} from 'react';

export interface OrderData {
  customerName: string | null;
  customerTelefone: string | null;
  consumitionMethod: 'comer' | 'levar' | null;
  tableNumber: string | null;
  products: { id: string; price: number; quantity: number }[];
}

export interface IOrderContext {
  order: OrderData;
  setConsumitionMethod: (method: 'comer' | 'levar') => void;
  setTableNumber: (table: string) => void;
  finalizeOrder: (finalOrderData: OrderData) => void;
}

const defaultOrderState: IOrderContext = {
  order: {
    customerName: null,
    customerTelefone: null,
    consumitionMethod: null,
    tableNumber: null,
    products: [],
  },
  setConsumitionMethod: () => {},
  setTableNumber: () => {},
  finalizeOrder: () => {},
};

export const OrderContext = createContext<IOrderContext>(defaultOrderState);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [order, setOrder] = useState<OrderData>(defaultOrderState.order);

  const setConsumitionMethod = useCallback((method: 'comer' | 'levar') => {
    setOrder(prev => ({ ...prev, consumitionMethod: method }));
  }, []);

  const setTableNumber = useCallback((table: string) => {
    setOrder(prev => ({ ...prev, tableNumber: table }));
  }, []);

  const finalizeOrder = (finalOrderData: OrderData) => {
    if (
      finalOrderData.consumitionMethod === 'comer' &&
      !finalOrderData.tableNumber
    ) {
      showMassage.info(
        "Número da mesa não definido para um pedido 'Comer aqui'.",
      );
      return;
    }
    if (
      !finalOrderData.customerName ||
      !finalOrderData.customerTelefone ||
      !finalOrderData.consumitionMethod ||
      finalOrderData.products.length === 0
    ) {
      showMassage.info('Faltam informações para completar o pedido!');
      return;
    }
    setOrder(finalOrderData);
  };

  const contextValue: IOrderContext = {
    order,
    setConsumitionMethod,
    setTableNumber,
    finalizeOrder,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};
export const useOrder = (): IOrderContext => {
  return useContext(OrderContext);
};
