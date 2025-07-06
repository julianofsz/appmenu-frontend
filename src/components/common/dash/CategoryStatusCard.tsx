import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AlignJustify, Eye, Pencil, ToggleLeft, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { EditCategoryDialog } from './EditCategoryDialog';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';
import { ToggleCategoryDialog } from './ToggleCategoryDialog';

interface CategoryStatusCardProps {
  categoryId: string;
  categoryName: string;
  itemCount: number;
  colorClassName: string;
  isSelected: boolean;
  isActive: boolean;
  onCardClick: () => void;
  onUpdate: () => void;
}

export function CategoryStatusCard({
  categoryId,
  categoryName,
  itemCount,
  isSelected,
  isActive,
  onCardClick,
  onUpdate,
  colorClassName = 'bg-gradient-to-br from-gray-700 to-gray-900',
}: CategoryStatusCardProps) {
  const [isProcessing] = useState(false);

  return (
    <div
      onClick={onCardClick}
      className={cn(
        'min-w-[280px] p-6 rounded-xl flex flex-col justify-between shadow-lg cursor-pointer transition-all',
        isSelected
          ? `text-white ${colorClassName} border-transparent scale-105`
          : 'bg-white border-gray-200 border text-gray-800 hover:border-gray-400',
      )}
    >
      <div className='w-full flex items-center justify-between'>
        <div>
          <h3
            className={cn(
              'text-2xl font-bold',
              isSelected ? 'text-white' : 'text-gray-900',
            )}
          >
            {categoryName}
          </h3>
          <p
            className={cn(
              'text-sm',
              isSelected ? 'text-white/80' : 'text-gray-500',
            )}
          >
            Total de itens: {itemCount}
          </p>
        </div>

        <div className='pt-5'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
              <Button
                variant='ghost'
                size='icon'
                disabled={isProcessing}
                className={cn(
                  'h-8 w-8',
                  isSelected
                    ? 'text-white/70 hover:bg-white/20 hover:text-white'
                    : 'text-gray-500 hover:bg-gray-200',
                )}
              >
                <AlignJustify size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='bg-gray-800 text-white border-gray-700'
            >
              <DropdownMenuItem
                onClick={onCardClick}
                className='flex items-center gap-2 cursor-pointer focus:bg-gray-700'
              >
                <Eye size={14} /> Visualizar itens
              </DropdownMenuItem>
              <EditCategoryDialog
                categoryId={categoryId}
                currentName={categoryName}
                onUpdate={onUpdate}
              >
                <DropdownMenuItem
                  onSelect={e => e.preventDefault()}
                  className='flex items-center gap-2 cursor-pointer focus:bg-gray-700'
                >
                  <Pencil size={14} className='mr-2' /> Editar Nome
                </DropdownMenuItem>
              </EditCategoryDialog>
              <ToggleCategoryDialog
                categoryId={categoryId}
                categoryName={categoryName}
                isActive={isActive}
                onUpdate={onUpdate}
              >
                <DropdownMenuItem
                  onSelect={e => e.preventDefault()}
                  className='flex items-center gap-2 cursor-pointer focus:bg-gray-700'
                >
                  <ToggleLeft size={14} className='mr-2' />

                  {isActive ? 'Desabilitar' : 'Habilitar'}
                </DropdownMenuItem>
              </ToggleCategoryDialog>
              <DeleteCategoryDialog
                categoryId={categoryId}
                categoryName={categoryName}
                onUpdate={onUpdate}
              >
                <DropdownMenuItem
                  onSelect={e => e.preventDefault()}
                  disabled={itemCount > 0}
                  className='flex items-center gap-2 cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <Trash2 size={14} className='mr-2' /> Excluir
                </DropdownMenuItem>
              </DeleteCategoryDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
