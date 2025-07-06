import { useState, useEffect } from 'react';
import { HeaderProduto } from '../components/common/HeaderProduto';
import ProdutoDetalhes from '../components/common/ProdutoDetalhes';
import { fetchProductById } from '@/services/productService';
import { type Product } from '@/types';
import { useLocation } from 'react-router-dom';

function App3() {
  const location = useLocation();
  const productId = location.state?.productId;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        console.log('Aguardando um productId válido...');
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await fetchProductById(productId);
      setProduct(data);
      setLoading(false);
    };

    loadProduct();
  }, [productId]);

  return (
    <div className='flex h-full flex-col'>
      {/* Os componentes filhos recebem os dados e o estado de loading */}
      <HeaderProduto product={product} loading={loading} />
      <ProdutoDetalhes product={product} loading={loading} />
    </div>
  );
}

export default App3;
