import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Customer pages
import MenuPage from './pages/customer/MenuPage';
import ItemDetailPage from './pages/customer/ItemDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderSuccessPage from './pages/customer/OrderSuccessPage';
import OrderTrackPage from './pages/customer/OrderTrackPage';

// Admin pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import MenuManagePage from './pages/admin/MenuManagePage';
import OrdersPage from './pages/admin/OrdersPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import QRCodesPage from './pages/admin/QRCodesPage';
import SettingsPage from './pages/admin/SettingsPage';

// Layouts
import CustomerLayout from './components/layout/CustomerLayout';
import AdminLayout from './components/layout/AdminLayout';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/item/:id" element={<ItemDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
        <Route path="/order-track/:orderId" element={<OrderTrackPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="menu" element={<MenuManagePage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="qr-codes" element={<QRCodesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
