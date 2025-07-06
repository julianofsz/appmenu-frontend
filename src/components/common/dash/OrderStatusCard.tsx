import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface OrderStatusCardProps {
  statusName: string;
  orderCount: number;
  Icon: LucideIcon;
  colorClassName: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function OrderStatusCard({
  statusName,
  orderCount,
  Icon,
  colorClassName,
  isSelected,
  onSelect,
}: OrderStatusCardProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'p-6 rounded-xl flex items-center justify-between cursor-pointer transition-all border-2',
        isSelected
          ? `shadow-lg scale-105 ${colorClassName}`
          : 'bg-white border-gray-200 hover:border-gray-400',
      )}
    >
      <div>
        <h3
          className={cn(
            'text-lg font-semibold',
            isSelected ? 'text-white' : 'text-gray-600',
          )}
        >
          {statusName}
        </h3>
        <p
          className={cn(
            'text-3xl font-bold',
            isSelected ? 'text-white' : 'text-gray-900',
          )}
        >
          {orderCount}
        </p>
      </div>
      <Icon
        className={cn(
          'h-10 w-10',
          isSelected ? 'text-white/80' : 'text-gray-400',
        )}
      />
    </div>
  );
}
