import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { apiClient } from '../utils/apiClient';

const CartContext = createContext(null);

const STORAGE_KEY = 'brewhouse_cart';

function loadCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { items: [], tableNumber: null };
  } catch {
    return { items: [], tableNumber: null };
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_TABLE': {
      return { ...state, tableNumber: action.payload };
    }
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.itemId === action.payload.itemId);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.itemId === action.payload.itemId
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
      };
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(i => i.itemId !== action.payload),
      };
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(i => i.itemId !== action.payload.itemId),
        };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.itemId === action.payload.itemId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }
    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, null, loadCart);
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (itemId) => dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  const updateQuantity = (itemId, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const setTable = (tableNumber) => dispatch({ type: 'SET_TABLE', payload: tableNumber });

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
