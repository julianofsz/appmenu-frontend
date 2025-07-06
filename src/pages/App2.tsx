import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CategoriaApp } from '../components/common/CategoriaApp';
import { HeaderApp } from '../components/common/HeaderApp';
import { ProdutoApp } from '../components/common/ProdutoApp';
import { useOrder } from '@/contexts/OrderContext';
import { type Product } from '@/types/Product.types';
import { fetchProducts } from '@/services/productService';
import { type Category } from '@/types/Category.types';
import { fetchAllCategories } from '@/services/categoryService';
import { type RestaurantConfig } from '@/types/RestaurantConfig.types';
import { fetchRestaurantConfig } from '@/services/restaurantConfigService';

function App2() {
  const [searchParams] = useSearchParams();
  const { setConsumitionMethod, setTableNumber } = useOrder();
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const op = searchParams.get('op');
    const tableFromUrl = searchParams.get('table');
    const tableFromSession = sessionStorage.getItem('tableNumber');
    if (op === 'comer' || op === 'levar') {
      setConsumitionMethod(op as 'comer' | 'levar');
    }

    const finalTable = tableFromUrl || tableFromSession;
    if (finalTable) {
      setTableNumber(finalTable);
      sessionStorage.setItem('tableNumber', finalTable);
    }

    const loadInitialData = async () => {
      setIsLoading(true);
      const [configData, categoriesData, productsData] = await Promise.all([
        fetchRestaurantConfig(),
        fetchAllCategories(),
        fetchProducts(),
      ]);
      setConfig(configData);
      setAllCategories(categoriesData);
      setAllProducts(productsData);
      setIsLoading(false);
    };

    loadInitialData();
  }, [searchParams, setConsumitionMethod, setTableNumber]);

  const availableCategories = allCategories.filter(
    category => category.isActive,
  );
  const activeCategoryIds = new Set(availableCategories.map(cat => cat._id));
  const displayableProducts = allProducts.filter(product => {
    if (!product.isAvailable) {
      return false;
    }
    return activeCategoryIds.has(product.category);
  });

  const filteredProducts =
    selectedCategoryId === 'all'
      ? displayableProducts // Se "Todos", mostra todos os produtos já filtrados pelas regras acima
      : displayableProducts.filter(p => p.category === selectedCategoryId); // Senão, filtra por ID

  if (isLoading) {
    return (
      <>
        <HeaderApp imageUrl={config?.storeHouseUrl || ''} />
        <CategoriaApp
          storeName={config?.storeName || 'Carregando...'}
          categories={[]}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
        <div className='p-4 text-center text-muted-foreground'>
          Carregando...
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderApp imageUrl={config?.storeHouseUrl || ''} />
      <CategoriaApp
        storeName={config?.storeName || 'Carregando...'}
        categories={availableCategories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      <div className='p-4'>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(productItem => (
            <ProdutoApp key={productItem._id} product={productItem} />
          ))
        ) : (
          <p className='text-center text-muted-foreground'>
            Nenhum produto disponível nesta categoria.
          </p>
        )}
      </div>
    </>
  );
}

export default App2;
