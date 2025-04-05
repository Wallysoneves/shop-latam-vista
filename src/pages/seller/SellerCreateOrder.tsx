import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Customer, useCustomers } from '../../contexts/CustomerContext';
import { useOrders, OrderStatus } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import SellerLayout from './SellerLayout';
import CustomerSearch from '../../components/seller/CustomerSearch';
import CustomerForm from '../../components/seller/CustomerForm';
import ProductSelection, { OrderItem } from '../../components/seller/ProductSelection';
import ShippingOptions from '../../components/seller/ShippingOptions';
import OrderSummary from '../../components/seller/OrderSummary';
import { ShippingOption } from '../../services/shippingService';

const SellerCreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addOrder } = useOrders();

  // Estados
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showCustomerForm, setShowCustomerForm] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [shippingOption, setShippingOption] = useState<'pickup' | ShippingOption | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Funções de manipulação
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleCreateCustomer = () => {
    setShowCustomerForm(true);
  };

  const handleCustomerSaved = (customer: Customer) => {
    setShowCustomerForm(false);
    setSelectedCustomer(customer);
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleItemsChange = (items: OrderItem[]) => {
    setOrderItems(items);
    if (items.length > 0 && currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleShippingSelect = (option: 'pickup' | ShippingOption | null) => {
    setShippingOption(option);
    if (option && currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedCustomer || orderItems.length === 0 || !shippingOption || !user) {
      return;
    }

    setIsProcessing(true);

    try {
      // Calcular subtotal
      const subtotal = orderItems.reduce((total, item) => total + item.subtotal, 0);
      
      // Calcular frete
      const shippingCost = shippingOption === 'pickup' 
        ? 0 
        : typeof shippingOption === 'object' 
          ? shippingOption.price 
          : 0;
      
      // Criar novo pedido
      const newOrder = {
        id: `ORD${Math.floor(Math.random() * 100000)}`,
        customerId: selectedCustomer.id,
        sellerId: user.id,
        items: orderItems.map(item => ({
          product: item.product,
          quantity: item.quantity
        })),
        status: 'pending' as OrderStatus,
        shipping: shippingCost,
        shippingInfo: {
          fullName: selectedCustomer.name,
          email: selectedCustomer.email || '',
          phone: selectedCustomer.phone || '',
          address: `${selectedCustomer.address.street}, ${selectedCustomer.address.number}${selectedCustomer.address.complement ? `, ${selectedCustomer.address.complement}` : ''}`,
          city: selectedCustomer.address.city,
          state: selectedCustomer.address.state,
          zipCode: selectedCustomer.address.cep,
          country: 'Brasil'
        },
        subtotal,
        total: subtotal + shippingCost,
        payment: {
          method: 'Pagamento na Entrega',
          status: 'pending'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Simular processamento do pedido
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Adicionar pedido ao contexto
      addOrder(newOrder);
      
      // Mostrar mensagem de sucesso
      toast.success('Pedido criado com sucesso!', {
        description: `Pedido #${newOrder.id} foi registrado.`,
        action: {
          label: 'Ver Detalhes',
          onClick: () => navigate(`/seller/orders/${newOrder.id}`)
        }
      });
      
      // Redirecionar para lista de pedidos
      navigate('/seller/orders');
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast.error('Erro ao criar pedido', {
        description: 'Ocorreu um erro ao processar o pedido. Tente novamente.'
      });
      setIsProcessing(false);
    }
  };

  return (
    <SellerLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/seller/orders')}
            className="flex items-center text-gray-600 hover:text-market-blue transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Voltar para Pedidos</span>
          </button>
          <h1 className="text-2xl font-bold mt-2 flex items-center">
            <ShoppingBag className="mr-2" />
            Registrar Novo Pedido
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal - Etapas do Pedido */}
          <div className="lg:col-span-2 space-y-8">
            {/* Etapa 1: Seleção de Cliente */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-market-blue text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <h2 className="text-lg font-semibold ml-2">Cliente</h2>
              </div>
              
              <CustomerSearch 
                onSelectCustomer={handleSelectCustomer}
                onCreateNewClick={handleCreateCustomer}
              />
              
              {selectedCustomer && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">Cliente Selecionado</h3>
                  <div className="mt-2">
                    <p><span className="font-medium">Nome:</span> {selectedCustomer.name}</p>
                    {selectedCustomer.email && <p><span className="font-medium">Email:</span> {selectedCustomer.email}</p>}
                    {selectedCustomer.phone && <p><span className="font-medium">Telefone:</span> {selectedCustomer.phone}</p>}
                    <p><span className="font-medium">CPF:</span> {selectedCustomer.cpf}</p>
                    <p className="mt-1"><span className="font-medium">Endereço:</span> {selectedCustomer.address.street}, {selectedCustomer.address.number}
                      {selectedCustomer.address.complement && `, ${selectedCustomer.address.complement}`}, {selectedCustomer.address.district}, {selectedCustomer.address.city} - {selectedCustomer.address.state}, {selectedCustomer.address.cep}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="mt-3 text-sm text-market-blue hover:underline"
                  >
                    Trocar Cliente
                  </button>
                </div>
              )}
            </section>
            
            {/* Etapa 2: Produtos */}
            <section className={`bg-white p-6 rounded-lg shadow-sm border ${
              currentStep >= 2 ? 'border-gray-200' : 'border-gray-100 opacity-60'
            }`}>
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-market-blue text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <h2 className="text-lg font-semibold ml-2">Produtos</h2>
              </div>
              
              <ProductSelection 
                items={orderItems}
                onItemsChange={handleItemsChange}
              />
            </section>
            
            {/* Etapa 3: Entrega */}
            <section className={`bg-white p-6 rounded-lg shadow-sm border ${
              currentStep >= 3 ? 'border-gray-200' : 'border-gray-100 opacity-60'
            }`}>
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? 'bg-market-blue text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  3
                </div>
                <h2 className="text-lg font-semibold ml-2">Entrega</h2>
              </div>
              
              <ShippingOptions 
                customer={selectedCustomer}
                totalValue={orderItems.reduce((total, item) => total + item.subtotal, 0)}
                onShippingSelect={handleShippingSelect}
              />
            </section>
          </div>

          {/* Coluna Lateral - Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <OrderSummary 
                customer={selectedCustomer}
                items={orderItems}
                shippingOption={shippingOption}
                onConfirmOrder={handleConfirmOrder}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal para cadastro de novo cliente */}
      {showCustomerForm && (
        <CustomerForm 
          onClose={() => setShowCustomerForm(false)} 
          onSave={handleCustomerSaved}
        />
      )}
    </SellerLayout>
  );
};

export default SellerCreateOrder;

 