import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useMenu } from '../../context/MenuContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, tax, total, tableNumber } = useCart();
  const { categories, getItem } = useMenu();
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState('');

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center slide-up">
        <div className="w-20 h-20 bg-beige/30 rounded-full flex items-center justify-center text-brown-light mb-4">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-xl font-serif font-bold text-brown-darkest mb-2">Your cart is empty</h2>
        <p className="text-sm text-brown-light mb-8">Looks like you haven't added anything yet.</p>
        <Link
          to="/menu"
          className="px-6 py-3 bg-brown text-white rounded-full font-semibold shadow-md hover:bg-brown-dark transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    // Pass instructions state via navigation state
    navigate('/checkout', { state: { instructions } });
  };

  return (
    <div className="pb-28 md:pb-8 slide-up">
      <div className="px-4 py-5 border-b border-beige/40 bg-white">
        <h1 className="text-2xl font-serif font-bold text-brown-darkest">Your Order</h1>
        {tableNumber && (
          <p className="text-sm text-brown mt-1 font-medium">Table {tableNumber}</p>
        )}
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Cart Items */}
        {items.map((item) => {
          const menuItem = getItem(item.itemId);
          const emoji = menuItem ? categories.find(c => c.id === menuItem.category)?.emoji : '🍽️';

          return (
            <div key={item.itemId} className="flex gap-3 bg-white p-3 rounded-xl border border-beige/60 shadow-sm">
              <div className="w-16 h-16 bg-beige/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {emoji}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-sm font-semibold text-brown-darkest truncate">{item.name}</h3>
                  <span className="text-sm font-bold text-brown">₹{item.price * item.quantity}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 bg-cream rounded-lg p-1 border border-beige/40">
                    <button
                      onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-brown hover:bg-white rounded-md transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-brown hover:bg-white rounded-md transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.itemId)}
                    className="p-1.5 text-brown-light/60 hover:text-terracotta hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Special Instructions */}
      <div className="px-4 mt-6">
        <label htmlFor="instructions" className="block text-sm font-semibold text-brown-darkest mb-2">
          Special Instructions
        </label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Any allergies or specific requests?"
          className="w-full p-3 bg-white border border-beige/60 rounded-xl text-sm text-brown-darkest placeholder:text-brown-light/40 focus:outline-none focus:border-brown/40 focus:ring-2 focus:ring-brown/20 transition-all resize-none h-24"
        />
      </div>

      {/* Order Summary */}
      <div className="px-4 mt-6">
        <div className="bg-white p-4 rounded-xl border border-beige/60 shadow-sm space-y-3">
          <div className="flex justify-between text-sm text-brown-light">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-brown-light">
            <span>Taxes (5%)</span>
            <span>₹{tax}</span>
          </div>
          <div className="border-t border-beige/40 pt-3 flex justify-between items-center">
            <span className="font-bold text-brown-darkest">Total</span>
            <span className="text-lg font-bold text-brown">₹{total}</span>
          </div>
        </div>
      </div>

      {/* Add more items link */}
      <div className="px-4 mt-4 text-center">
        <Link to="/menu" className="text-sm text-brown font-semibold hover:underline">
          + Add more items
        </Link>
      </div>

      {/* Fixed Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-beige/40 md:relative md:bg-transparent md:border-none md:mt-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleCheckout}
            className="w-full bg-brown-gradient text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow flex items-center justify-between px-6"
          >
            <span>Checkout</span>
            <div className="flex items-center gap-2">
              <span>₹{total}</span>
              <ArrowRight size={18} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
