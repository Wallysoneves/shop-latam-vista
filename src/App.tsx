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

// Customer pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";

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

// Protected Route component
const ProtectedRoute = ({ element, requiredRole }: { element: JSX.Element, requiredRole?: 'customer' | 'seller' }) => {
  // This is a simplified version - in a real app, you'd check auth status here
  // For demo purposes, we'll assume all routes are accessible
  return element;
};

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
                    {/* Customer Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:productId" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={
                      <ProtectedRoute 
                        element={<CheckoutPage />} 
                        requiredRole="customer" 
                      />
                    } />
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Seller Routes */}
                    <Route path="/seller/dashboard" element={
                      <ProtectedRoute 
                        element={<SellerDashboard />} 
                        requiredRole="seller" 
                      />
                    } />
                    <Route path="/seller/products" element={
                      <ProtectedRoute 
                        element={<SellerProducts />} 
                        requiredRole="seller" 
                      />
                    } />
                    <Route path="/seller/products/create" element={
                      <ProtectedRoute 
                        element={<SellerProductCreate />} 
                        requiredRole="seller" 
                      />
                    } />
                    <Route path="/seller/products/edit/:productId" element={
                      <ProtectedRoute 
                        element={<SellerProductEdit />} 
                        requiredRole="seller" 
                      />
                    } />
                    <Route path="/seller/orders" element={
                      <ProtectedRoute 
                        element={<SellerOrders />} 
                        requiredRole="seller" 
                      />
                    } />
                    <Route path="/seller/orders/:orderId" element={
                      <ProtectedRoute 
                        element={<SellerOrderDetail />} 
                        requiredRole="seller" 
                      />
                    } />
                    <Route path="/seller/orders/create" element={
                      <ProtectedRoute 
                        element={<SellerCreateOrder />} 
                        requiredRole="seller" 
                      />
                    } />
                    <Route path="/seller/analytics" element={
                      <ProtectedRoute 
                        element={<SellerAnalytics />} 
                        requiredRole="seller" 
                      />
                    } />
                    <Route path="/seller/settings" element={
                      <ProtectedRoute 
                        element={<SellerSettings />} 
                        requiredRole="seller" 
                      />
                    } />
                    
                    {/* Catch-all and redirects */}
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
