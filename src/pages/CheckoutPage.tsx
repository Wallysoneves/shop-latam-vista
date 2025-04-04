
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { toast } from 'sonner';
import { ShoppingBag, AlertCircle, Check, ChevronRight } from 'lucide-react';

type CheckoutStep = 'shipping' | 'payment' | 'review';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

interface ShippingOption {
  sellerId: string;
  price: number;
  days: number;
}

const CheckoutPage = () => {
  const { items, calculateSubtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [loading, setLoading] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil'
  });
  
  const [shippingOptions, setShippingOptions] = useState<Record<string, ShippingOption[]>>({});
  const [selectedShipping, setSelectedShipping] = useState<Record<string, ShippingOption>>({});
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  });
  
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login para continuar com a compra');
      navigate('/login', { state: { from: '/checkout' } });
    }
    
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, navigate, items]);
  
  // Group items by seller
  const sellerGroups = items.reduce((groups, item) => {
    const sellerId = item.product.seller.id;
    
    if (!groups[sellerId]) {
      groups[sellerId] = {
        sellerId,
        sellerName: item.product.seller.name,
        location: item.product.seller.location,
        items: [],
        subtotal: 0
      };
    }
    
    groups[sellerId].items.push({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0]
    });
    
    groups[sellerId].subtotal += item.product.price * item.quantity;
    
    return groups;
  }, {} as Record<string, any>);
  
  // Calculate shipping options when zip code changes
  useEffect(() => {
    if (shippingInfo.zipCode.length === 8 && Object.keys(sellerGroups).length > 0) {
      // Simulate shipping API call
      const calculateShippingOptions = async () => {
        const options: Record<string, ShippingOption[]> = {};
        
        for (const sellerId of Object.keys(sellerGroups)) {
          // Simulate different shipping options
          const standard = {
            sellerId,
            price: Math.floor(Math.random() * 30) + 10,
            days: Math.floor(Math.random() * 5) + 5
          };
          
          const express = {
            sellerId,
            price: standard.price + Math.floor(Math.random() * 20) + 15,
            days: Math.max(standard.days - Math.floor(Math.random() * 3) - 2, 1)
          };
          
          options[sellerId] = [standard, express];
          
          // Select standard shipping by default
          if (!selectedShipping[sellerId]) {
            setSelectedShipping(prev => ({
              ...prev,
              [sellerId]: standard
            }));
          }
        }
        
        setShippingOptions(options);
      };
      
      calculateShippingOptions();
    }
  }, [shippingInfo.zipCode, sellerGroups]);
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate shipping info
    const requiredFields: (keyof ShippingInfo)[] = [
      'fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'
    ];
    
    const missingFields = requiredFields.filter(field => !shippingInfo[field]);
    
    if (missingFields.length > 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (shippingInfo.zipCode.length !== 8) {
      toast.error('CEP inválido');
      return;
    }
    
    if (Object.keys(selectedShipping).length !== Object.keys(sellerGroups).length) {
      toast.error('Por favor, selecione uma opção de envio para todos os vendedores');
      return;
    }
    
    setCurrentStep('payment');
    window.scrollTo(0, 0);
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate payment info
    const { cardNumber, cardHolder, expiry, cvv } = paymentInfo;
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Número de cartão inválido');
      return;
    }
    
    if (!cardHolder) {
      toast.error('Nome no cartão é obrigatório');
      return;
    }
    
    if (!expiry || !expiry.match(/^\d{2}\/\d{2}$/)) {
      toast.error('Data de validade inválida (formato: MM/AA)');
      return;
    }
    
    if (!cvv || !cvv.match(/^\d{3,4}$/)) {
      toast.error('CVV inválido');
      return;
    }
    
    setCurrentStep('review');
    window.scrollTo(0, 0);
  };
  
  const handleOrderSubmit = () => {
    if (!isAgreementChecked) {
      toast.error('Você precisa concordar com os termos e condições');
      return;
    }
    
    setLoading(true);
    
    // Create order for each seller
    Object.values(sellerGroups).forEach(group => {
      if (!user) return;
      
      const shipping = selectedShipping[group.sellerId];
      
      const order = {
        customerId: user.id,
        sellerId: group.sellerId,
        items: group.items.map((item: any) => ({
          product: items.find(cartItem => cartItem.product.id === item.productId)?.product!,
          quantity: item.quantity
        })),
        status: 'pending' as const,
        total: group.subtotal + shipping.price,
        shipping: shipping.price,
        shippingInfo
      };
      
      addOrder(order);
    });
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      clearCart();
      navigate('/orders', { state: { success: true } });
      toast.success('Pedido realizado com sucesso!');
    }, 1500);
  };
  
  // Calculate totals
  const subtotal = calculateSubtotal();
  const shippingTotal = Object.values(selectedShipping).reduce(
    (sum, option) => sum + option.price, 0
  );
  const total = subtotal + shippingTotal;
  
  // Helper function to format credit card number
  const formatCardNumber = (value: string) => {
    const rawValue = value.replace(/\s/g, '').slice(0, 16);
    const parts = [];
    
    for (let i = 0; i < rawValue.length; i += 4) {
      parts.push(rawValue.slice(i, i + 4));
    }
    
    return parts.join(' ');
  };
  
  // Helper function to format card expiry date
  const formatExpiry = (value: string) => {
    const rawValue = value.replace(/\D/g, '').slice(0, 4);
    
    if (rawValue.length > 2) {
      return `${rawValue.slice(0, 2)}/${rawValue.slice(2)}`;
    }
    
    return rawValue;
  };
  
  // Helper function to handle shipping selection
  const handleShippingSelection = (sellerId: string, option: ShippingOption) => {
    setSelectedShipping(prev => ({
      ...prev,
      [sellerId]: option
    }));
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        {/* Checkout Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className={`flex flex-col items-center ${currentStep === 'shipping' ? 'text-market-yellow' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'shipping' ? 'bg-market-yellow text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm font-medium">Endereço</span>
            </div>
            
            <div className={`w-24 h-1 mx-2 ${currentStep === 'shipping' ? 'bg-gray-200' : 'bg-market-yellow'}`}></div>
            
            <div className={`flex flex-col items-center ${currentStep === 'payment' ? 'text-market-yellow' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'payment' ? 'bg-market-yellow text-white' : currentStep === 'review' ? 'bg-market-yellow text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm font-medium">Pagamento</span>
            </div>
            
            <div className={`w-24 h-1 mx-2 ${currentStep === 'review' ? 'bg-market-yellow' : 'bg-gray-200'}`}></div>
            
            <div className={`flex flex-col items-center ${currentStep === 'review' ? 'text-market-yellow' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'review' ? 'bg-market-yellow text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="text-sm font-medium">Revisão</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Shipping Step */}
            {currentStep === 'shipping' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Endereço de Entrega</h2>
                
                <form onSubmit={handleShippingSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo*
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-market-yellow"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email*
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-market-yellow"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone*
                      </label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-market-yellow"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CEP*
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-market-yellow"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço*
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-market-yellow"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade*
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-market-yellow"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado*
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-market-yellow"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País*
                      </label>
                      <select
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-market-yellow"
                        required
                      >
                        <option value="Brasil">Brasil</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Chile">Chile</option>
                        <option value="Colômbia">Colômbia</option>
                        <option value="Peru">Peru</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Shipping Options */}
                  {Object.keys(sellerGroups).length > 0 && shippingInfo.zipCode.length === 8 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Opções de Envio</h3>
                      
                      {Object.keys(sellerGroups).map(sellerId => (
                        <div key={sellerId} className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h4 className="font-medium">{sellerGroups[sellerId].sellerName}</h4>
                            <p className="text-sm text-gray-500">
                              {sellerGroups[sellerId].items.length} {sellerGroups[sellerId].items.length === 1 ? 'item' : 'itens'}
                            </p>
                          </div>
                          
                          <div className="p-4">
                            {shippingOptions[sellerId]?.map((option, index) => (
                              <div key={index} className="mb-2 last:mb-0">
                                <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`shipping-${sellerId}`}
                                    checked={selectedShipping[sellerId]?.days === option.days}
                                    onChange={() => handleShippingSelection(sellerId, option)}
                                    className="h-4 w-4 text-market-yellow focus:ring-market-yellow mr-3"
                                  />
                                  <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                      <div>
                                        <p className="font-medium">
                                          {index === 0 ? 'Envio padrão' : 'Envio expresso'}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                          Entrega em até {option.days} dias úteis
                                        </p>
                                      </div>
                                      <div className="font-semibold mt-2 sm:mt-0">
                                        R$ {option.price.toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                </label>
                              </div>
                            ))}
                            
                            {!shippingOptions[sellerId] && (
                              <div className="text-center py-4 text-gray-500">
                                Calculando opções de envio...
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-market-yellow hover:bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
                    >
                      Continuar para Pagamento
                      <ChevronRight size={18} className="ml-2" />
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Informações de Pagamento</h2>
                
                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número do Cartão*
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo(prev => ({ 
                        ...prev, 
                        cardNumber: formatCardNumber(e.target.value) 
                      }))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-market-yellow"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome no Cartão*
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardHolder}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardHolder: e.target.value }))}
                      placeholder="Nome como está no cartão"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-market-yellow"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data de Validade*
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.expiry}
                        onChange={(e) => setPaymentInfo(prev => ({ 
                          ...prev, 
                          expiry: formatExpiry(e.target.value) 
                        }))}
                        placeholder="MM/AA"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-market-yellow"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV*
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo(prev => ({ 
                          ...prev, 
                          cvv: e.target.value.replace(/\D/g, '').slice(0, 4) 
                        }))}
                        placeholder="123"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-market-yellow"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                      Voltar
                    </button>
                    
                    <button
                      type="submit"
                      className="bg-market-yellow hover:bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
                    >
                      Revisar Pedido
                      <ChevronRight size={18} className="ml-2" />
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Review Step */}
            {currentStep === 'review' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Revisão do Pedido</h2>
                
                {/* Shipping Information */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Endereço de Entrega</h3>
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="text-market-blue hover:text-blue-700 text-sm"
                    >
                      Editar
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{shippingInfo.fullName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} - CEP {shippingInfo.zipCode}</p>
                    <p>{shippingInfo.country}</p>
                    <div className="mt-2 text-gray-500">
                      <p>{shippingInfo.email}</p>
                      <p>{shippingInfo.phone}</p>
                    </div>
                  </div>
                </div>
                
                {/* Payment Information */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Informações de Pagamento</h3>
                    <button
                      onClick={() => setCurrentStep('payment')}
                      className="text-market-blue hover:text-blue-700 text-sm"
                    >
                      Editar
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{paymentInfo.cardHolder}</p>
                    <p>
                      Cartão terminando em {paymentInfo.cardNumber.slice(-4)}
                    </p>
                    <p>Expira em {paymentInfo.expiry}</p>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Itens do Pedido</h3>
                  
                  {Object.values(sellerGroups).map(group => (
                    <div key={group.sellerId} className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h4 className="font-medium">{group.sellerName}</h4>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500">
                            {group.items.length} {group.items.length === 1 ? 'item' : 'itens'}
                          </p>
                          
                          {selectedShipping[group.sellerId] && (
                            <div className="text-sm">
                              <span className="text-gray-500">Entrega:</span>
                              <span className="font-medium ml-1">
                                até {selectedShipping[group.sellerId].days} dias úteis
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="divide-y divide-gray-200">
                        {group.items.map((item: any) => (
                          <div key={item.productId} className="p-4 flex items-center">
                            <div className="w-16 h-16 flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            
                            <div className="ml-4 flex-1">
                              <h5 className="font-medium">{item.name}</h5>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-500">
                                  Qtd: {item.quantity}
                                </p>
                                <p className="font-medium">
                                  R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          R$ {group.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      {selectedShipping[group.sellerId] && (
                        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200">
                          <span className="text-gray-600">Frete:</span>
                          <span className="font-medium">
                            R$ {selectedShipping[group.sellerId].price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Terms and Conditions */}
                <div className="mb-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={isAgreementChecked}
                      onChange={(e) => setIsAgreementChecked(e.target.checked)}
                      className="h-5 w-5 mt-1 text-market-yellow focus:ring-market-yellow mr-3"
                    />
                    <span className="text-sm text-gray-700">
                      Eu li e concordo com os <a href="#" className="text-market-blue hover:underline">Termos e Condições</a> e com a <a href="#" className="text-market-blue hover:underline">Política de Privacidade</a>.
                    </span>
                  </label>
                  
                  {!isAgreementChecked && (
                    <div className="flex items-center text-amber-600 text-sm mt-2">
                      <AlertCircle size={14} className="mr-1" />
                      Você precisa concordar com os termos para finalizar a compra
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('payment')}
                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Voltar
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleOrderSubmit}
                    disabled={loading || !isAgreementChecked}
                    className={`${
                      loading || !isAgreementChecked
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-market-yellow hover:bg-yellow-500'
                    } text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center justify-center`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Processando...</span>
                      </>
                    ) : (
                      <>
                        <span>Finalizar Compra</span>
                        <Check size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Resumo do Pedido</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span>
                    {Object.keys(selectedShipping).length > 0
                      ? `R$ ${shippingTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : 'Calculando...'}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-gray-50 p-4 flex items-center">
                <ShoppingBag size={20} className="text-gray-500 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Seus pedidos estarão disponíveis na página de pedidos após a finalização da compra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
