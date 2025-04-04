
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, Info, ShieldCheck, ArrowLeft, MapPin, Clock } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types/Product';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [shippingZipCode, setShippingZipCode] = useState('');
  const [shippingInfo, setShippingInfo] = useState<{ price: number; days: number } | null>(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  useEffect(() => {
    if (productId) {
      // Simulate API delay
      setTimeout(() => {
        const foundProduct = getProductById(productId);
        if (foundProduct) {
          setProduct(foundProduct);
        }
        setLoading(false);
      }, 500);
    }
  }, [productId, getProductById]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.name} adicionado ao carrinho!`);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const calculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (shippingZipCode.length !== 8) {
      toast.error('Por favor, insira um CEP válido');
      return;
    }

    setCalculatingShipping(true);

    // Simulate shipping calculation API call
    setTimeout(() => {
      // Generate random shipping values for demo
      const shippingPrice = Math.floor(Math.random() * 40) + 10;
      const shippingDays = Math.floor(Math.random() * 10) + 3;
      
      setShippingInfo({
        price: shippingPrice,
        days: shippingDays
      });
      
      setCalculatingShipping(false);
    }, 1000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 w-48 mb-6"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="bg-gray-300 h-96 rounded-lg mb-4"></div>
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-300 w-24 h-24 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gray-300 h-10 w-3/4 mb-4"></div>
                <div className="bg-gray-300 h-6 w-1/4 mb-6"></div>
                <div className="bg-gray-300 h-32 w-full mb-6"></div>
                <div className="bg-gray-300 h-10 w-1/3 mb-4"></div>
                <div className="bg-gray-300 h-12 w-full mb-6"></div>
                <div className="bg-gray-300 h-12 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <p className="text-gray-600 mb-8">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-market-blue hover:text-blue-700 mx-auto"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6 text-sm">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-500 hover:text-market-blue"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Voltar</span>
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-500">{product.category}</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700 font-medium truncate">{product.name}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg overflow-hidden mb-4 border">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-96 object-contain"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-24 h-24 border-2 rounded overflow-hidden flex-shrink-0 ${
                    selectedImage === index ? 'border-market-yellow' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin size={14} className="mr-1" />
              <span>{product.seller.location.state}, {product.seller.location.country}</span>
              <span className="mx-2">•</span>
              <span>Vendido por <span className="font-medium">{product.seller.name}</span></span>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <Star size={18} className="text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{product.seller.reputation.toFixed(1)}</span>
              </div>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-gray-500">
                {product.sales} vendidos
              </span>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-800">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2">Descrição</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            {/* Stock Info */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Info size={18} className="mr-2 text-market-blue" />
                <span className="font-medium">
                  {product.stock > 0 
                    ? `${product.stock} unidades disponíveis` 
                    : 'Produto esgotado'}
                </span>
              </div>
            </div>
            
            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block font-medium mb-2">Quantidade</label>
                <div className="flex items-center">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l text-lg disabled:opacity-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max={product.stock}
                    className="w-20 h-10 border-y border-gray-300 text-center"
                  />
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r text-lg disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            {/* Shipping Calculator */}
            <div className="mb-6">
              <label className="block font-medium mb-2">Calcular Frete</label>
              <form onSubmit={calculateShipping} className="flex">
                <input
                  type="text"
                  placeholder="Digite seu CEP"
                  value={shippingZipCode}
                  onChange={(e) => setShippingZipCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-market-yellow"
                />
                <button
                  type="submit"
                  disabled={calculatingShipping || shippingZipCode.length !== 8}
                  className="bg-market-blue hover:bg-blue-700 text-white px-4 py-2 rounded-r disabled:opacity-50"
                >
                  Calcular
                </button>
              </form>
              
              {calculatingShipping && (
                <div className="mt-2 text-gray-600">
                  <span className="animate-pulse">Calculando frete...</span>
                </div>
              )}
              
              {shippingInfo && (
                <div className="mt-2 flex items-center text-gray-700">
                  <Truck size={18} className="mr-2 text-market-blue" />
                  <span>
                    Entrega por R$ {shippingInfo.price.toFixed(2)} em até {shippingInfo.days} dias úteis
                  </span>
                </div>
              )}
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-3 px-6 rounded-lg font-medium mb-4 ${
                product.stock > 0
                  ? 'bg-market-yellow hover:bg-yellow-500 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
            </button>
            
            {/* Additional Info */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">Informações</h3>
              <div className="space-y-3">
                <div className="flex">
                  <ShieldCheck size={20} className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Garantia de 30 dias direto com o vendedor
                  </span>
                </div>
                <div className="flex">
                  <Truck size={20} className="text-blue-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Envio para todo o Brasil
                  </span>
                </div>
                <div className="flex">
                  <Clock size={20} className="text-orange-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Tempo de processamento: 1-2 dias úteis
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
