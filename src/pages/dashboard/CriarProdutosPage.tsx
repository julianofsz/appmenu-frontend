import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { fetchAllCategories } from '@/services/categoryService';
import { type Category } from '@/types';
import { createProduct } from '@/services/productService';
import { showMassage } from '@/adapters/showMassage';

const productFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  price: z.coerce
    .number()
    .positive({ message: 'O preço deve ser um número positivo.' }),
  description: z
    .string()
    .min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.' }),
  ingredients: z
    .string()
    .min(3, { message: 'Liste pelo menos um ingrediente.' }),
  category: z.string({ required_error: 'Selecione uma categoria.' }),
  image: z.instanceof(File, { message: 'A imagem é obrigatória.' }),
});

type ProductFormData = z.infer<typeof productFormSchema>;

export function CriarProdutosPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { name: '', price: 0, description: '', ingredients: '' },
  });

  useEffect(() => {
    fetchAllCategories().then(setCategories);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    form.reset();
    setImagePreview(null);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

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
      const newProduct = await createProduct(formData);
      showMassage.success(`Produto "${newProduct.name}" criado com sucesso!`);
      handleCancel();
    } catch (error) {
      showMassage.error(
        'Falha ao criar o produto. Verifique o console para mais detalhes.',
      );
      console.error('Erro ao criar produto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='w-full h-full flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl bg-white p-8 rounded-xl border border-gray-200 shadow-lg'>
        <h2 className='text-3xl font-bold text-gray-900 text-center mb-8'>
          Criar Novo Produto
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                name='image'
                control={form.control}
                render={() => (
                  <FormItem className='flex flex-col items-center justify-center'>
                    <FormLabel className='text-sm font-medium text-gray-700 mb-2'>
                      Imagem do Produto
                    </FormLabel>
                    <FormControl>
                      <label
                        htmlFor='image-upload'
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
                          id='image-upload'
                          type='file'
                          accept='image/png, image/jpeg'
                          className='hidden'
                          onChange={handleImageChange}
                        />
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='space-y-6'>
                <FormField
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto</FormLabel>
                      <FormControl>
                        <Input placeholder='Ex: X-Bacon Supremo' {...field} />
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
                        <Input
                          type='number'
                          step='0.01'
                          placeholder='Ex: 25.50'
                          {...field}
                        />
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
                    <Textarea
                      placeholder='Descreva o produto...'
                      {...field}
                      rows={4}
                    />
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
                    <Textarea
                      placeholder='Ex: Pão, Queijo, Hambúrguer, Bacon'
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-center justify-end gap-4 pt-4'>
              <Button
                type='button'
                variant='destructive'
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                className='bg-amber-500 text-gray-900 font-semibold hover:bg-amber-600'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Criando...' : 'Criar Produto'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
