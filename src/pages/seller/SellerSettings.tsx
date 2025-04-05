import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SellerLayout from './SellerLayout';
import { toast } from 'sonner';
import { Save, Upload, User, X } from 'lucide-react';

interface SellerData {
  name: string;
  storeName: string;
  email: string;
  phone: string;
  showPhone: boolean;
  bio: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SellerSettings = () => {
  const { user } = useAuth();
  
  // Dados iniciais (simulados)
  const [sellerData, setSellerData] = useState<SellerData>({
    name: user?.name || 'Vendedor Exemplo',
    storeName: user?.storeName || 'Loja Exemplo',
    email: user?.email || 'vendedor@exemplo.com',
    phone: user?.phone || '(11) 98765-4321',
    showPhone: user?.showPhone !== false,
    bio: user?.bio || 'Loja especializada em produtos de alta qualidade.',
    location: {
      country: user?.location?.country || 'Brasil',
      state: user?.location?.state || 'São Paulo',
      city: user?.location?.city || 'São Paulo'
    }
  });
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Estado para imagens
  const [profileImage, setProfileImage] = useState<string>(user?.profileImage || 'https://via.placeholder.com/150');
  const [logoImage, setLogoImage] = useState<string>(user?.logoImage || 'https://via.placeholder.com/150');
  
  // Estado para controle de validação
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  
  // Manipuladores de formulários
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSellerData({
        ...sellerData,
        [parent]: {
          ...sellerData[parent as keyof typeof sellerData] as Record<string, any>,
          [child]: value
        }
      });
    } else if (name === 'showPhone') {
      const checkbox = e.target as HTMLInputElement;
      setSellerData({
        ...sellerData,
        [name]: checkbox.checked
      });
    } else {
      setSellerData({
        ...sellerData,
        [name]: value
      });
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  // Manipuladores de upload de imagens
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simulação de upload - em uma aplicação real, aqui faria o upload para um servidor
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleLogoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simulação de upload - em uma aplicação real, aqui faria o upload para um servidor
    const reader = new FileReader();
    reader.onload = () => {
      setLogoImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Validações
  const validateProfileForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!sellerData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!sellerData.storeName.trim()) {
      newErrors.storeName = 'Nome da loja é obrigatório';
    }
    
    if (!sellerData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(sellerData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (sellerData.phone.trim() && !/^\(\d{2}\) \d{5}-\d{4}$/.test(sellerData.phone)) {
      newErrors.phone = 'Formato de telefone inválido';
    }
    
    if (!sellerData.location.country.trim()) {
      newErrors['location.country'] = 'País é obrigatório';
    }
    
    if (!sellerData.location.state.trim()) {
      newErrors['location.state'] = 'Estado é obrigatório';
    }
    
    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePasswordForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'A senha deve ter pelo menos 8 caracteres';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua nova senha';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submissões de formulário
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }
    
    // Simulação de atualização de perfil
    // Em uma aplicação real, aqui você enviaria os dados para um servidor
    toast.success('Perfil atualizado com sucesso!');
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }
    
    // Simulação de alteração de senha
    // Em uma aplicação real, aqui você enviaria os dados para um servidor
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    toast.success('Senha alterada com sucesso!');
  };
  
  return (
    <SellerLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da Esquerda - Upload de Imagens */}
          <div className="space-y-6">
            {/* Upload de Foto de Perfil */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Foto de Perfil</h2>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img 
                    src={profileImage} 
                    alt="Foto de perfil" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                  {profileImage !== 'https://via.placeholder.com/150' && (
                    <button
                      onClick={() => setProfileImage('https://via.placeholder.com/150')}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      title="Remover imagem"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <label className="flex items-center justify-center px-4 py-2 bg-market-blue text-white rounded-md cursor-pointer hover:bg-blue-700">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="sr-only"
                  />
                  <Upload size={16} className="mr-2" />
                  Enviar foto
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  JPG, PNG ou GIF. Máximo 2MB.
                </p>
              </div>
            </div>
            
            {/* Upload de Logo da Loja */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Logo da Loja</h2>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img 
                    src={logoImage} 
                    alt="Logo da loja" 
                    className="w-32 h-32 object-contain border border-gray-200 rounded-md p-2"
                  />
                  {logoImage !== 'https://via.placeholder.com/150' && (
                    <button
                      onClick={() => setLogoImage('https://via.placeholder.com/150')}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      title="Remover logo"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <label className="flex items-center justify-center px-4 py-2 bg-market-blue text-white rounded-md cursor-pointer hover:bg-blue-700">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoImageUpload}
                    className="sr-only"
                  />
                  <Upload size={16} className="mr-2" />
                  Enviar logo
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  JPG, PNG ou GIF. Máximo 2MB.
                </p>
              </div>
            </div>
          </div>
          
          {/* Coluna da Direita - Formulários */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formulário de Dados do Vendedor */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Dados do Vendedor</h2>
                <p className="text-sm text-gray-500">
                  Estas informações serão exibidas publicamente
                </p>
              </div>
              <form onSubmit={handleProfileSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nome *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={sellerData.name}
                      onChange={handleProfileChange}
                      className={`mt-1 block w-full p-2 border ${profileErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {profileErrors.name && <p className="text-red-500 text-xs">{profileErrors.name}</p>}
                  </div>
                  
                  {/* Nome da Loja */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nome da Loja *
                    </label>
                    <input
                      type="text"
                      name="storeName"
                      value={sellerData.storeName}
                      onChange={handleProfileChange}
                      className={`mt-1 block w-full p-2 border ${profileErrors.storeName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {profileErrors.storeName && <p className="text-red-500 text-xs">{profileErrors.storeName}</p>}
                  </div>
                  
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={sellerData.email}
                      onChange={handleProfileChange}
                      className={`mt-1 block w-full p-2 border ${profileErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {profileErrors.email && <p className="text-red-500 text-xs">{profileErrors.email}</p>}
                  </div>
                  
                  {/* Telefone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Telefone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={sellerData.phone}
                      onChange={handleProfileChange}
                      placeholder="(11) 98765-4321"
                      className={`mt-1 block w-full p-2 border ${profileErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {profileErrors.phone && <p className="text-red-500 text-xs">{profileErrors.phone}</p>}
                  </div>
                  
                  {/* Exibir Telefone */}
                  <div className="md:col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      id="showPhone"
                      name="showPhone"
                      checked={sellerData.showPhone}
                      onChange={handleProfileChange}
                      className="h-4 w-4 text-market-blue focus:ring-market-blue border-gray-300 rounded"
                    />
                    <label htmlFor="showPhone" className="ml-2 block text-sm text-gray-900">
                      Exibir número de telefone para os clientes
                    </label>
                  </div>
                  
                  {/* País */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      País *
                    </label>
                    <input
                      type="text"
                      name="location.country"
                      value={sellerData.location.country}
                      onChange={handleProfileChange}
                      className={`mt-1 block w-full p-2 border ${profileErrors['location.country'] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {profileErrors['location.country'] && <p className="text-red-500 text-xs">{profileErrors['location.country']}</p>}
                  </div>
                  
                  {/* Estado */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Estado *
                    </label>
                    <input
                      type="text"
                      name="location.state"
                      value={sellerData.location.state}
                      onChange={handleProfileChange}
                      className={`mt-1 block w-full p-2 border ${profileErrors['location.state'] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {profileErrors['location.state'] && <p className="text-red-500 text-xs">{profileErrors['location.state']}</p>}
                  </div>
                  
                  {/* Cidade */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="location.city"
                      value={sellerData.location.city}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  {/* Bio/Descrição */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Descrição da Loja
                    </label>
                    <textarea
                      name="bio"
                      value={sellerData.bio}
                      onChange={handleProfileChange}
                      rows={4}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Descreva sua loja e seus produtos..."
                    ></textarea>
                  </div>
                  
                  {/* Botão de Salvar */}
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 bg-market-blue text-white rounded-md hover:bg-blue-700"
                    >
                      <Save size={16} className="mr-2" />
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Formulário de Alteração de Senha */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Alterar Senha</h2>
                <p className="text-sm text-gray-500">
                  Atualize sua senha de acesso
                </p>
              </div>
              <form onSubmit={handlePasswordSubmit} className="p-6">
                <div className="space-y-4">
                  {/* Senha Atual */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Senha Atual *
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`mt-1 block w-full p-2 border ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {passwordErrors.currentPassword && <p className="text-red-500 text-xs">{passwordErrors.currentPassword}</p>}
                  </div>
                  
                  {/* Nova Senha */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nova Senha *
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`mt-1 block w-full p-2 border ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {passwordErrors.newPassword && <p className="text-red-500 text-xs">{passwordErrors.newPassword}</p>}
                  </div>
                  
                  {/* Confirmar Nova Senha */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Confirmar Nova Senha *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`mt-1 block w-full p-2 border ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {passwordErrors.confirmPassword && <p className="text-red-500 text-xs">{passwordErrors.confirmPassword}</p>}
                  </div>
                  
                  {/* Botão de Salvar */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 bg-market-blue text-white rounded-md hover:bg-blue-700"
                    >
                      <Save size={16} className="mr-2" />
                      Alterar Senha
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerSettings; 