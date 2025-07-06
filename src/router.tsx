import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import App2 from './pages/App2';
import App3 from './pages/App3';
import { useEffect } from 'react';
import App4 from './pages/App4';
import { CartSheetProvider } from './contexts/SheetContext';
import Layout from './pages/Layout';
import { CartProductProvider } from './contexts/CartProductContext';
import { OrderProvider } from './contexts/OrderContext';
import DashboardLayout from './pages/DashboardLayout';
import App from './pages/App';
import { CriarCategoriasPage } from './pages/dashboard/CriarCatategoriasPage';
import { CriarProdutosPage } from './pages/dashboard/CriarProdutosPage';
import { AtualizarRestaurantePage } from './pages/dashboard/AtualizarRestaurantePage';
import { GerenciarProdutosPage } from './pages/dashboard/GerenciarProdutosPage';
import { GerenciarPedidosPage } from './pages/dashboard/GerenciarPedidosPage';
import { MesasPage } from './pages/dashboard/MesasPage';
import LoginPage from './pages/dashboard/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { PagamentoAceitoPage } from './pages/PagamentoAceitoPage';
import { PagamentoRecusadoPage } from './pages/PagamentoRecusado';
import { MessagesContainer } from './components/common/MessagesContainer';
import { FechamentoCaixaPage } from './pages/dashboard/FechamentoCaixaPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export function Router() {
  return (
    <CartSheetProvider>
      <CartProductProvider>
        <OrderProvider>
          <BrowserRouter>
            <Layout>
              <AuthProvider>
                <MessagesContainer>
                  <Routes>
                    <Route path='/' element={<App />} />{' '}
                    {/* Rota para sua página inicial */}
                    {/*gerar gatilho */}
                    <Route path='/App2/' element={<App2 />} />
                    <Route path='/App3/' element={<App3 />} />
                    <Route path='/App4/' element={<App4 />} />
                    <Route
                      path='/pedido/sucesso'
                      element={<PagamentoAceitoPage />}
                    />
                    <Route
                      path='/pedido/falha'
                      element={<PagamentoRecusadoPage />}
                    />
                    {/* Rota para o Layout do Dashboard */}
                    <Route path='/login' element={<LoginPage />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path='/dashboard' element={<DashboardLayout />}>
                        {/* Rotas filhas: serão renderizadas onde o <Outlet> está */}
                        <Route index element={<GerenciarPedidosPage />} />
                        <Route
                          path='pedidos'
                          element={<GerenciarPedidosPage />}
                        />
                        <Route
                          path='produtos'
                          element={<GerenciarProdutosPage />}
                        />
                        <Route path='mesas' element={<MesasPage />} />
                        <Route
                          path='criarProdutos'
                          element={<CriarProdutosPage />}
                        />
                        <Route
                          path='criarCategorias'
                          element={<CriarCategoriasPage />}
                        />
                        <Route
                          path='restaurante'
                          element={<AtualizarRestaurantePage />}
                        />
                        <Route path='caixa' element={<FechamentoCaixaPage />} />
                      </Route>
                    </Route>
                  </Routes>
                </MessagesContainer>
                <ScrollToTop />
              </AuthProvider>
            </Layout>
          </BrowserRouter>
        </OrderProvider>
      </CartProductProvider>
    </CartSheetProvider>
  );
}
