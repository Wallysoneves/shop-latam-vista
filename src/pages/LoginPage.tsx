
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAs, setLoginAs] = useState<'customer' | 'seller'>('customer');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true);
    
    try {
      // For demo, we'll set different email formats for customer/seller
      const emailToUse = loginAs === 'seller' ? `seller-${email}` : email;
      
      await login(emailToUse, password);
      
      // Show success message
      toast.success(`Login realizado com sucesso como ${loginAs === 'seller' ? 'vendedor' : 'cliente'}`);
      
      // Navigate to the appropriate dashboard or redirect path
      if (loginAs === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate(from);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center mb-6">
            <span className="text-3xl font-bold text-market-yellow">Latin</span>
            <span className="text-3xl font-bold text-market-blue">Vista</span>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800">
            {loginAs === 'customer' ? 'Login de Cliente' : 'Login de Vendedor'}
          </h2>
          <p className="mt-2 text-gray-600">
            Entre na sua conta para continuar
          </p>
        </div>
        
        {/* Login Type Selector */}
        <div className="mb-6">
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setLoginAs('customer')}
              className={`w-1/2 py-2 text-sm font-medium rounded-l-md focus:outline-none ${
                loginAs === 'customer'
                  ? 'bg-market-yellow text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Cliente
            </button>
            <button
              type="button"
              onClick={() => setLoginAs('seller')}
              className={`w-1/2 py-2 text-sm font-medium rounded-r-md focus:outline-none ${
                loginAs === 'seller'
                  ? 'bg-market-blue text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Vendedor
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-market-yellow"
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-market-yellow"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <a href="#" className="text-sm text-market-blue hover:underline">
                Esqueceu a senha?
              </a>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : loginAs === 'customer'
                  ? 'bg-market-yellow hover:bg-yellow-500 text-white'
                  : 'bg-market-blue hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Entrando...</span>
              </div>
            ) : (
              'Entrar'
            )}
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-market-blue hover:underline">
                Registre-se agora
              </Link>
            </p>
          </div>
        </form>
        
        {/* Demo info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center mb-2">
            <strong>Para fins de demonstração:</strong>
          </p>
          <p className="text-sm text-gray-600">
            - Use qualquer email e senha para entrar<br />
            - Selecione "Cliente" ou "Vendedor" para acessar diferentes áreas
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
