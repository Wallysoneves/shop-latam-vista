import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { authService, ILoginResponse, IClienteRegistroRequest, IVendedorRegistroRequest } from '../services/authService';

type UserRole = 'CLIENTE' | 'VENDEDOR';

interface User {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  registerCliente: (userData: IClienteRegistroRequest) => Promise<void>;
  registerVendedor: (userData: IVendedorRegistroRequest) => Promise<void>;
  recoverPassword: (email: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica se o usuário já está logado ao carregar o componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao recuperar usuário:', error);
        logout();
      }
    }
    
    setLoading(false);
  }, []);
  
  const login = async (email: string, senha: string) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, senha });
      
      const { token, userId, nome, tipoUsuario } = response;
      
      // Salva o token e o usuário no localStorage
      localStorage.setItem('token', token);
      
      const userData: User = {
        id: userId,
        nome,
        email,
        tipoUsuario
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Erro de login:', error);
      throw new Error('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  const registerCliente = async (userData: IClienteRegistroRequest) => {
    try {
      setLoading(true);
      const response = await authService.registrarCliente(userData);
      
      const { token, userId, nome, tipoUsuario } = response;
      
      // Salva o token e o usuário no localStorage
      localStorage.setItem('token', token);
      
      const user: User = {
        id: userId,
        nome,
        email: userData.email,
        tipoUsuario
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error('Erro no registro:', error);
      throw new Error('Falha no registro');
    } finally {
      setLoading(false);
    }
  };

  const registerVendedor = async (userData: IVendedorRegistroRequest) => {
    try {
      setLoading(true);
      const response = await authService.registrarVendedor(userData);
      
      const { token, userId, nome, tipoUsuario } = response;
      
      // Salva o token e o usuário no localStorage
      localStorage.setItem('token', token);
      
      const user: User = {
        id: userId,
        nome,
        email: userData.email,
        tipoUsuario
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error('Erro no registro:', error);
      throw new Error('Falha no registro');
    } finally {
      setLoading(false);
    }
  };

  const recoverPassword = async (email: string) => {
    try {
      setLoading(true);
      await authService.recuperarSenha(email);
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      throw new Error('Falha na recuperação de senha');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        registerCliente,
        registerVendedor,
        recoverPassword,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
