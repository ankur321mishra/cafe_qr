import { Outlet, Link, useLocation } from 'react-router-dom';
import { Coffee, ShoppingCart, Search, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CustomerLayout() {
  const { itemCount, tableNumber } = useCart();
  const location = useLocation();
  const isMenuPage = location.pathname === '/menu';

  return (
    <div className="min-h-screen bg-cream pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-beige/40">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          {!isMenuPage ? (
            <Link
              to="/menu"
              className="flex items-center gap-2 text-brown-dark hover:text-brown transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Menu</span>
            </Link>
          ) : (
            <Link to="/menu" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brown-gradient rounded-lg flex items-center justify-center">
                <Coffee size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-brown-darkest font-serif leading-none">
                  The Brew House
                </h1>
                {tableNumber && (
                  <span className="text-[10px] text-brown-light font-medium">
                    Table {tableNumber}
                  </span>
                )}
              </div>
            </Link>
          )}

          <div className="flex items-center gap-3">
            {isMenuPage && (
              <button
                className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center text-brown hover:bg-white transition-colors"
                aria-label="Search"
                id="header-search-btn"
              >
                <Search size={18} />
              </button>
            )}
            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-full bg-brown-gradient flex items-center justify-center text-white shadow-md hover:shadow-lg transition-shadow"
              id="header-cart-btn"
            >
              <ShoppingCart size={16} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center cart-bounce">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-white border-t border-beige/30 md:hidden">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-around">
          <Link
            to="/menu"
            className={`flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
              location.pathname === '/menu' ? 'text-brown' : 'text-brown-light/60'
            }`}
          >
            <Coffee size={20} />
            <span>Menu</span>
          </Link>
          <Link
            to="/cart"
            className={`flex flex-col items-center gap-0.5 text-xs font-medium transition-colors relative ${
              location.pathname === '/cart' ? 'text-brown' : 'text-brown-light/60'
            }`}
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-terracotta text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
