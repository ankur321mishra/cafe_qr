import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import NotFoundPage from './pages/NotFoundPage';

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
import ProtectedRoute from './components/ProtectedRoute';

import StaffPage from './pages/admin/StaffPage';

import ErrorBoundary from './components/ErrorBoundary';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import GlobalLoadingBar from './components/GlobalLoadingBar';

export default function App() {
  return (
    <ErrorBoundary>
      <GlobalLoadingBar />
      <Routes>
        <Route path="/" element={<Navigate replace to="/menu" />} />
        {/* Customer Routes */}
        <Route element={<RouteErrorBoundary><CustomerLayout /></RouteErrorBoundary>}>
          <Route path="/" element={<Navigate to="/menu" replace />} />
          <Route path="/menu" element={<RouteErrorBoundary><MenuPage /></RouteErrorBoundary>} />
          <Route path="/menu/item/:id" element={<RouteErrorBoundary><ItemDetailPage /></RouteErrorBoundary>} />
          <Route path="/cart" element={<RouteErrorBoundary><CartPage /></RouteErrorBoundary>} />
          <Route path="/checkout" element={<RouteErrorBoundary><CheckoutPage /></RouteErrorBoundary>} />
          <Route path="/order-success/:orderId" element={<RouteErrorBoundary><OrderSuccessPage /></RouteErrorBoundary>} />
          <Route path="/order-track/:orderId" element={<RouteErrorBoundary><OrderTrackPage /></RouteErrorBoundary>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<RouteErrorBoundary><LoginPage /></RouteErrorBoundary>} />
        <Route path="/admin/signup" element={<RouteErrorBoundary><SignupPage /></RouteErrorBoundary>} />
        <Route
          path="/admin"
          element={
            <RouteErrorBoundary>
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            </RouteErrorBoundary>
          }
        >
          <Route index element={<RouteErrorBoundary><DashboardPage /></RouteErrorBoundary>} />
          <Route path="orders" element={<RouteErrorBoundary><OrdersPage /></RouteErrorBoundary>} />
          
          <Route path="menu" element={<RouteErrorBoundary><MenuManagePage /></RouteErrorBoundary>} />
          <Route path="analytics" element={<RouteErrorBoundary><AnalyticsPage /></RouteErrorBoundary>} />
          <Route path="qr-codes" element={<RouteErrorBoundary><QRCodesPage /></RouteErrorBoundary>} />
          <Route path="staff" element={<RouteErrorBoundary><StaffPage /></RouteErrorBoundary>} />
          <Route path="settings" element={<RouteErrorBoundary><SettingsPage /></RouteErrorBoundary>} />
        </Route>
        <Route path="*" element={<RouteErrorBoundary><NotFoundPage /></RouteErrorBoundary>} />
      </Routes>
    </ErrorBoundary>
  );
}
