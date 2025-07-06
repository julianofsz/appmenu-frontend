import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface OpInicioProps {
  tableNumber: string | null;
}

export function OpInicio({ tableNumber }: OpInicioProps) {
  const tableQueryParam = tableNumber ? `&table=${tableNumber}` : '';

  return (
    <div className='pt-14 grid grid-cols-2 gap-4'>
      <Card>
        <CardContent className='flex flex-col items-center gap-8 py-8'>
          <img src='/comer.png' alt='Comer aqui' width={78} height={80} />
          <Link to={`/App2?op=comer${tableQueryParam}`}>
            <Button
              variant='destructive'
              className='rounded-1.2 px-4 py-2 text-lg min-w-[120px]'
            >
              Comer no local
            </Button>
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='flex flex-col items-center gap-8 py-8'>
          <img src='/levar.png' alt='Levar para casa' width={78} height={80} />
          <Link to={`/App2?op=levar${tableQueryParam}`}>
            <Button
              variant='destructive'
              className='rounded-1.2 px-4 py-2 text-lg min-w-[120px]'
            >
              Para levar
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
