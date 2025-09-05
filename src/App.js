import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Store from './components/Store';
import CartScreen from './components/CartScreen';
import Checkout from './components/Checkout';
import ProductModal from './components/ProductModal';
import './App.css';

function CartIcon() {
  const location = useLocation();
  
  // Don't show cart icon on cart or checkout pages
  if (location.pathname === '/cart' || location.pathname === '/checkout') {
    return null;
  }

  return (
    <Link to="/cart" className="cart-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    </Link>
  );
}

function App() {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductSelect = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  return (
    <CartProvider>
      <Router>
        <div className="app">
          <div className="container">
            <Routes>
              <Route path="/store/:storeId" element={<Store onProductSelect={handleProductSelect} />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
            <CartIcon />
          </div>
          <ProductModal 
            productId={selectedProductId}
            isOpen={isModalOpen}
            onClose={handleModalClose}
          />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
