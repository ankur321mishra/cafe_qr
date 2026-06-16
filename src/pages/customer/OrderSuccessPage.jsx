import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const { getOrder } = useOrders();
  const navigate = useNavigate();

  const order = getOrder(orderId);

  useEffect(() => {
    if (!order) {
      navigate('/menu');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center slide-up">
      <div className="relative mb-8">
        <svg className="w-32 h-32 text-green-500" viewBox="0 0 100 100" fill="none">
          <circle className="check-animate text-green-100" cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" />
          <path className="check-animate text-green-500" d="M30 50L45 65L70 35" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="100" strokeDashoffset="100" />
        </svg>
      </div>

      <h1 className="text-3xl font-serif font-bold text-brown-darkest mb-2">Order Received!</h1>
      <p className="text-brown-light mb-6">Your order has been sent to the kitchen.</p>

      <div className="bg-white border border-beige/60 rounded-2xl p-6 w-full max-w-xs shadow-sm mb-8">
        <div className="text-sm text-brown-light/80 uppercase tracking-wider font-semibold mb-1">Order Number</div>
        <div className="text-2xl font-bold text-brown-darkest tracking-widest">{order.id.split('-')[1]}</div>
        
        <div className="mt-4 pt-4 border-t border-beige/40">
          <div className="text-sm text-brown-light mb-1">Table Number</div>
          <div className="text-xl font-bold text-brown">{order.tableNumber}</div>
        </div>
      </div>

      <div className="space-y-4 w-full max-w-xs">
        <Link
          to={`/order-track/${order.id}`}
          className="block w-full bg-brown-gradient text-white py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-shadow"
        >
          Track Order Status
        </Link>
        <Link
          to="/menu"
          className="block w-full bg-white text-brown border border-beige py-4 rounded-xl font-bold hover:bg-cream transition-colors"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
