import React, { useState, useEffect, useRef } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { useCustomers, Customer } from '../../contexts/CustomerContext';

interface CustomerSearchProps {
  onSelectCustomer: (customer: Customer) => void;
  onCreateNewClick: () => void;
}

const CustomerSearch: React.FC<CustomerSearchProps> = ({ onSelectCustomer, onCreateNewClick }) => {
  const { searchCustomers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Customer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Feche o dropdown quando clicar fora do componente
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    
    // Simular um pequeno delay para mostrar o estado de loading
    const timeoutId = setTimeout(() => {
      const searchResults = searchCustomers(searchTerm);
      setResults(searchResults);
      setShowResults(true);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchCustomers]);

  const handleSelect = (customer: Customer) => {
    setSearchTerm(customer.name);
    setShowResults(false);
    onSelectCustomer(customer);
  };

  return (
    <div className="w-full" ref={searchRef}>
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cliente por nome, email, CPF, telefone..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-market-blue focus:border-market-blue"
          />
          <div className="absolute left-3 top-3 text-gray-400">
            <Search size={20} />
          </div>
          
          {searchTerm.length > 0 && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
        
        {isLoading && (
          <div className="absolute right-12 top-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-market-blue"></div>
          </div>
        )}
        
        {showResults && results.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-96 overflow-y-auto">
            <ul>
              {results.map((customer) => (
                <li 
                  key={customer.id}
                  onClick={() => handleSelect(customer)}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{customer.name}</span>
                    <div className="text-sm text-gray-600 grid grid-cols-2 gap-1">
                      {customer.email && <span>Email: {customer.email}</span>}
                      {customer.phone && <span>Tel: {customer.phone}</span>}
                      {customer.cpf && <span>CPF: {customer.cpf}</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {showResults && results.length === 0 && searchTerm.length >= 2 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
            <div className="p-4 text-center">
              <p className="text-gray-500 mb-3">Nenhum cliente encontrado</p>
              <button
                onClick={onCreateNewClick}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-market-blue text-white rounded-md hover:bg-blue-700 transition"
              >
                <UserPlus size={18} />
                Cadastrar Novo Cliente
              </button>
            </div>
          </div>
        )}
      </div>
      
      {!showResults && searchTerm.length < 2 && (
        <div className="mt-4">
          <button
            onClick={onCreateNewClick}
            className="flex items-center justify-center gap-2 py-2 px-4 border border-market-blue text-market-blue rounded-md hover:bg-blue-50 transition"
          >
            <UserPlus size={18} />
            Cadastrar Novo Cliente
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerSearch; 