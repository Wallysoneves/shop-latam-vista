
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso');
    navigate('/login');
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex h-screen">
      {/* Sidebar - Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`w-64 bg-gray-900 text-white fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-market-yellow">Latin</span>
              <span className="text-xl font-bold text-market-blue">Vista</span>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Sidebar User Info */}
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0) || 'V'}
              </div>
              <div className="ml-3">
                <p className="font-medium">{user?.name || 'Vendedor'}</p>
                <p className="text-sm text-gray-400">{user?.email || 'vendedor@exemplo.com'}</p>
              </div>
            </div>
          </div>
          
          {/* Sidebar Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <Link
              to="/seller/dashboard"
              className={`flex items-center px-2 py-2 rounded-md ${
                isActive('/seller/dashboard') 
                  ? 'bg-market-blue text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <LayoutDashboard size={20} className="mr-3" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/seller/products"
              className={`flex items-center px-2 py-2 rounded-md ${
                location.pathname.includes('/seller/products') 
                  ? 'bg-market-blue text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Package size={20} className="mr-3" />
              <span>Produtos</span>
            </Link>
            
            <Link
              to="/seller/orders"
              className={`flex items-center px-2 py-2 rounded-md ${
                location.pathname.includes('/seller/orders') 
                  ? 'bg-market-blue text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <ShoppingBag size={20} className="mr-3" />
              <span>Pedidos</span>
            </Link>
            
            <Link
              to="/seller/analytics"
              className={`flex items-center px-2 py-2 rounded-md ${
                isActive('/seller/analytics') 
                  ? 'bg-market-blue text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <BarChart size={20} className="mr-3" />
              <span>Relatórios</span>
            </Link>
            
            <Link
              to="/seller/settings"
              className={`flex items-center px-2 py-2 rounded-md ${
                isActive('/seller/settings') 
                  ? 'bg-market-blue text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Settings size={20} className="mr-3" />
              <span>Configurações</span>
            </Link>
          </nav>
          
          {/* Sidebar Footer */}
          <div className="px-4 py-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center px-2 py-2 w-full rounded-md text-gray-300 hover:bg-gray-800"
            >
              <LogOut size={20} className="mr-3" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-600 lg:hidden"
              >
                <Menu size={24} />
              </button>
              <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-gray-800">
                Área do Vendedor
              </h1>
            </div>
            
            <div className="flex items-center">
              <Link 
                to="/"
                className="text-gray-600 hover:text-gray-900 mr-4"
              >
                Ir para Loja
              </Link>
              
              <div className="relative">
                <button className="flex items-center text-gray-600 hover:text-gray-900">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user?.name?.charAt(0) || 'V'}
                  </div>
                  <ChevronDown size={16} className="ml-1" />
                </button>
                
                {/* Dropdown menu (hidden by default) */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <Link 
                    to="/seller/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Configurações
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
