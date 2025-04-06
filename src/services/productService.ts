import api from './api';
import productsData from '../data/products.json';

export interface Product {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categorias: string[];
  imagens: string[];
  vendedorId: number;
  dataCadastro: string;
  discount?: number;
  weight?: number;
  dimensions?: {
    height: number;
    width: number;
    depth: number;
  };
  brand?: string;
  sku?: string;
  sales?: number;
  updatedAt?: string;
}

// Interface para os dados locais
interface LocalProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  sellerId: string;
  discount: number;
  weight: number;
  dimensions: {
    height: number;
    width: number;
    depth: number;
  };
  brand?: string;
  sku?: string;
  sales: number;
  createdAt: string;
  updatedAt: string;
}

// Mapeamento dos dados locais para o formato da API
const mapLocalProductToApiProduct = (localProduct: LocalProduct): Product => {
  return {
    id: parseInt(localProduct.id.replace('prod', ''), 10),
    nome: localProduct.name,
    descricao: localProduct.description,
    preco: localProduct.price,
    estoque: localProduct.stock,
    categorias: [localProduct.category],
    imagens: localProduct.images,
    vendedorId: parseInt(localProduct.sellerId.replace('seller', ''), 10),
    dataCadastro: localProduct.createdAt,
    discount: localProduct.discount,
    weight: localProduct.weight,
    dimensions: localProduct.dimensions,
    brand: localProduct.brand,
    sku: localProduct.sku,
    sales: localProduct.sales,
    updatedAt: localProduct.updatedAt
  };
};

// Mapeamento dos dados locais
const mappedProducts: Product[] = (productsData as LocalProduct[]).map(mapLocalProductToApiProduct);

export const productService = {
  /**
   * Busca todos os produtos da API
   */
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>('/produtos');
      return response;
    } catch (error) {
      console.error('Erro ao buscar produtos da API, usando dados locais:', error);
      return mappedProducts;
    }
  },

  /**
   * Busca um produto por ID
   */
  getById: async (id: number): Promise<Product | undefined> => {
    try {
      const response = await api.get<Product>(`/produtos/${id}`);
      return response;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id} da API, usando dados locais:`, error);
      return mappedProducts.find(product => product.id === id);
    }
  },

  /**
   * Busca produtos por categoria
   */
  getByCategory: async (category: string): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>(`/produtos/categoria/${category}`);
      return response;
    } catch (error) {
      console.error(`Erro ao buscar produtos da categoria ${category} da API, usando dados locais:`, error);
      return mappedProducts.filter(product => 
        product.categorias && product.categorias.includes(category)
      );
    }
  },

  /**
   * Busca produtos de um vendedor específico
   */
  getByVendedor: async (vendedorId: number): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>(`/produtos/vendedor/${vendedorId}`);
      return response;
    } catch (error) {
      console.error(`Erro ao buscar produtos do vendedor ${vendedorId} da API, usando dados locais:`, error);
      return mappedProducts.filter(product => product.vendedorId === vendedorId);
    }
  },

  /**
   * Cria um novo produto
   */
  createProduct: async (productData: Omit<Product, 'id' | 'dataCadastro'>): Promise<Product> => {
    return api.post<Product>('/produtos', productData);
  },

  /**
   * Atualiza um produto existente
   */
  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    return api.put<Product>(`/produtos/${id}`, productData);
  },

  /**
   * Remove um produto
   */
  deleteProduct: async (id: number): Promise<void> => {
    return api.delete(`/produtos/${id}`);
  },

  /**
   * Busca produtos por termo de pesquisa
   */
  searchProducts: async (term: string): Promise<Product[]> => {
    return api.get<Product[]>(`/produtos/search?q=${encodeURIComponent(term)}`);
  },

  /**
   * Retorna todas as categorias de produtos
   */
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await api.get<string[]>('/produtos/categorias');
      return response;
    } catch (error) {
      console.error('Erro ao buscar categorias da API, usando dados locais:', error);
      const categories = new Set<string>();
      mappedProducts.forEach(product => product.categorias.forEach(category => categories.add(category)));
      return Array.from(categories).sort();
    }
  }
}; 