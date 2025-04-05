import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useAuth } from '../../contexts/AuthContext';
import SellerLayout from './SellerLayout';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';

const SellerProductCreate = () => {
  const navigate = useNavigate();
  const { addProduct, categories } = useProducts();
  const { user } = useAuth();
  
  // Estado para as imagens
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  
  // Estado para dados do produto
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    brand: '',
    sku: '',
    location: {
      country: 'Brasil',
      state: '',
    },
    isActive: true
  });
  
  // Estado para nova categoria (caso o usuário queira criar uma)
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  
  // Estado para controle de validação
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProductData({
        ...productData,
        [parent]: {
          ...productData[parent as keyof typeof productData] as Record<string, any>,
          [child]: value
        }
      });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Apenas permite números e ponto decimal
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setProductData({ ...productData, [name]: value });
    }
  };
  
  const addImageUrl = () => {
    if (!imageUrl) return;
    
    if (!imageUrl.startsWith('http')) {
      toast.error('URL de imagem inválida. Deve começar com http:// ou https://');
      return;
    }
    
    if (images.includes(imageUrl)) {
      toast.error('Esta imagem já foi adicionada');
      return;
    }
    
    setImages([...images, imageUrl]);
    setImageUrl('');
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Simulação de upload - em uma aplicação real, aqui faria o upload para um servidor
    Array.from(files).forEach(file => {
      // Cria uma URL temporária para o arquivo (apenas para simulação)
      const tempUrl = URL.createObjectURL(file);
      setImages(prev => [...prev, tempUrl]);
    });
    
    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!productData.name.trim()) {
      newErrors.name = 'O nome do produto é obrigatório';
    }
    
    if (!productData.description.trim()) {
      newErrors.description = 'A descrição do produto é obrigatória';
    }
    
    if (!productData.price || Number(productData.price) <= 0) {
      newErrors.price = 'Informe um preço válido';
    }
    
    if (!productData.category && !newCategory) {
      newErrors.category = 'Selecione ou crie uma categoria';
    }
    
    if (!productData.stock || Number(productData.stock) < 0) {
      newErrors.stock = 'Informe a quantidade em estoque';
    }
    
    if (images.length === 0) {
      newErrors.images = 'Adicione pelo menos uma imagem do produto';
    }
    
    if (!productData.location.state) {
      newErrors['location.state'] = 'Informe o estado';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }
    
    // Se o usuário criou uma nova categoria, use-a
    const finalCategory = showNewCategoryInput && newCategory 
      ? newCategory 
      : productData.category;
    
    // Converte valores de string para número
    const newProduct = {
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
      category: finalCategory,
      images,
      sales: 0,
      seller: {
        id: user?.id || 's1', // Usamos um ID padrão se não houver usuário (apenas para simulação)
        name: user?.name || 'Vendedor Teste',
        reputation: user?.reputation || 4.5,
        location: productData.location
      }
    };
    
    addProduct(newProduct);
    toast.success('Produto cadastrado com sucesso!');
    navigate('/seller/products');
  };
  
  return (
    <SellerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/seller/products')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Cadastrar Novo Produto</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações Básicas */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Informações Básicas</h2>
              </div>
              
              {/* Nome do Produto */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  placeholder="Ex: Smartphone Galaxy S23"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
              
              {/* Marca */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Marca
                </label>
                <input
                  type="text"
                  name="brand"
                  value={productData.brand}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Ex: Samsung"
                />
              </div>
              
              {/* Preço */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Preço (R$) *
                </label>
                <input
                  type="text"
                  name="price"
                  value={productData.price}
                  onChange={handleNumberChange}
                  className={`mt-1 block w-full p-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  placeholder="Ex: 1999.90"
                />
                {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
              </div>
              
              {/* Estoque */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Quantidade em Estoque *
                </label>
                <input
                  type="text"
                  name="stock"
                  value={productData.stock}
                  onChange={handleNumberChange}
                  className={`mt-1 block w-full p-2 border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  placeholder="Ex: 10"
                />
                {errors.stock && <p className="text-red-500 text-xs">{errors.stock}</p>}
              </div>
              
              {/* Categoria */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Categoria *
                </label>
                {showNewCategoryInput ? (
                  <div className="flex">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className={`mt-1 block w-full p-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-l-md`}
                      placeholder="Digite a nova categoria"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewCategoryInput(false)}
                      className="bg-gray-200 px-4 rounded-r-md hover:bg-gray-300"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex">
                    <select
                      name="category"
                      value={productData.category}
                      onChange={handleChange}
                      className={`mt-1 block w-full p-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-l-md`}
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCategoryInput(true)}
                      className="bg-gray-200 px-4 rounded-r-md hover:bg-gray-300"
                      title="Criar nova categoria"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                )}
                {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
              </div>
              
              {/* SKU */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  SKU (Código de Produto)
                </label>
                <input
                  type="text"
                  name="sku"
                  value={productData.sku}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Ex: PROD-12345"
                />
              </div>
              
              {/* Descrição */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição do Produto *
                </label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`mt-1 block w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  placeholder="Descreva seu produto com detalhes: características, especificações, diferenciais..."
                ></textarea>
                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
              </div>
              
              {/* Localização */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Localização do Produto</h2>
              </div>
              
              {/* País */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  País
                </label>
                <input
                  type="text"
                  name="location.country"
                  value={productData.location.country}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Estado */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Estado *
                </label>
                <input
                  type="text"
                  name="location.state"
                  value={productData.location.state}
                  onChange={handleChange}
                  className={`mt-1 block w-full p-2 border ${errors['location.state'] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  placeholder="Ex: São Paulo"
                />
                {errors['location.state'] && <p className="text-red-500 text-xs">{errors['location.state']}</p>}
              </div>
              
              {/* Imagens */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Imagens do Produto</h2>
                
                {/* Upload de imagens */}
                <div className="mb-4">
                  <div className="flex items-center space-x-4">
                    {/* Upload de arquivos */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fazer upload de imagens
                      </label>
                      <label className="flex justify-center items-center p-4 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                        <div className="space-y-1 text-center">
                          <Upload size={32} className="mx-auto text-gray-400" />
                          <div className="text-sm text-gray-600">
                            Arraste e solte ou clique para selecionar
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, JPEG (Max 5MB)
                          </p>
                        </div>
                      </label>
                    </div>
                    
                    {/* Ou usar URL */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ou adicione URL da imagem
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-l-md"
                          placeholder="https://exemplo.com/imagem.jpg"
                        />
                        <button
                          type="button"
                          onClick={addImageUrl}
                          className="bg-market-blue text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Visualização das imagens */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagens do Produto *
                  </label>
                  
                  {images.length === 0 ? (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center text-gray-500">
                      Nenhuma imagem adicionada
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative border rounded-md overflow-hidden group">
                          <img
                            src={image}
                            alt={`Produto ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.images && <p className="text-red-500 text-xs mt-2">{errors.images}</p>}
                </div>
              </div>
              
              {/* Status */}
              <div className="md:col-span-2 flex items-center mt-4">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={productData.isActive}
                  onChange={(e) => setProductData({ ...productData, isActive: e.target.checked })}
                  className="h-4 w-4 text-market-blue focus:ring-market-blue border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Ativar produto para venda imediatamente
                </label>
              </div>
              
              {/* Botões */}
              <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/seller/products')}
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-market-blue hover:bg-blue-700"
                >
                  Cadastrar Produto
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerProductCreate; 