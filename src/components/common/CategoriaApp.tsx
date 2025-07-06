import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { type Category } from '@/types';
import { ClockIcon } from 'lucide-react';

interface CategoriaAppProps {
  storeName: string;
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function CategoriaApp({
  storeName,
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoriaAppProps) {
  const displayList = [{ _id: 'all', id: 'all', nome: 'Todos' }, ...categories];

  return (
    <div className='relative z-50 mt-[-1.5rem] rounded-t-3xl bg-white'>
      <div className='p-5'>
        <div className='flex items-center gap-3'>
          <img src='/logosnack.png' alt='logosnack' height={45} width={45} />
          <div>
            <h2 className='text-lg font-bold'>{storeName || 'Snack King'}</h2>
            <p className='text-xs opacity-55'>Serviços de alimentação</p>
          </div>
        </div>
        <div className='flex items-center gap-1 text-xs text-green-500 mt-3'>
          <ClockIcon size={16} />
          <p>Aberto!</p>
        </div>
      </div>
      <ScrollArea className='w-full'>
        <div className='flex w-max space-x-3 p-4 pt-0'>
          {displayList.map(category => (
            <Button
              key={category._id}
              onClick={() => onSelectCategory(category._id)}
              variant={
                selectedCategoryId === category._id ? 'default' : 'secondary'
              }
              size='sm'
              className={`rounded-full ${
                selectedCategoryId === category._id
                  ? 'bg-[#e7000b] text-white'
                  : ''
              }`}
            >
              {category.nome}
            </Button>
          ))}
        </div>
        <ScrollBar orientation='horizontal' className='hidden' />
      </ScrollArea>
    </div>
  );
}
