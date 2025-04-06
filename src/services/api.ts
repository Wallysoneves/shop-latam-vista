const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface ApiOptions extends RequestInit {
  data?: any;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(url: string, options: ApiOptions = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const headers = new Headers(options.headers || {});
    
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    
    // Se temos dados para enviar, adiciona o Content-Type e converte para JSON
    if (options.data) {
      headers.append('Content-Type', 'application/json');
      options.body = JSON.stringify(options.data);
      delete options.data;
    }

    const config: RequestInit = {
      ...options,
      headers
    };

    try {
      const response = await fetch(`${this.baseUrl}${url}`, config);
      
      // Se a resposta for 401, remove o token e redireciona para o login
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Sessão expirada ou inválida');
      }
      
      // Para respostas de erro, lança uma exceção com a mensagem
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }
      
      // Se a resposta for 204 (No Content) ou for vazia, retorna null
      if (response.status === 204 || response.headers.get('Content-Length') === '0') {
        return null as T;
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  public get<T>(url: string, options: ApiOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  public post<T>(url: string, data: any, options: ApiOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'POST', data });
  }

  public put<T>(url: string, data: any, options: ApiOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PUT', data });
  }

  public patch<T>(url: string, data: any, options: ApiOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PATCH', data });
  }

  public delete<T>(url: string, options: ApiOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

export default new ApiService(API_BASE_URL); 