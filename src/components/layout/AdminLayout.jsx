import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, UtensilsCrossed, ClipboardList, BarChart3,
  QrCode, Settings, LogOut, Coffee, Bell, ChevronRight, Menu, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useState } from 'react';

const sidebarLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/admin/menu', icon: UtensilsCrossed, label: 'Menu' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/qr-codes', icon: QrCode, label: 'QR Codes' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { getNewOrdersCount } = useOrders();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const newOrders = getNewOrdersCount();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.to;
    return location.pathname.startsWith(link.to);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-espresso text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-brown/40 rounded-lg flex items-center justify-center">
                <Coffee size={18} className="text-beige" />
              </div>
              <div>
                <div className="text-sm font-bold font-serif text-white leading-none">
                  The Brew House
                </div>
                <div className="text-[10px] text-white/50 font-medium mt-0.5">Admin Panel</div>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? 'bg-brown/40 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="flex-1">{link.label}</span>
                {link.label === 'Orders' && newOrders > 0 && (
                  <span className="w-5 h-5 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center pulse-dot">
                    {newOrders}
                  </span>
                )}
                {active && <ChevronRight size={14} className="text-white/40" />}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 mb-2">
            <div className="text-xs text-white/40">Logged in as</div>
            <div className="text-sm font-medium text-white/80">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-colors w-full"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/60">
          <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Menu size={18} />
              </button>
              <h2 className="text-lg font-semibold text-gray-800">
                {sidebarLinks.find(l => isActive(l))?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <Bell size={18} />
                {newOrders > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {newOrders}
                  </span>
                )}
              </button>
              <div className="w-8 h-8 bg-brown-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
