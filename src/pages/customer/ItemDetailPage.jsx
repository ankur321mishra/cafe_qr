import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ArrowLeft, Flame, Info } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItem, categories } = useMenu();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [item, setItem] = useState(null);

  useEffect(() => {
    const foundItem = getItem(id);
    if (foundItem) {
      setItem(foundItem);
    } else {
      navigate('/menu');
    }
  }, [id, getItem, navigate]);

  if (!item) return null;

  const handleAddToCart = () => {
    addItem({
      itemId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity,
    });
    toast.success(`${quantity} x ${item.name} added to cart`);
    navigate(-1);
  };

  const categoryEmoji = categories.find(c => c.id === item.category)?.emoji || '🍽️';

  return (
    <div className="pb-20 bg-white min-h-screen slide-up">
      {/* Header/Image */}
      <div className="relative h-64 bg-beige/20 flex items-center justify-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-brown-dark shadow-sm z-10"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-8xl">{categoryEmoji}</div>
      </div>

      {/* Content */}
      <div className="px-5 py-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl font-serif font-bold text-brown-darkest leading-tight">
            {item.name}
          </h1>
          <span className="text-xl font-bold text-brown">₹{item.price}</span>
        </div>

        {item.isPopular && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-terracotta/10 text-terracotta text-xs font-bold rounded-md mb-4">
            <Flame size={14} /> Popular Item
          </div>
        )}

        <p className="text-sm text-brown-light leading-relaxed mb-6">
          {item.description}
        </p>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {item.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-cream rounded-full text-xs font-medium text-brown-light/80 uppercase tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-between p-4 bg-cream/50 rounded-2xl mb-8">
          <span className="text-sm font-semibold text-brown-dark">Quantity</span>
          <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-beige/40 p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center text-brown hover:bg-beige/30 rounded-lg transition-colors"
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="w-6 text-center font-bold text-brown-darkest">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-brown hover:bg-beige/30 rounded-lg transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Nutritional Info / Allergy Mock */}
        <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl mb-6">
          <Info size={18} className="text-blue-400 mt-0.5" />
          <p className="text-xs text-blue-900/60 leading-relaxed">
            Prepared in a kitchen that handles nuts, dairy, and gluten. Please let staff know if you have severe allergies.
          </p>
        </div>
      </div>

      {/* Add to Cart Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-beige/40 md:relative md:border-none md:bg-transparent">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleAddToCart}
            className="w-full bg-brown-gradient text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
          >
            <span>Add to Cart</span>
            <span className="opacity-50">•</span>
            <span>₹{item.price * quantity}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
