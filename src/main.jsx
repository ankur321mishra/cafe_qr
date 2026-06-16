import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { MenuProvider } from './context/MenuContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MenuProvider>
          <OrderProvider>
            <CartProvider>
              <App />
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 2500,
                  style: {
                    background: '#3A2F20',
                    color: '#FDF6EC',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 500,
                  },
                }}
              />
            </CartProvider>
          </OrderProvider>
        </MenuProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
