import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { apiClient } from '../utils/apiClient';
import { useAuth } from './AuthContext';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useRef(true);

  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await apiClient('/api/v1/orders?limit=100');
      if (res.success && mounted.current) {
        // Backend returns { orders, meta } — use orders array directly
        // serializeOrder already provides: id (orderNumber), status (lowercase),
        // total, items with name/price/quantity, tableNumber, createdAt, etc.
        const orderList = res.data.orders || res.data;
        setOrders(Array.isArray(orderList) ? orderList : []);
      }
    } catch (err) {
      // 401 Unauthorized is expected for unauthenticated customers
      // We silently ignore it
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    fetchOrders();
    // Only poll when authenticated (admin view)
    if (isAuthenticated) {
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const addOrder = async (orderData) => {
    try {
      const payload = {
        tableNumber: parseInt(orderData.tableNumber, 10),
        items: orderData.items.map(i => ({
          menuItemId: i.itemId,
          quantity: i.quantity
        })),
        specialInstructions: orderData.specialInstructions || ''
      };

      const res = await apiClient('/api/v1/orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (res.success) {
        // serializeOrder output: id = orderNumber, total, status (lowercase), etc.
        const newOrder = res.data;
        setOrders(prev => [newOrder, ...prev]);
        return newOrder.id; // id is the orderNumber (e.g. "ORD-001")
      }
    } catch (err) {
      console.error('Failed to create order:', err);
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await apiClient(`/api/v1/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: status.toUpperCase() })
      });

      if (res.success) {
        setOrders(prev => prev.map(o => 
          o.id === orderId 
            ? { ...o, status: res.data.status, updatedAt: res.data.updatedAt } 
            : o
        ));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const deleteOrder = async (orderId) => {
    // Backend doesn't support deleting orders (they are immutable for financial reasons)
    // We just remove from local state or cancel it
    updateOrderStatus(orderId, 'CANCELLED');
  };

  const getOrder = async (orderId) => {
    // If in state, return it
    const local = orders.find(o => o.id === orderId);
    if (local) return local;

    try {
      const res = await apiClient(`/api/v1/orders/${orderId}`);
      if (res.success) {
        // serializeOrder already returns the correct shape
        return res.data;
      }
    } catch (err) {
      return null;
    }
  };

  const getOrdersByStatus = (status) =>
    status === 'all' ? orders : orders.filter(o => o.status === status);

  const getTodayOrders = () => {
    const today = new Date().toISOString().split('T')[0];
    return orders.filter(o => o.createdAt.split('T')[0] === today);
  };

  const getTodayRevenue = () =>
    getTodayOrders().reduce((sum, o) => sum + o.total, 0);

  const getNewOrdersCount = () =>
    orders.filter(o => o.status === 'new').length;

  return (
    <OrderContext.Provider value={{
      orders,
      isLoading,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      getOrder,
      getOrdersByStatus,
      getTodayOrders,
      getTodayRevenue,
      getNewOrdersCount,
      refreshOrders: fetchOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
}
