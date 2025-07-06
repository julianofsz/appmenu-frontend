import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useOrder } from '../../contexts/OrderContext';
import { useCartProducts } from '@/contexts/CartProductContext';
import { createOrder } from '@/services/pedidoService';
import { createPaymentPreference } from '@/services/paymentService';
import { type CreateOrderPayload } from '@/types';
import { showMassage } from '@/adapters/showMassage';
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  telefone: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export function FinishCart(): React.ReactNode {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', telefone: '' },
  });

  const { cartItems, clearCart } = useCartProducts();
  const { order } = useOrder();

  const onSubmit = async (data: FormSchema) => {
    setIsProcessing(true);

    const orderPayload: CreateOrderPayload = {
      customerName: data.name,
      customerTelefone: data.telefone,
      products: cartItems.map(item => ({
        id: item._id,
        quantity: item.quantity,
      })),
      consumitionMethod: order.consumitionMethod!,
      tableNumber: order.tableNumber,
    };

    try {
      const pedidoCriado = await createOrder(orderPayload);
      console.log('Pedido criado no banco:', pedidoCriado);

      const paymentPayload = {
        orderId: pedidoCriado._id,
        items: pedidoCriado.products,
        payerInfo: {
          name: pedidoCriado.customerName,
          email: data.email,
        },
      };
      const paymentUrl = await createPaymentPreference(paymentPayload);

      clearCart();
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Falha no processo de finalização:', error);
      let errorMessage = 'Ocorreu um erro inesperado.';
      if (error instanceof AxiosError && error.response) {
        errorMessage = `Erro: ${
          error.response.data.message || 'Falha ao se comunicar com o servidor.'
        }`;
      }
      showMassage.error(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className='w-full bg-[#e7000b] mt-4'>Finalizar Pedido</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='text-center'>
          <DrawerTitle>Quase lá!</DrawerTitle>
          <DrawerDescription>
            Preencha seus dados para o pagamento.
          </DrawerDescription>
        </DrawerHeader>

        <div className='p-5'>
          <Form {...form}>
            <form
              id='finish-cart-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder='Digite seu nome...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail (para o recibo)</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='seu-email@exemplo.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='telefone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder='(XX) XXXXX-XXXX' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type='submit'
            form='finish-cart-form'
            disabled={isProcessing}
            className='w-full bg-[#e7000b]'
          >
            {isProcessing ? 'Processando...' : 'Ir para o Pagamento'}
          </Button>
          <DrawerClose asChild>
            <Button variant='outline' disabled={isProcessing}>
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
