import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, subtotal, tax, total, tableNumber, clearCart } = useCart();
  const { addOrder } = useOrders();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const instructions = location.state?.instructions || '';

  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!tableNumber) {
      toast.error('Please scan a table QR code to order.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const orderData = {
      tableNumber,
      items: items.map(i => ({ ...i })),
      subtotal,
      tax,
      total,
      specialInstructions: instructions,
    };

    const newOrderId = addOrder(orderData);
    clearCart();

    navigate(`/order-success/${newOrderId}`, { replace: true });
  };

  return (
    <div className="pb-28 md:pb-8 slide-up">
      <div className="px-4 py-4 flex items-center gap-3 border-b border-beige/40 bg-white">
        <button onClick={() => navigate(-1)} className="p-1 text-brown-light hover:text-brown transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-serif font-bold text-brown-darkest">Review Order</h1>
      </div>

      {/* Table Information */}
      <div className="px-4 mt-6">
        <div className="bg-brown-gradient rounded-xl p-4 text-white flex items-start gap-3 shadow-md">
          <MapPin size={24} className="mt-0.5 text-beige" />
          <div>
            <h3 className="font-bold text-lg">Dining In</h3>
            <p className="text-sm text-beige">
              {tableNumber ? `Delivering to Table ${tableNumber}` : 'No table selected (Please scan QR code)'}
            </p>
          </div>
        </div>
      </div>

      {/* Items Summary */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-bold text-brown-darkest mb-3 uppercase tracking-wider">Order Items</h3>
        <div className="bg-white rounded-xl border border-beige/60 overflow-hidden">
          {items.map((item, index) => (
            <div key={item.itemId} className={`p-3 flex justify-between items-center ${index !== items.length - 1 ? 'border-b border-beige/40' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-bold text-brown text-sm">{item.quantity}x</span>
                <span className="text-sm font-medium text-brown-darkest">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-brown-darkest">₹{item.price * item.quantity}</span>
            </div>
          ))}
          {instructions && (
            <div className="p-3 bg-cream/50 border-t border-beige/40 text-sm">
              <span className="font-semibold text-brown-dark">Note: </span>
              <span className="text-brown-light italic">"{instructions}"</span>
            </div>
          )}
        </div>
      </div>

      {/* Bill Details */}
      <div className="px-4 mt-6 mb-8">
        <h3 className="text-sm font-bold text-brown-darkest mb-3 uppercase tracking-wider">Bill Details</h3>
        <div className="bg-white p-4 rounded-xl border border-beige/60 space-y-3">
          <div className="flex justify-between text-sm text-brown-light">
            <span>Item Total</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-brown-light">
            <span>Taxes & Charges (5%)</span>
            <span>₹{tax}</span>
          </div>
          <div className="border-t border-beige/40 pt-3 flex justify-between items-center">
            <span className="font-bold text-brown-darkest">Grand Total</span>
            <span className="text-lg font-bold text-brown">₹{total}</span>
          </div>
        </div>
      </div>

      <div className="px-4 flex items-center justify-center gap-2 text-xs text-brown-light/80 mb-6">
        <ShieldCheck size={14} />
        <span>Securely placing order to kitchen</span>
      </div>

      {/* Fixed Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-beige/40 md:relative md:bg-transparent md:border-none md:pb-0">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || !tableNumber}
            className="w-full bg-brown-gradient text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending to Kitchen...
              </span>
            ) : (
              <>
                <span>Place Order • ₹{total}</span>
                <CheckCircle2 size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
