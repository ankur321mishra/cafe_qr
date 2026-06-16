import { createContext, useContext, useReducer, useEffect } from 'react';
import { menuItems as initialMenuItems, categories as initialCategories } from '../data/menuData';

const MenuContext = createContext(null);

const STORAGE_KEY = 'brewhouse_menu';
const CATEGORIES_KEY = 'brewhouse_categories';

function loadMenu() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initialMenuItems;
  } catch {
    return initialMenuItems;
  }
}

function loadCategories() {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : initialCategories;
  } catch {
    return initialCategories;
  }
}

function menuReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = {
        ...action.payload,
        id: `item-${Date.now()}`,
      };
      return { ...state, items: [...state.items, newItem] };
    }
    case 'UPDATE_ITEM': {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        ),
      };
    }
    case 'DELETE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    }
    case 'TOGGLE_AVAILABILITY': {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, isAvailable: !item.isAvailable }
            : item
        ),
      };
    }
    case 'ADD_CATEGORY': {
      return { ...state, categories: [...state.categories, action.payload] };
    }
    case 'DELETE_CATEGORY': {
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      };
    }
    default:
      return state;
  }
}

export function MenuProvider({ children }) {
  const [state, dispatch] = useReducer(menuReducer, null, () => ({
    items: loadMenu(),
    categories: loadCategories(),
  }));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(state.categories));
  }, [state]);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const updateItem = (item) => dispatch({ type: 'UPDATE_ITEM', payload: item });
  const deleteItem = (id) => dispatch({ type: 'DELETE_ITEM', payload: id });
  const toggleAvailability = (id) => dispatch({ type: 'TOGGLE_AVAILABILITY', payload: id });
  const addCategory = (cat) => dispatch({ type: 'ADD_CATEGORY', payload: cat });
  const deleteCategory = (id) => dispatch({ type: 'DELETE_CATEGORY', payload: id });

  const getItemsByCategory = (categoryId) =>
    categoryId === 'all'
      ? state.items.filter(i => i.isAvailable)
      : state.items.filter(i => i.category === categoryId && i.isAvailable);

  const getPopularItems = () => state.items.filter(i => i.isPopular && i.isAvailable);
  const getFeaturedItems = () => state.items.filter(i => i.isFeatured && i.isAvailable);
  const getItem = (id) => state.items.find(i => i.id === id);

  return (
    <MenuContext.Provider value={{
      items: state.items,
      categories: state.categories,
      addItem,
      updateItem,
      deleteItem,
      toggleAvailability,
      addCategory,
      deleteCategory,
      getItemsByCategory,
      getPopularItems,
      getFeaturedItems,
      getItem,
    }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within MenuProvider');
  return context;
}
