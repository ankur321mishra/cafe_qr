import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChefHat, Clock, UtensilsCrossed, RefreshCw } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';

const STATUS_STEPS = [
  { id: 'new', label: 'Order Placed', icon: Clock, description: 'We have received your order' },
  { id: 'preparing', label: 'Preparing', icon: ChefHat, description: 'Kitchen is preparing your food' },
  { id: 'ready', label: 'Ready', icon: UtensilsCrossed, description: 'Your order is ready to serve' },
  { id: 'completed', label: 'Completed', icon: Check, description: 'Enjoy your meal!' },
];

export default function OrderTrackPage() {
  const { orderId } = useParams();
  const { getOrder } = useOrders();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadOrder = useCallback(async () => {
    const data = await getOrder(orderId);
    if (!data) {
      navigate('/menu');
    } else {
      setOrder(data);
    }
    setIsLoading(false);
  }, [orderId, getOrder, navigate]);

  // Initial load
  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  // Poll for updates every 5s
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await getOrder(orderId);
      if (data && data.status !== order?.status) {
        setOrder(data);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [orderId, getOrder, order]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-brown-light font-medium">Loading order...</div>
      </div>
    );
  }

  if (!order) return null;

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === order.status);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const data = await getOrder(orderId);
    if (data) setOrder(data);
    setIsRefreshing(false);
  };

  return (
    <div className="pb-10 slide-up">
      <div className="px-4 py-4 flex items-center justify-between border-b border-beige/40 bg-white sticky top-14 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/menu')} className="p-1 text-brown-light hover:text-brown transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-serif font-bold text-brown-darkest">Track Order</h1>
        </div>
        <button 
          onClick={handleRefresh}
          className={`p-2 text-brown bg-beige/30 rounded-full transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="px-4 mt-6">
        <div className="bg-white p-5 rounded-2xl border border-beige/60 shadow-sm flex justify-between items-center mb-8">
          <div>
            <div className="text-xs font-semibold text-brown-light/80 uppercase tracking-wider mb-1">Order ID</div>
            <div className="text-lg font-bold text-brown-darkest">{order.id}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-brown-light/80 uppercase tracking-wider mb-1">Table</div>
            <div className="text-xl font-bold text-terracotta">{order.tableNumber}</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 mb-10">
          <div className="absolute left-[33px] top-4 bottom-8 w-0.5 bg-beige/50"></div>
          
          {STATUS_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.id} className="relative flex items-start gap-5 mb-8 last:mb-0">
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-cream flex-shrink-0 transition-colors duration-500 ${
                  isCompleted ? 'bg-brown text-white' : 'bg-beige/40 text-brown-light/60'
                } ${isCurrent && order.status !== 'completed' ? 'ring-4 ring-brown/20 pulse-dot' : ''}`}>
                  <Icon size={18} />
                </div>
                <div className="pt-2">
                  <h3 className={`text-base font-bold transition-colors duration-300 ${
                    isCompleted ? 'text-brown-darkest' : 'text-brown-light/60'
                  }`}>{step.label}</h3>
                  <p className={`text-xs mt-1 transition-colors duration-300 ${
                    isCompleted ? 'text-brown-light' : 'text-brown-light/40'
                  }`}>{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl border border-beige/60 overflow-hidden">
          <div className="bg-beige/20 px-4 py-3 border-b border-beige/40">
            <h3 className="font-bold text-brown-darkest">Order Summary</h3>
          </div>
          <div className="p-4 space-y-3">
            {order.items.map(item => (
              <div key={item.itemId} className="flex justify-between text-sm">
                <span className="text-brown-darkest"><span className="font-bold text-brown mr-2">{item.quantity}x</span>{item.name}</span>
                <span className="font-medium text-brown-light">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-beige/40 flex justify-between font-bold">
              <span className="text-brown-darkest">Total Paid</span>
              <span className="text-brown">₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
