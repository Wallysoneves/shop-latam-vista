import React from 'react';
import { Link } from 'react-router-dom';

const AccessDeniedPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Acesso Negado</h1>
      <p className="text-gray-700 mb-8 text-center max-w-md">
        Você não tem permissão para acessar esta página.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Voltar para a página inicial
        </Link>
        <Link 
          to="/login" 
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
        >
          Fazer login
        </Link>
      </div>
    </div>
  );
};

export default AccessDeniedPage; 