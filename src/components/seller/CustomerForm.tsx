import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCustomers } from '../../contexts/CustomerContext';
import { Customer, CustomerAddress } from '../../services/customerService';

interface CustomerFormProps {
  onClose: () => void;
  onSave: (customer: Customer) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onClose, onSave }) => {
  const { createCustomer } = useCustomers();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    rg: '',
    address: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: ''
    }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Limpar erro quando o campo é alterado
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf) && !/^\d{11}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.address.cep.trim()) {
      newErrors['address.cep'] = 'CEP é obrigatório';
    } else if (!/^\d{5}-?\d{3}$/.test(formData.address.cep)) {
      newErrors['address.cep'] = 'CEP inválido';
    }
    
    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Rua é obrigatória';
    }
    
    if (!formData.address.number.trim()) {
      newErrors['address.number'] = 'Número é obrigatório';
    }
    
    if (!formData.address.district.trim()) {
      newErrors['address.district'] = 'Bairro é obrigatório';
    }
    
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'Cidade é obrigatória';
    }
    
    if (!formData.address.state.trim()) {
      newErrors['address.state'] = 'Estado é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simular uma busca de CEP (em produção usaria uma API real)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Dados mockados baseados no CEP
      if (cep === '01310100') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            street: 'Avenida Paulista',
            district: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP'
          }
        }));
      } else if (cep === '22250040') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            street: 'Rua Voluntários da Pátria',
            district: 'Botafogo',
            city: 'Rio de Janeiro',
            state: 'RJ'
          }
        }));
      } else if (cep === '30130110') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            street: 'Avenida Afonso Pena',
            district: 'Centro',
            city: 'Belo Horizonte',
            state: 'MG'
          }
        }));
      }
      // Se não encontrar nenhum CEP nos mocks, não altera os campos
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const customerData = {
      name: formData.name,
      email: formData.email || "",
      phone: formData.phone || "",
      cpf: formData.cpf,
      address: {
        street: formData.address.street,
        number: formData.address.number,
        complement: formData.address.complement || "",
        district: formData.address.district,
        city: formData.address.city,
        state: formData.address.state,
        cep: formData.address.cep,
        country: "Brasil"
      }
    };
    
    const newCustomer = createCustomer(customerData);
    onSave(newCustomer);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Cadastrar Novo Cliente</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nome completo do cliente"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="email@exemplo.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Telefone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="(00) 00000-0000"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                CPF *
              </label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.cpf ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="000.000.000-00"
              />
              {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                RG
              </label>
              <input
                type="text"
                name="rg"
                value={formData.rg}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="00.000.000-0"
              />
            </div>
            
            <div className="col-span-2 mt-2">
              <h3 className="text-lg font-medium mb-2">Endereço</h3>
            </div>
            
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-1">
                CEP *
              </label>
              <input
                type="text"
                name="address.cep"
                value={formData.address.cep}
                onChange={handleChange}
                onBlur={handleCepBlur}
                className={`w-full p-2 border rounded-md ${errors['address.cep'] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="00000-000"
              />
              {isLoading && (
                <div className="absolute right-3 top-9">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-market-blue"></div>
                </div>
              )}
              {errors['address.cep'] && <p className="text-red-500 text-sm mt-1">{errors['address.cep']}</p>}
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-1">
                Rua *
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors['address.street'] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nome da rua"
              />
              {errors['address.street'] && <p className="text-red-500 text-sm mt-1">{errors['address.street']}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Número *
              </label>
              <input
                type="text"
                name="address.number"
                value={formData.address.number}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors['address.number'] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Número"
              />
              {errors['address.number'] && <p className="text-red-500 text-sm mt-1">{errors['address.number']}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Complemento
              </label>
              <input
                type="text"
                name="address.complement"
                value={formData.address.complement}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Complemento (opcional)"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Bairro *
              </label>
              <input
                type="text"
                name="address.district"
                value={formData.address.district}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors['address.district'] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Bairro"
              />
              {errors['address.district'] && <p className="text-red-500 text-sm mt-1">{errors['address.district']}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Cidade *
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors['address.city'] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Cidade"
              />
              {errors['address.city'] && <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Estado *
              </label>
              <select
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors['address.state'] ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Selecione um estado</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
              {errors['address.state'] && <p className="text-red-500 text-sm mt-1">{errors['address.state']}</p>}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-market-blue text-white rounded-md hover:bg-blue-700 transition"
            >
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm; 