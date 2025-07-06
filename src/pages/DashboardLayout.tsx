import { SidebarSnack } from '@/components/common/dash/SidebarSnack';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <SidebarSnack />
      <main className='flex-1 p-6 overflow-y-auto'>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
