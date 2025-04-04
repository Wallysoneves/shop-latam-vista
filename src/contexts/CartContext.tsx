
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '../types/Product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  calculateSubtotal: () => number;
  itemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemsCount, setItemsCount] = useState(0);

  useEffect(() => {
    // Calculate total items count whenever items change
    const count = items.reduce((total, item) => total + item.quantity, 0);
    setItemsCount(count);
  }, [items]);

  const addToCart = (product: Product, quantity: number) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id
      );

      if (existingItemIndex !== -1) {
        // Update quantity if product already in cart
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        
        // Check if new quantity exceeds stock
        if (newQuantity <= product.stock) {
          updatedItems[existingItemIndex].quantity = newQuantity;
        } else {
          updatedItems[existingItemIndex].quantity = product.stock;
        }
        
        return updatedItems;
      } else {
        // Add new item to cart
        return [...prevItems, { product, quantity: Math.min(quantity, product.stock) }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => 
      prevItems.filter(item => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: Math.min(quantity, item.product.stock) } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const calculateSubtotal = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity, 
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateSubtotal,
        itemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
