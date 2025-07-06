import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Upload } from 'lucide-react';
import {
  fetchRestaurantConfig,
  updateRestaurantConfig,
} from '@/services/restaurantConfigService';
import { showMassage } from '@/adapters/showMassage';

const nameFormSchema = z.object({
  storeName: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
});
type NameFormData = z.infer<typeof nameFormSchema>;

export function AtualizarRestaurantePage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [housePreview, setHousePreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [houseFile, setHouseFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<NameFormData>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: { storeName: '' },
  });

  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      const data = await fetchRestaurantConfig();
      if (data) {
        form.reset({ storeName: data.storeName });
        setLogoPreview(
          data.storeLogoUrl
            ? `http://localhost:5000/images/configuracao/${data.storeLogoUrl}`
            : null,
        );
        setHousePreview(
          data.storeHouseUrl
            ? `http://localhost:5000/images/configuracao/${data.storeHouseUrl}`
            : null,
        );
      }
      setLoading(false);
    };
    loadConfig();
  }, [form]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setImagePreview: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (imageType: 'storeLogo' | 'storeHouse') => {
    const file = imageType === 'storeLogo' ? logoFile : houseFile;
    if (!file) {
      showMassage.warning(`Nenhuma nova imagem selecionada.`);
      return;
    }

    setIsUpdating(true);
    const formData = new FormData();
    formData.append(imageType, file);

    try {
      await updateRestaurantConfig(formData);
      showMassage.success(`Imagem atualizada com sucesso!`);
    } catch (error) {
      console.error(`Erro ao atualizar a imagem:`, error);
      showMassage.error(`Falha ao atualizar a imagem.`);
    } finally {
      setIsUpdating(false);
    }
  };

  const onNameSubmit = async (data: NameFormData) => {
    setIsUpdating(true);
    const formData = new FormData();
    formData.append('storeName', data.storeName);

    try {
      await updateRestaurantConfig(formData);
      showMassage.success(`Nome do restaurante atualizado com sucesso!`);
    } catch (error) {
      console.log(`Erro ao atualizar o nome:`, error);
      showMassage.error(`Falha ao atualizar o nome.`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div className='p-6 text-center'>Carregando configurações...</div>;
  }
  return (
    <div className='w-full h-full flex items-center justify-center p-4'>
      <div className='w-full max-w-3xl bg-white p-8 rounded-xl border border-gray-200 shadow-lg text-gray-900'>
        <h2 className='text-3xl font-bold text-center mb-8'>
          Atualizar Restaurante
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Logo do Restaurante
            </label>
            <div className='relative group'>
              <img
                src={logoPreview || '/logosnack.png'}
                alt='Preview do Logo'
                className='w-full h-40 object-contain rounded-lg bg-gray-100 p-2 border'
              />
              <label
                htmlFor='logo-upload'
                className='absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg'
              >
                <Upload className='h-8 w-8 mr-2' /> Trocar Imagem
              </label>
              <Input
                id='logo-upload'
                type='file'
                accept='image/png, image/jpeg'
                className='hidden'
                onChange={e =>
                  handleImageChange(e, setLogoFile, setLogoPreview)
                }
              />
            </div>
            <Button
              size='sm'
              className='w-full hover:bg-blue-w-full bg bg-amber-500 text-gray-900 font-semibold hover:bg-amber-600'
              onClick={() => handleImageUpload('storeLogo')}
              disabled={isUpdating || !logoFile}
            >
              {isUpdating ? 'Salvando...' : 'Salvar Logo'}
            </Button>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Imagem da Fachada
            </label>
            <div className='relative group'>
              <img
                src={housePreview || '/snackhause.png'}
                alt='Preview da Fachada'
                className='w-full h-40 object-cover rounded-lg bg-gray-100 border'
              />
              <label
                htmlFor='house-upload'
                className='absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg'
              >
                <Upload className='h-8 w-8 mr-2' /> Trocar Imagem
              </label>
              <Input
                id='house-upload'
                type='file'
                accept='image/png, image/jpeg'
                className='hidden'
                onChange={e =>
                  handleImageChange(e, setHouseFile, setHousePreview)
                }
              />
            </div>
            <Button
              size='sm'
              className='w-full bg bg-amber-500 text-gray-900 font-semibold hover:bg-amber-600'
              onClick={() => handleImageUpload('storeHouse')}
              disabled={isUpdating || !houseFile}
            >
              {isUpdating ? 'Salvando...' : 'Salvar Fachada'}
            </Button>
          </div>
        </div>

        <div className='border-t border-gray-200 pt-8'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onNameSubmit)}
              className='flex items-end gap-4'
            >
              <FormField
                name='storeName'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='flex-grow'>
                    <FormLabel className='text-gray-700'>
                      Nome do Restaurante
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Digite o nome do restaurante...'
                        {...field}
                        className='bg-gray-50'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='bg-amber-500 text-gray-900 font-semibold hover:bg-amber-600 h-[42px]'
                disabled={isUpdating}
              >
                {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
