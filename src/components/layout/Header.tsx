
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-market-yellow">Latin</span>
            <span className="text-2xl font-bold text-market-blue">Vista</span>
          </Link>

          {/* Search Bar - Hide on mobile */}
          <div className="hidden md:flex flex-1 mx-6">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-market-yellow"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-market-yellow"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-market-yellow transition duration-200">
              Produtos
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-market-yellow transition duration-200">
              Categorias
            </Link>
            
            {isAuthenticated && user?.role === 'seller' && (
              <Link to="/seller/dashboard" className="text-gray-700 hover:text-market-yellow transition duration-200">
                Dashboard
              </Link>
            )}
            
            <Link to="/cart" className="relative">
              <ShoppingCart size={24} className="text-gray-700 hover:text-market-yellow transition duration-200" />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-market-yellow text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-market-yellow transition duration-200">
                  <User size={24} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10 hidden group-hover:block">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Minha Conta
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Meus Pedidos
                  </Link>
                  <button 
                    onClick={logout} 
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-market-yellow transition duration-200">
                Entrar
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative mr-4">
              <ShoppingCart size={24} className="text-gray-700" />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-market-yellow text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>
            <button onClick={toggleMenu} className="text-gray-700">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search - Show only on mobile */}
        <div className="mt-4 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-market-yellow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-market-yellow"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-3">
              <Link to="/products" className="text-gray-700 py-2 border-b border-gray-100" onClick={toggleMenu}>
                Produtos
              </Link>
              <Link to="/categories" className="text-gray-700 py-2 border-b border-gray-100" onClick={toggleMenu}>
                Categorias
              </Link>
              
              {isAuthenticated && user?.role === 'seller' && (
                <Link to="/seller/dashboard" className="text-gray-700 py-2 border-b border-gray-100" onClick={toggleMenu}>
                  Dashboard
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  <Link to="/account" className="text-gray-700 py-2 border-b border-gray-100" onClick={toggleMenu}>
                    Minha Conta
                  </Link>
                  <Link to="/orders" className="text-gray-700 py-2 border-b border-gray-100" onClick={toggleMenu}>
                    Meus Pedidos
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }} 
                    className="text-left text-red-500 py-2"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-gray-700 py-2" onClick={toggleMenu}>
                  Entrar
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
