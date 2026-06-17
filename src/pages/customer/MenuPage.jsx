import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X, Flame, Star, ShoppingCart, Plus, MapPin } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { useCart } from '../../context/CartContext';
import { apiClient } from '../../utils/apiClient';
import toast from 'react-hot-toast';

export default function MenuPage() {
  const { items, categories, getItemsByCategory, getPopularItems, getFeaturedItems } = useMenu();
  const { addItem, setTable, tableNumber, itemCount } = useCart();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Detect table number from URL and validate
  useEffect(() => {
    const table = searchParams.get('table');
    if (table) {
      const tableNum = parseInt(table);
      apiClient(`/api/v1/tables/validate/${tableNum}`)
        .then(res => {
          if (res.success && res.data?.isActive) {
            setTable(tableNum);
          } else {
            toast.error('Invalid or inactive table');
          }
        })
        .catch(() => {
          // Validation endpoint missing or failed — set anyway for backwards compat
          setTable(tableNum);
        });
    }
  }, [searchParams, setTable]);

  const popularItems = getPopularItems();
  const featuredItems = getFeaturedItems();

  const filteredItems = useMemo(() => {
    let result = activeCategory === 'all'
      ? items.filter(i => i.isAvailable)
      : getItemsByCategory(activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        i => i.name.toLowerCase().includes(q) ||
             i.description?.toLowerCase().includes(q) ||
             i.tags?.some(t => t.includes(q))
      );
    }
    return result;
  }, [activeCategory, searchQuery, items, getItemsByCategory]);

  const handleAddItem = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      itemId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    toast.success(`${item.name} added to cart`);
  };

  const getCategoryEmoji = (id) => categories.find(c => c.id === id)?.emoji || '🍽️';

  return (
    <div className="pb-4 slide-up">
      {/* Welcome Banner */}
      {featuredItems.length > 0 && (
        <div className="mx-4 mt-4 bg-brown-gradient rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={14} className="text-gold-light fill-gold-light" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Featured Today</span>
            </div>
            <h2 className="text-lg font-serif font-bold mb-1">
              {featuredItems[0].name}
            </h2>
            <p className="text-xs text-white/70 mb-3 line-clamp-2">
              {featuredItems[0].description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">₹{featuredItems[0].price}</span>
              <button
                onClick={(e) => handleAddItem(featuredItems[0], e)}
                className="px-4 py-2 bg-white text-brown-dark rounded-full text-sm font-semibold hover:bg-cream transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-4 mt-4">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-light/50" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white rounded-xl border border-beige/60 text-sm text-brown-darkest placeholder:text-brown-light/40 focus:outline-none focus:ring-2 focus:ring-brown/20 focus:border-brown/40 transition-all"
            id="menu-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light/50 hover:text-brown"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="mt-4 px-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeCategory === 'all'
                ? 'category-pill-active'
                : 'bg-white text-brown-light border border-beige/60 hover:border-brown/30'
            }`}
          >
            🍽️ All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'category-pill-active'
                  : 'bg-white text-brown-light border border-beige/60 hover:border-brown/30'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Items Section */}
      {activeCategory === 'all' && !searchQuery && (
        <div className="mt-6">
          <div className="px-4 flex items-center gap-2 mb-3">
            <Flame size={18} className="text-terracotta" />
            <h3 className="text-base font-bold text-brown-darkest">Popular Right Now</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
            {popularItems.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                to={`/menu/item/${item.id}`}
                className="flex-shrink-0 w-36 bg-white rounded-xl border border-beige/40 overflow-hidden menu-card-hover"
              >
                <div className="h-24 bg-beige/30 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    {getCategoryEmoji(item.category)}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-brown-darkest truncate">{item.name}</h4>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-sm font-bold text-brown">₹{item.price}</span>
                    <button
                      onClick={(e) => handleAddItem(item, e)}
                      className="w-7 h-7 bg-brown/10 hover:bg-brown hover:text-white rounded-full flex items-center justify-center text-brown transition-all duration-200"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Menu Grid */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-brown-darkest">
            {activeCategory === 'all' ? 'Full Menu' : categories.find(c => c.id === activeCategory)?.name || 'Menu'}
          </h3>
          <span className="text-xs text-brown-light font-medium">{filteredItems.length} items</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm text-brown-light font-medium">No items found</p>
            <p className="text-xs text-brown-light/60 mt-1">Try adjusting your search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <Link
                key={item.id}
                to={`/menu/item/${item.id}`}
                className="bg-white rounded-xl border border-beige/40 overflow-hidden menu-card-hover"
              >
                <div className="h-28 bg-beige/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-5xl">
                    {getCategoryEmoji(item.category)}
                  </div>
                  {item.isPopular && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-terracotta/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                      <Flame size={10} /> Popular
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-brown-darkest leading-tight">{item.name}</h4>
                  <p className="text-[11px] text-brown-light/60 mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-brown">₹{item.price}</span>
                    <button
                      onClick={(e) => handleAddItem(item, e)}
                      className="w-8 h-8 bg-brown/10 hover:bg-brown hover:text-white rounded-full flex items-center justify-center text-brown transition-all duration-200"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Bar (when items in cart) */}
      {itemCount > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg">
          <Link
            to="/cart"
            className="flex items-center justify-between bg-brown-gradient text-white px-5 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <ShoppingCart size={16} />
              </div>
              <span className="text-sm font-semibold">{itemCount} item{itemCount > 1 ? 's' : ''} in cart</span>
            </div>
            <span className="text-sm font-bold">View Cart →</span>
          </Link>
        </div>
      )}
    </div>
  );
}
