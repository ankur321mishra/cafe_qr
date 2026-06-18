import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { usePersistedCart } from '../hooks/usePersistedCart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setTable,
  } = usePersistedCart();

  const [taxRate, setTaxRate] = useState(5); // default 5%, will be overridden by settings

  // Fetch tax rate from public settings
  useEffect(() => {
    apiClient('/api/v1/settings/public')
      .then(res => {
        if (res.success && res.data?.taxRate != null) {
          setTaxRate(res.data.taxRate);
        }
      })
      .catch(() => {
        // Settings fetch failed — use default 5%
      });
  }, []);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * (taxRate / 100));
  const total = subtotal + tax;

  return (
    <CartContext.Provider value={{
      items: state.items,
      tableNumber: state.tableNumber,
      itemCount,
      subtotal,
      tax,
      taxRate,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setTable,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
