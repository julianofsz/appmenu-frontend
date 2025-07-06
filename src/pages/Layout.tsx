// Layout.tsx MODIFICADO
import { CartSheet } from '../components/common/CartSheet';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='flex h-full flex-col'>
      <main className='flex h-full flex-col'>{children}</main>
      <CartSheet />
    </div>
  );
};

export default Layout;
