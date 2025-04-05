import productsData from '../data/products.json';

export interface ProductDimensions {
  height: number;
  width: number;
  depth: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  discount: number;
  weight: number;
  dimensions: ProductDimensions;
  sellerId: string;
  brand?: string;
  sku?: string;
  sales: number;
  createdAt: string;
  updatedAt: string;
}

let products: Product[] = [...productsData];

export const productService = {
  /**
   * Busca todos os produtos
   */
  getAll: (): Product[] => {
    return products;
  },

  /**
   * Busca produtos por ID do vendedor
   */
  getBySellerId: (sellerId: string): Product[] => {
    return products.filter(product => product.sellerId === sellerId);
  },

  /**
   * Busca um produto por ID
   */
  getById: (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  },

  /**
   * Busca produtos por termo de pesquisa (nome, descrição, marca, SKU)
   */
  searchProducts: (term: string, sellerId?: string): Product[] => {
    if (!term && !sellerId) return products;
    
    const searchTerm = term ? term.toLowerCase() : '';
    let filteredProducts = products;
    
    if (sellerId) {
      filteredProducts = filteredProducts.filter(product => product.sellerId === sellerId);
    }
    
    if (!term) return filteredProducts;
    
    return filteredProducts.filter(
      product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm)) ||
        product.category.toLowerCase().includes(searchTerm)
    );
  },

  /**
   * Filtra produtos por categoria
   */
  filterByCategory: (category: string, sellerId?: string): Product[] => {
    let filteredProducts = products.filter(product => product.category === category);
    
    if (sellerId) {
      filteredProducts = filteredProducts.filter(product => product.sellerId === sellerId);
    }
    
    return filteredProducts;
  },

  /**
   * Lista todas as categorias disponíveis
   */
  getCategories: (sellerId?: string): string[] => {
    const allProducts = sellerId 
      ? products.filter(product => product.sellerId === sellerId) 
      : products;
      
    const categories = new Set<string>();
    allProducts.forEach(product => categories.add(product.category));
    
    return Array.from(categories).sort();
  },

  /**
   * Atualiza o estoque de um produto
   */
  updateStock: (productId: string, quantity: number): Product | undefined => {
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return undefined;
    }
    
    const product = products[productIndex];
    const updatedProduct = {
      ...product,
      stock: Math.max(0, product.stock - quantity),
      sales: product.sales + quantity,
      updatedAt: new Date().toISOString()
    };
    
    products = [
      ...products.slice(0, productIndex),
      updatedProduct,
      ...products.slice(productIndex + 1)
    ];
    
    return updatedProduct;
  },

  /**
   * Verifica se um produto tem estoque suficiente
   */
  hasStock: (productId: string, quantity: number): boolean => {
    const product = products.find(p => p.id === productId);
    return !!product && product.stock >= quantity;
  }
}; 