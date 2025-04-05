import shippingData from '../data/shipping.json';
import { Product } from './productService';

// Interface para as opções de frete
export interface ShippingOption {
  name: string;
  price: number;
  estimatedDays: number;
  company: string;
  availableCities?: string[];
  isUnavailable?: boolean;
}

interface CEPRange {
  range: string[];
  region: string;
  options: ShippingOption[];
}

interface WeightMultiplier {
  minWeight: number;
  maxWeight: number;
  multiplier: number;
}

interface ValueDiscount {
  minValue: number;
  maxValue: number;
  discount: number;
}

const cepRanges: CEPRange[] = shippingData.cepRanges;
const weightMultipliers: WeightMultiplier[] = shippingData.weightMultipliers;
const valueDiscounts: ValueDiscount[] = shippingData.valueDiscounts;

export const shippingService = {
  /**
   * Calcula opções de frete com base no CEP e no peso total
   */
  calculateShippingOptions: (cep: string, products: Product[], city?: string): ShippingOption[] => {
    // Remover caracteres não numéricos do CEP
    const numericCep = cep.replace(/\D/g, '');
    
    if (numericCep.length !== 8) {
      return [];
    }

    // Encontrar a faixa de CEP correspondente
    const cepRange = cepRanges.find(range => {
      const [min, max] = range.range;
      return numericCep >= min && numericCep <= max;
    });

    if (!cepRange) {
      return [];
    }

    // Calcular peso total
    const totalWeight = products.reduce((sum, product) => sum + product.weight, 0);
    
    // Encontrar o multiplicador de peso adequado
    const weightMultiplier = weightMultipliers.find(wm => 
      totalWeight >= wm.minWeight && totalWeight < wm.maxWeight
    );
    
    const multiplier = weightMultiplier ? weightMultiplier.multiplier : 1;
    
    // Calcular valor total da compra para possíveis descontos
    const totalValue = products.reduce((sum, product) => {
      const discountedPrice = product.price * (1 - product.discount / 100);
      return sum + discountedPrice;
    }, 0);
    
    // Encontrar desconto aplicável com base no valor total
    const valueDiscount = valueDiscounts.find(vd => 
      totalValue >= vd.minValue && totalValue <= vd.maxValue
    );
    
    const discountPercentage = valueDiscount ? valueDiscount.discount : 0;
    
    // Filtrar opções por cidade, se necessário (para entregas no mesmo dia)
    let options = [...cepRange.options];
    
    if (city) {
      options = options.map(option => {
        if (option.availableCities && !option.availableCities.includes(city)) {
          return { ...option, isUnavailable: true };
        }
        return option;
      });
    }
    
    // Calcular preço final de cada opção
    return options.map(option => {
      // Aplicar multiplicador de peso e desconto por valor
      let finalPrice = option.price * multiplier;
      
      // Aplicar desconto se existir
      if (discountPercentage > 0) {
        finalPrice = finalPrice * (1 - discountPercentage / 100);
      }
      
      // Frete grátis para valores muito altos
      if (discountPercentage === 100) {
        finalPrice = 0;
      }
      
      return {
        ...option,
        price: Number(finalPrice.toFixed(2))
      };
    }).filter(option => !option.isUnavailable);
  },

  /**
   * Calcula a data estimada de entrega
   */
  calculateEstimatedDeliveryDate: (estimatedDays: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + estimatedDays);
    
    // Garante que a data não caia em finais de semana
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) { // domingo
      date.setDate(date.getDate() + 1);
    } else if (dayOfWeek === 6) { // sábado
      date.setDate(date.getDate() + 2);
    }
    
    return date;
  },

  /**
   * Verifica se o CEP está em uma área atendida
   */
  isValidCEP: (cep: string): boolean => {
    const numericCep = cep.replace(/\D/g, '');
    
    if (numericCep.length !== 8) {
      return false;
    }
    
    return cepRanges.some(range => {
      const [min, max] = range.range;
      return numericCep >= min && numericCep <= max;
    });
  },

  /**
   * Lista todas as regiões atendidas
   */
  getAvailableRegions: (): string[] => {
    return cepRanges.map(range => range.region);
  }
}; 