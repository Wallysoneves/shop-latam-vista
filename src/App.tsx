import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { OrderProvider } from "./contexts/OrderContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CustomerProvider } from "./contexts/CustomerContext";
import PrivateRoute from "./components/PrivateRoute";

// Customer pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import AccessDeniedPage from "./pages/AccessDeniedPage";

// Seller pages
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerProductCreate from "./pages/seller/SellerProductCreate";
import SellerProductEdit from "./pages/seller/SellerProductEdit";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerOrderDetail from "./pages/seller/SellerOrderDetail";
import SellerAnalytics from "./pages/seller/SellerAnalytics";
import SellerSettings from "./pages/seller/SellerSettings";
import SellerCreateOrder from "./pages/seller/SellerCreateOrder";

// Other pages
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <CustomerProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Rotas públicas */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:productId" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/acesso-negado" element={<AccessDeniedPage />} />
                    
                    {/* Rotas protegidas para cliente */}
                    <Route element={<PrivateRoute allowedRoles={['CLIENTE']} />}>
                      <Route path="/checkout" element={<CheckoutPage />} />
                    </Route>
                    
                    {/* Rotas protegidas para vendedor */}
                    <Route element={<PrivateRoute allowedRoles={['VENDEDOR']} />}>
                      <Route path="/seller/dashboard" element={<SellerDashboard />} />
                      <Route path="/seller/products" element={<SellerProducts />} />
                      <Route path="/seller/products/create" element={<SellerProductCreate />} />
                      <Route path="/seller/products/edit/:productId" element={<SellerProductEdit />} />
                      <Route path="/seller/orders" element={<SellerOrders />} />
                      <Route path="/seller/orders/:orderId" element={<SellerOrderDetail />} />
                      <Route path="/seller/orders/create" element={<SellerCreateOrder />} />
                      <Route path="/seller/analytics" element={<SellerAnalytics />} />
                      <Route path="/seller/settings" element={<SellerSettings />} />
                    </Route>
                    
                    {/* Catch-all e redirecionamentos */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </CustomerProvider>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
