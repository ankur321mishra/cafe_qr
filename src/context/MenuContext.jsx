import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { useAuth } from './AuthContext';

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      setIsLoading(true);
      const [itemsRes, catsRes] = await Promise.all([
        apiClient('/api/v1/menu/items'),
        apiClient('/api/v1/menu/categories')
      ]);
      
      if (itemsRes.success) setItems(itemsRes.data);
      if (catsRes.success) setCategories(catsRes.data);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && user) {
      fetchMenu();
    }
  }, [isAuthLoading, user]);

  const addItem = async (item) => {
    try {
      // Find the DB ID for the category slug
      const cat = categories.find(c => c.id === item.category);
      if (!cat) throw new Error('Invalid category');

      const payload = { ...item, categoryId: cat._dbId };
      delete payload.category; // backend expects categoryId

      const res = await apiClient('/api/v1/menu/items', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setItems(prev => [...prev, res.data]);
        return { success: true };
      }
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const updateItem = async (item) => {
    try {
      const payload = { ...item };
      if (payload.category) {
        const cat = categories.find(c => c.id === payload.category);
        if (cat) payload.categoryId = cat._dbId;
        delete payload.category;
      }

      const res = await apiClient(`/api/v1/menu/items/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setItems(prev => prev.map(i => i.id === item.id ? res.data : i));
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteItem = async (id) => {
    try {
      await apiClient(`/api/v1/menu/items/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(i => i.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleAvailability = async (id) => {
    try {
      const res = await apiClient(`/api/v1/menu/items/${id}/availability`, { method: 'PATCH' });
      if (res.success) {
        setItems(prev => prev.map(i => i.id === id ? res.data : i));
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addCategory = async (cat) => {
    try {
      const res = await apiClient('/api/v1/menu/categories', {
        method: 'POST',
        body: JSON.stringify(cat),
      });
      if (res.success) {
        setCategories(prev => [...prev, res.data]);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      // id is the slug in frontend, so we need the DB ID
      const cat = categories.find(c => c.id === id);
      if (!cat) return;
      await apiClient(`/api/v1/menu/categories/${cat._dbId}`, { method: 'DELETE' });
      setCategories(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getItemsByCategory = (categoryId) =>
    categoryId === 'all'
      ? items.filter(i => i.isAvailable)
      : items.filter(i => i.category === categoryId && i.isAvailable);

  const getPopularItems = () => items.filter(i => i.isPopular && i.isAvailable);
  const getFeaturedItems = () => items.filter(i => i.isFeatured && i.isAvailable);
  const getItem = (id) => items.find(i => i.id === id);

  return (
    <MenuContext.Provider value={{
      items,
      categories,
      isLoading,
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
      refreshMenu: fetchMenu,
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

