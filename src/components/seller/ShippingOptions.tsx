import React, { useState, useEffect } from 'react';
import { Truck, Store, CircleCheck, AlertCircle } from 'lucide-react';
import { Customer } from '../../services/customerService';
import { shippingService, ShippingOption } from '../../services/shippingService';
import { Product } from '../../services/productService';

interface ShippingOptionsProps {
  customer: Customer | null;
  totalValue: number;
  products?: Product[];
  onShippingSelect: (option: 'pickup' | ShippingOption | null) => void;
}

const ShippingOptions: React.FC<ShippingOptionsProps> = ({ 
  customer, 
  totalValue,
  products = [],
  onShippingSelect 
}) => {
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'shipping' | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Recalcular opções de frete quando cliente mudar
  useEffect(() => {
    if (deliveryType === 'shipping' && customer) {
      calculateShippingOptions(customer.address.cep);
    }
  }, [customer, deliveryType, products]);
  
  const handleDeliveryTypeChange = (type: 'pickup' | 'shipping') => {
    setDeliveryType(type);
    setSelectedShipping(null);
    
    if (type === 'pickup') {
      onShippingSelect('pickup');
    } else if (type === 'shipping' && customer) {
      calculateShippingOptions(customer.address.cep);
    }
  };
  
  const calculateShippingOptions = async (cep: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulando um pequeno delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const options = shippingService.calculateShippingOptions(
        cep, 
        products,
        customer?.address.city
      );
      
      if (options.length === 0) {
        setError('Não foi possível calcular o frete para este CEP');
      } else {
        setShippingOptions(options);
        // Selecionar automaticamente a primeira opção
        setSelectedShipping(options[0]);
        onShippingSelect(options[0]);
      }
    } catch (err) {
      setError('Erro ao calcular o frete');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShippingSelect = (option: ShippingOption) => {
    setSelectedShipping(option);
    onShippingSelect(option);
  };
  
  const getEstimatedDeliveryDate = (days: number) => {
    const date = shippingService.calculateEstimatedDeliveryDate(days);
    
    // Formatando a data para pt-BR
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  if (!customer) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 text-yellow-400">
            <AlertCircle size={20} />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Atenção</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Selecione um cliente para visualizar as opções de entrega.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3">Método de Entrega</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <button
          type="button"
          onClick={() => handleDeliveryTypeChange('pickup')}
          className={`flex items-center p-4 border ${
            deliveryType === 'pickup' 
              ? 'border-market-blue bg-blue-50' 
              : 'border-gray-300 hover:bg-gray-50'
          } rounded-lg transition-colors`}
        >
          <div className={`p-2 rounded-full ${
            deliveryType === 'pickup' ? 'bg-market-blue text-white' : 'bg-gray-100 text-gray-500'
          }`}>
            <Store size={20} />
          </div>
          <div className="ml-3 text-left">
            <p className="font-medium">Retirada na Loja</p>
            <p className="text-sm text-gray-500">O cliente retira o pedido no local</p>
            <p className="text-sm font-medium text-market-blue mt-1">Grátis</p>
          </div>
          {deliveryType === 'pickup' && (
            <CircleCheck size={20} className="ml-auto text-market-blue" />
          )}
        </button>
        
        <button
          type="button"
          onClick={() => handleDeliveryTypeChange('shipping')}
          className={`flex items-center p-4 border ${
            deliveryType === 'shipping' 
              ? 'border-market-blue bg-blue-50' 
              : 'border-gray-300 hover:bg-gray-50'
          } rounded-lg transition-colors`}
        >
          <div className={`p-2 rounded-full ${
            deliveryType === 'shipping' ? 'bg-market-blue text-white' : 'bg-gray-100 text-gray-500'
          }`}>
            <Truck size={20} />
          </div>
          <div className="ml-3 text-left">
            <p className="font-medium">Entrega no Endereço</p>
            <p className="text-sm text-gray-500">Enviar para o endereço do cliente</p>
            <p className="text-sm font-medium text-gray-600 mt-1">
              CEP: {customer.address.cep}
            </p>
          </div>
          {deliveryType === 'shipping' && (
            <CircleCheck size={20} className="ml-auto text-market-blue" />
          )}
        </button>
      </div>
      
      {deliveryType === 'shipping' && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Opções de Frete</h4>
          
          {isLoading ? (
            <div className="text-center p-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-market-blue"></div>
              <p className="mt-2 text-sm text-gray-500">Calculando opções de frete...</p>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0 text-red-400">
                  <AlertCircle size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {shippingOptions.map((option) => (
                <div 
                  key={option.name}
                  onClick={() => handleShippingSelect(option)}
                  className={`flex items-center justify-between p-3 border ${
                    selectedShipping?.name === option.name 
                      ? 'border-market-blue bg-blue-50' 
                      : 'border-gray-200'
                  } rounded-lg cursor-pointer hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 mr-3 rounded-full border-2 flex items-center justify-center ${
                      selectedShipping?.name === option.name 
                        ? 'border-market-blue' 
                        : 'border-gray-300'
                    }`}>
                      {selectedShipping?.name === option.name && (
                        <div className="w-3 h-3 rounded-full bg-market-blue"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{option.name}</p>
                      <p className="text-sm text-gray-500">
                        Entrega prevista para {getEstimatedDeliveryDate(option.estimatedDays)}
                        {option.estimatedDays === 1 
                          ? ' (1 dia útil)' 
                          : ` (${option.estimatedDays} dias úteis)`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-market-blue">
                      R$ {option.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {deliveryType === 'pickup' && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium">Informações de Retirada</h4>
          <p className="text-sm text-gray-600 mt-2">
            O cliente poderá retirar o pedido em nossa loja a partir do próximo dia útil após a confirmação do pagamento.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Endereço para retirada: Av. Paulista, 1000 - Bela Vista, São Paulo - SP
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Horário de funcionamento: Segunda a Sexta das 9h às 18h, Sábados das 9h às 13h
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingOptions; 