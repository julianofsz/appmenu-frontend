import { useState, useEffect, useCallback } from 'react';
import { type Product, type Category } from '@/types';
import { fetchProducts } from '@/services/productService';
import { fetchAllCategories } from '@/services/categoryService';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CategoryStatusCard } from "@/components/common/dash/CategoryStatusCard";
import { ProductManagementCard } from "@/components/common/dash/ProductManagementCard";

const cardColors = [
  'bg-gradient-to-br from-red-800 to-red-950',
  'bg-gradient-to-br from-blue-800 to-blue-950',
  'bg-gradient-to-br from-yellow-800 to-yellow-950',
  'bg-gradient-to-br from-purple-800 to-purple-950',
  'bg-gradient-to-br from-green-800 to-green-950',
  'bg-gradient-to-br from-teal-800 to-teal-950',
];

export function GerenciarProdutosPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  const loadData = useCallback(async () => {
    const [productsData, categoriesData] = await Promise.all([
      fetchProducts(),      
      fetchAllCategories(), 
    ]);
    
    setAllProducts(productsData);
    setCategories(categoriesData);

    if (selectedCategoryId === null && categoriesData.length > 0) {
      setSelectedCategoryId(categoriesData[0]._id);
    }
    setLoading(false);
  }, [selectedCategoryId]); 

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredProducts = selectedCategoryId
    ? allProducts.filter(p => p.category === selectedCategoryId)
    : [];

  const categoryStats = categories.map((category, index) => ({
    id: category._id,
    name: category.nome,
    itemCount: allProducts.filter(p => p.category === category._id).length,
    color: cardColors[index % cardColors.length],
    isActive: category.isActive,
  }));

  if (loading) {
    return <div className="p-6 font-medium text-center text-muted-foreground">Carregando cardápio...</div>;
  }

  return (
    <div className="h-full flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold text-gray-800">Gerenciar Cardápio</h1>
      
      <div className="flex-shrink-0">
        <Carousel opts={{ align: "start" }} className="w-full relative">
          <CarouselContent className="-ml-4 p-1">
            {categoryStats.map((cat) => (
              <CarouselItem key={cat.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <CategoryStatusCard
                  categoryId={cat.id}
                  categoryName={cat.name}
                  itemCount={cat.itemCount}
                  colorClassName={cat.color}
                  isSelected={selectedCategoryId === cat.id}
                  isActive={cat.isActive} 
                  onCardClick={() => setSelectedCategoryId(cat.id)}
                  onUpdate={loadData} 
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="flex-grow bg-white rounded-lg p-6 border shadow-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          
          Produtos em "{categories.find(c => c._id === selectedCategoryId)?.nome || 'Nenhuma'}"
        </h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductManagementCard key={product._id} product={product} onUpdate={loadData} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">Nenhum produto encontrado nesta categoria.</p>
        )}
      </div>
    </div>
  );
}