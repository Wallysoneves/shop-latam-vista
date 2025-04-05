import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { Customer } from '../../contexts/CustomerContext';
import { OrderItem } from './ProductSelection';
import { ShippingOption } from '../../services/shippingService';

interface OrderSummaryProps {
  customer: Customer | null;
  items: OrderItem[];
  shippingOption: 'pickup' | ShippingOption | null;
  onConfirmOrder: () => void;
  isProcessing: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  customer,
  items,
  shippingOption,
  onConfirmOrder,
  isProcessing
}) => {
  // Calcular subtotal dos itens
  const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
  
  // Calcular valor do frete
  const shippingCost = shippingOption === 'pickup' 
    ? 0 
    : typeof shippingOption === 'object' && shippingOption !== null
      ? shippingOption.price
      : 0;
  
  // Calcular total
  const total = subtotal + shippingCost;
  
  // Verificar se o pedido está pronto para ser confirmado
  const isOrderReady = customer !== null && items.length > 0 && shippingOption !== null;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Resumo do Pedido</h3>
      </div>
      
      <div className="p-4">
        {/* Informações do cliente */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Cliente</h4>
          {customer ? (
            <div className="flex items-start">
              <div className="flex-shrink-0 text-green-500 mt-1">
                <Check size={16} />
              </div>
              <div className="ml-2">
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-gray-600">
                  {customer.email && <span>{customer.email}<br /></span>}
                  {customer.phone && <span>{customer.phone}<br /></span>}
                  <span>CPF: {customer.cpf}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">Nenhum cliente selecionado</div>
          )}
        </div>
        
        {/* Itens do pedido */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Produtos</h4>
          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div className="flex-1">
                    <p className="text-sm">
                      {item.quantity}x {item.product.name}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    R$ {item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">Nenhum produto adicionado</div>
          )}
        </div>
        
        {/* Entrega */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Entrega</h4>
          {shippingOption ? (
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium">
                  {shippingOption === 'pickup' 
                    ? 'Retirada na Loja' 
                    : shippingOption.name
                  }
                </p>
                {shippingOption !== 'pickup' && (
                  <p className="text-xs text-gray-500">
                    Entrega em {shippingOption.estimatedDays} dias úteis
                  </p>
                )}
              </div>
              <div className="text-sm font-medium">
                {shippingOption === 'pickup' 
                  ? 'Grátis' 
                  : `R$ ${shippingOption.price.toFixed(2)}`
                }
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">Método de entrega não selecionado</div>
          )}
        </div>
        
        {/* Totais */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Frete</span>
            <span className="font-medium">
              {shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold text-market-blue">
              R$ {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Botão de confirmação */}
      <div className="p-4 bg-gray-50 border-t rounded-b-lg">
        <button
          type="button"
          onClick={onConfirmOrder}
          disabled={!isOrderReady || isProcessing}
          className={`w-full py-3 px-4 rounded-md font-medium text-white transition ${
            isOrderReady && !isProcessing
              ? 'bg-market-blue hover:bg-blue-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processando...
            </div>
          ) : (
            'Confirmar Pedido'
          )}
        </button>
        
        {!isOrderReady && (
          <div className="mt-3 p-3 bg-yellow-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0 text-yellow-400">
                <AlertCircle size={18} />
              </div>
              <div className="ml-2 text-sm text-yellow-700">
                Por favor, preencha todas as informações necessárias para finalizar o pedido.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary; 