import api from './api';

export interface ILoginRequest {
  email: string;
  senha: string;
}

export interface IClienteRegistroRequest {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string;
  rg?: string;
  dataNascimento?: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
  };
}

export interface IVendedorRegistroRequest {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  documento: string; // CPF ou CNPJ
  tipoDocumento: 'CPF' | 'CNPJ';
}

export interface ILoginResponse {
  token: string;
  userId: number;
  nome: string;
  tipoUsuario: 'CLIENTE' | 'VENDEDOR';
}

export const authService = {
  /**
   * Realiza login de usuário
   */
  login: async (credentials: ILoginRequest): Promise<ILoginResponse> => {
    return api.post<ILoginResponse>('/auth/login', credentials);
  },

  /**
   * Registra um novo cliente
   */
  registrarCliente: async (clienteData: IClienteRegistroRequest): Promise<ILoginResponse> => {
    return api.post<ILoginResponse>('/auth/registro/cliente', clienteData);
  },

  /**
   * Registra um novo vendedor
   */
  registrarVendedor: async (vendedorData: IVendedorRegistroRequest): Promise<ILoginResponse> => {
    return api.post<ILoginResponse>('/auth/registro/vendedor', vendedorData);
  },

  /**
   * Solicita recuperação de senha
   */
  recuperarSenha: async (email: string): Promise<void> => {
    return api.post<void>('/auth/recover-password', { email });
  },

  /**
   * Verifica se o token é válido
   */
  verificarToken: async (): Promise<boolean> => {
    try {
      await api.get<void>('/auth/verifica-token');
      return true;
    } catch (error) {
      return false;
    }
  }
}; 