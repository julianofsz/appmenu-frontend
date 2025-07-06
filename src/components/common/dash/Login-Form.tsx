import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flame } from 'lucide-react';
import { useState, useContext } from 'react';
import { Context } from '@/contexts/AuthContext';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { login } = useContext(Context)!;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login({ email, password });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='w-full max-w-lg shadow-lg'>
        <CardHeader className='text-center p-8 space-y-2'>
          <Flame className='mx-auto h-12 w-12 text-amber-500' />
          <CardTitle className='text-3xl font-bold'>Snack Dash</CardTitle>
          <CardDescription>Acesso ao painel de gerenciamento</CardDescription>
        </CardHeader>
        <CardContent className='p-8'>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='admin@example.com'
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='password'>Senha</Label>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className='flex flex-col gap-3'>
                <Button
                  type='submit'
                  className='w-full bg-amber-500 text-gray-900 font-semibold hover:bg-amber-600 h-12 text-lg'
                >
                  Entrar no Painel
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
