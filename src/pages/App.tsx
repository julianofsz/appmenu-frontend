import { useLocation } from 'react-router-dom';
import { OpInicio } from '../components/common/OpInicio';
import { SobreInicio } from '../components/common/SobreInicio';

function App() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tableNumber = searchParams.get('table');
  return (
    <div className='flex h-screen flex-col items-center justify-center px-6 pt-24 bg-[#fef1da]'>
      <SobreInicio />
      <OpInicio tableNumber={tableNumber} />
    </div>
  );
}

export default App;
