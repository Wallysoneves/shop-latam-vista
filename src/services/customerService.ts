import customersData from '../data/customers.json';

export interface CustomerAddress {
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  cep: string;
  country: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: CustomerAddress;
  createdAt: string;
  updatedAt: string;
}

let customers: Customer[] = [...customersData];

export const customerService = {
  /**
   * Busca todos os clientes
   */
  getAll: (): Customer[] => {
    return customers;
  },

  /**
   * Busca um cliente por ID
   */
  getById: (id: string): Customer | undefined => {
    return customers.find(customer => customer.id === id);
  },

  /**
   * Busca clientes por termo de pesquisa (nome, email, cpf ou telefone)
   */
  searchCustomers: (term: string): Customer[] => {
    if (!term) return customers;
    
    const searchTerm = term.toLowerCase();
    
    return customers.filter(
      customer => 
        customer.name.toLowerCase().includes(searchTerm) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm)) ||
        (customer.phone && customer.phone.includes(searchTerm)) ||
        (customer.cpf && customer.cpf.includes(searchTerm))
    );
  },

  /**
   * Cria um novo cliente
   */
  createCustomer: (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust${customers.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    customers = [...customers, newCustomer];
    return newCustomer;
  },

  /**
   * Atualiza um cliente existente
   */
  updateCustomer: (id: string, customerData: Partial<Customer>): Customer | undefined => {
    const customerIndex = customers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) {
      return undefined;
    }
    
    const updatedCustomer = {
      ...customers[customerIndex],
      ...customerData,
      updatedAt: new Date().toISOString()
    };
    
    customers = [
      ...customers.slice(0, customerIndex),
      updatedCustomer,
      ...customers.slice(customerIndex + 1)
    ];
    
    return updatedCustomer;
  },

  /**
   * Remove um cliente
   */
  deleteCustomer: (id: string): boolean => {
    const initialLength = customers.length;
    customers = customers.filter(customer => customer.id !== id);
    return customers.length !== initialLength;
  }
}; 