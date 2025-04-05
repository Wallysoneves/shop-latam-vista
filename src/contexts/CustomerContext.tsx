import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Customer, CustomerAddress, customerService } from '../services/customerService';

interface CustomerContextType {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  searchCustomers: (term: string) => Customer[];
  getCustomerById: (id: string) => Customer | undefined;
  createCustomer: (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Customer;
  updateCustomer: (id: string, customerData: Partial<Customer>) => Customer | undefined;
  deleteCustomer: (id: string) => boolean;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ao montar o componente, carregar todos os clientes
    try {
      const allCustomers = customerService.getAll();
      setCustomers(allCustomers);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar clientes');
      console.error('Erro ao carregar clientes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCustomers = (term: string): Customer[] => {
    try {
      return customerService.searchCustomers(term);
    } catch (err) {
      setError('Erro ao buscar clientes');
      console.error('Erro ao buscar clientes:', err);
      return [];
    }
  };

  const getCustomerById = (id: string): Customer | undefined => {
    try {
      return customerService.getById(id);
    } catch (err) {
      setError('Erro ao buscar cliente');
      console.error('Erro ao buscar cliente:', err);
      return undefined;
    }
  };

  const createCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer => {
    try {
      const newCustomer = customerService.createCustomer(customerData);
      setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
      return newCustomer;
    } catch (err) {
      setError('Erro ao criar cliente');
      console.error('Erro ao criar cliente:', err);
      throw err;
    }
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>): Customer | undefined => {
    try {
      const updatedCustomer = customerService.updateCustomer(id, customerData);
      
      if (updatedCustomer) {
        setCustomers(prevCustomers => 
          prevCustomers.map(customer => 
            customer.id === id ? updatedCustomer : customer
          )
        );
      }
      
      return updatedCustomer;
    } catch (err) {
      setError('Erro ao atualizar cliente');
      console.error('Erro ao atualizar cliente:', err);
      return undefined;
    }
  };

  const deleteCustomer = (id: string): boolean => {
    try {
      const deleted = customerService.deleteCustomer(id);
      
      if (deleted) {
        setCustomers(prevCustomers => 
          prevCustomers.filter(customer => customer.id !== id)
        );
      }
      
      return deleted;
    } catch (err) {
      setError('Erro ao excluir cliente');
      console.error('Erro ao excluir cliente:', err);
      return false;
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        error,
        searchCustomers,
        getCustomerById,
        createCustomer,
        updateCustomer,
        deleteCustomer
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  
  if (context === undefined) {
    throw new Error('useCustomers deve ser usado dentro de um CustomerProvider');
  }
  
  return context;
}; 