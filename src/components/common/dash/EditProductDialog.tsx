import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UploadCloud } from 'lucide-react';
import { type Product, type Category } from '@/types';
import { updateProduct } from '@/services/productService';
import { fetchAllCategories } from '@/services/categoryService';
import { showMassage } from '@/adapters/showMassage';

const productFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  price: z.coerce
    .number()
    .positive({ message: 'O preço deve ser um número positivo.' }),
  description: z.string().min(10, { message: 'A descrição é muito curta.' }),
  ingredients: z
    .string()
    .min(3, { message: 'Liste pelo menos um ingrediente.' }),
  category: z.string({ required_error: 'Selecione uma categoria.' }),
  image: z.instanceof(File).optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface EditProductDialogProps {
  product: Product;
  children: React.ReactNode;
  onUpdate: () => void;
}

export function EditProductDialog({
  product,
  children,
  onUpdate,
}: EditProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(
    `http://localhost:5000/images/produtos/${product.imageUrl}`,
  );

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name || '',
      price: product.price || 0,
      description: product.description || '',
      ingredients: product.ingredients?.join(', ') || '',
      category: product.category || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchAllCategories().then(setCategories);
    }
  }, [isOpen]);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const onSubmit = async (data: ProductFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', String(data.price));
    formData.append('description', data.description);
    formData.append('category', data.category);

    const ingredientsArray = data.ingredients
      .split(',')
      .map(ing => ing.trim())
      .filter(ing => ing);
    formData.append('ingredients', JSON.stringify(ingredientsArray));

    if (data.image) {
      formData.append('image', data.image);
    }

    try {
      await updateProduct(product._id, formData);
      showMassage.success(`Produto "${data.name}" atualizado com sucesso!`);
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      showMassage.error('Falha ao atualizar o produto.');
      console.error('Erro ao atualizar produto:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-3xl bg-white text-gray-900 border-gray-200'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>
            Editar Produto: {product.name}
          </DialogTitle>
          <DialogDescription>
            Altere as informações abaixo e clique em salvar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='edit-product-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 max-h-[70vh] overflow-y-auto pr-4'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Upload de Imagem */}
              <div className='flex flex-col items-center justify-center'>
                <FormLabel className='text-sm font-medium text-gray-700 mb-2'>
                  Imagem do Produto
                </FormLabel>
                <FormControl>
                  <label
                    htmlFor={`image-edit-${product._id}`}
                    className='w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-gray-100 transition'
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt='Pré-visualização'
                        className='h-full w-full object-cover rounded-md'
                      />
                    ) : (
                      <div className='text-center text-gray-500'>
                        <UploadCloud className='mx-auto h-12 w-12' />
                        <p>Clique para enviar</p>
                      </div>
                    )}
                    <Input
                      id={`image-edit-${product._id}`}
                      type='file'
                      accept='image/png, image/jpeg'
                      className='hidden'
                      onChange={handleImageChange}
                    />
                  </label>
                </FormControl>
                <FormMessage />
              </div>
              <div className='space-y-4'>
                <FormField
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='price'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input type='number' step='0.01' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione uma categoria' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='ingredients'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredientes (separados por vírgula)</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className='pt-4 border-t mt-4'>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type='submit'
            form='edit-product-form'
            className='bg-amber-500 hover:bg-amber-600'
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
