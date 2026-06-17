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
import SignupPage from './pages/admin/SignupPage';
import DashboardPage from './pages/admin/DashboardPage';
import MenuManagePage from './pages/admin/MenuManagePage';
import OrdersPage from './pages/admin/OrdersPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import QRCodesPage from './pages/admin/QRCodesPage';
import SettingsPage from './pages/admin/SettingsPage';

// Layouts
import CustomerLayout from './components/layout/CustomerLayout';
import AdminLayout from './components/layout/AdminLayout';

import StaffPage from './pages/admin/StaffPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-xl text-stone-600 font-medium">Loading session...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin" replace />;
  }
  
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
      <Route path="/admin/signup" element={<SignupPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'STAFF']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="orders" element={<OrdersPage />} />
        
        <Route path="menu" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
            <MenuManagePage />
          </ProtectedRoute>
        } />
        <Route path="analytics" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
            <AnalyticsPage />
          </ProtectedRoute>
        } />
        
        <Route path="qr-codes" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <QRCodesPage />
          </ProtectedRoute>
        } />
        <Route path="staff" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <StaffPage />
          </ProtectedRoute>
        } />
        <Route path="settings" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <SettingsPage />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}
