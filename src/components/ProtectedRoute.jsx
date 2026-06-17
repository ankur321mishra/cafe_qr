import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAccessToken } from '../utils/apiClient';

export default function ProtectedRoute({ children }) {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-xl text-stone-600 font-medium">Loading session...</div>
      </div>
    );
  }

  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return <Navigate to="/admin/login" replace />;
    }
  } catch (err) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
