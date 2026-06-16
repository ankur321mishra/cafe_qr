import { createContext, useContext, useReducer, useEffect } from 'react';
import { sampleOrders } from '../data/sampleOrders';

const OrderContext = createContext(null);

const STORAGE_KEY = 'brewhouse_orders';

function loadOrders() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : sampleOrders;
  } catch {
    return sampleOrders;
  }
}

let orderCounter = 21; // After sample orders

function generateOrderId() {
  return `ORD-${String(orderCounter++).padStart(3, '0')}`;
}

function orderReducer(state, action) {
  switch (action.type) {
    case 'ADD_ORDER': {
      const newOrder = {
        ...action.payload,
        id: generateOrderId(),
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return [newOrder, ...state];
    }
    case 'UPDATE_STATUS': {
      return state.map(order =>
        order.id === action.payload.orderId
          ? { ...order, status: action.payload.status, updatedAt: new Date().toISOString() }
          : order
      );
    }
    case 'DELETE_ORDER': {
      return state.filter(order => order.id !== action.payload);
    }
    default:
      return state;
  }
}

export function OrderProvider({ children }) {
  const [orders, dispatch] = useReducer(orderReducer, null, loadOrders);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData) => {
    dispatch({ type: 'ADD_ORDER', payload: orderData });
    // Return the order ID that will be generated
    return `ORD-${String(orderCounter - 1).padStart(3, '0')}`;
  };

  const updateOrderStatus = (orderId, status) => {
    dispatch({ type: 'UPDATE_STATUS', payload: { orderId, status } });
  };

  const deleteOrder = (orderId) => {
    dispatch({ type: 'DELETE_ORDER', payload: orderId });
  };

  const getOrder = (orderId) => orders.find(o => o.id === orderId);

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
      addOrder,
      updateOrderStatus,
      deleteOrder,
      getOrder,
      getOrdersByStatus,
      getTodayOrders,
      getTodayRevenue,
      getNewOrdersCount,
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
