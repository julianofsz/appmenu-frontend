import { useState, useContext } from 'react';
import {
  ClipboardList,
  Package,
  Table,
  PlusCircle,
  LogOut,
  /*Store, não está sendo usado*/
  ChevronDown,
  Hamburger,
  Banknote,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Context as AuthContext } from '@/contexts/AuthContext';

const menuItems = [
  {
    title: 'Gerenciar pedidos',
    icon: ClipboardList,
    path: '/dashboard/pedidos',
  },
  { title: 'Relatório de Vendas', icon: Banknote, path: '/dashboard/caixa' },
  { title: 'Mesas', icon: Table, path: '/dashboard/mesas' },

  {
    title: 'Gerenciar produtos e categorias',
    icon: Package,
    path: '/dashboard/produtos',
  },

  {
    title: 'Criar',
    icon: PlusCircle,
    subItems: [
      { title: 'Produtos', path: '/dashboard/criarProdutos' },
      { title: 'Categorias', path: '/dashboard/criarCategorias' },
    ],
  },
  /*{
    title: 'Atualizar restaurante',
    icon: Store,
    path: '/dashboard/restaurante',
  }, remoção temporiaria*/
];

export function SidebarSnack() {
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const { logout } = useContext(AuthContext)!;

  const handleMenuClick = (title: string) => {
    setOpenSubMenu(prev => (prev === title ? null : title));
  };

  return (
    <aside className='w-[25%] h-screen flex flex-col bg-gray-50 text-gray-800 p-4 border-r border-gray-200'>
      <div className='flex items-center gap-3 mb-8 px-2'>
        <Hamburger className='h-8 w-8 text-amber-500' />
        <h1 className='text-2xl font-bold text-gray-900'>Snack Dash</h1>
      </div>

      <nav className='flex-grow'>
        <ul className='space-y-2'>
          {menuItems.map(item => (
            <li key={item.title}>
              {!item.subItems && item.path && (
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                    location.pathname === item.path
                      ? 'bg-amber-500 text-white font-semibold shadow-sm'
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  <item.icon className='h-5 w-5' />
                  <span>{item.title}</span>
                </Link>
              )}

              {item.subItems && (
                <>
                  <button
                    onClick={() => handleMenuClick(item.title)}
                    className='w-full flex items-center justify-between rounded-lg p-3 transition-colors text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  >
                    <div className='flex items-center gap-3'>
                      <item.icon className='h-5 w-5' />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        openSubMenu === item.title ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openSubMenu === item.title && (
                    <ul className='pl-8 pt-2 space-y-1'>
                      {item.subItems.map(subItem => (
                        <li key={subItem.title}>
                          <Link
                            to={subItem.path}
                            className={`block w-full rounded-md p-2 text-sm transition-colors ${
                              location.pathname === subItem.path
                                ? 'bg-amber-100 text-amber-700 font-medium'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div>
        <button
          onClick={logout}
          className='w-full flex items-center gap-3 rounded-lg p-3 text-gray-600 transition-colors hover:bg-red-100 hover:text-red-700'
        >
          <LogOut className='h-5 w-5' />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
