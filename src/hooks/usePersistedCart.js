import { useReducer, useEffect } from 'react';

const STORAGE_KEY = 'cafeqr_cart';
const EXPIRY_MS = 4 * 60 * 60 * 1000; // 4 hours

const initialState = { items: [], tableNumber: null };

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    
    // Check expiry
    if (parsed.savedAt && Date.now() - parsed.savedAt > EXPIRY_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return initialState;
    }
    
    return parsed.state || initialState;
  } catch (err) {
    // Graceful fallback for incognito/private modes or invalid JSON
    return initialState;
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_TABLE':
      return { ...state, tableNumber: action.payload };
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
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.itemId !== action.payload),
      };
    case 'UPDATE_QUANTITY':
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
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function usePersistedCart() {
  const [state, dispatch] = useReducer(cartReducer, null, loadCart);

  useEffect(() => {
    try {
      if (state.items.length === 0 && !state.tableNumber) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        const payload = {
          state,
          savedAt: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (err) {
      // Ignore quota exceeded or private mode errors
    }
  }, [state]);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (itemId) => dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  const updateQuantity = (itemId, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {}
  };
  
  const setTable = (tableNumber) => dispatch({ type: 'SET_TABLE', payload: tableNumber });

  return {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setTable,
  };
}
