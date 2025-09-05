import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Store from './components/Store';
import ProductModal from './components/ProductModal';
import './App.css';

function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <button className="nav-button active">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        Cửa hàng
      </button>
      <button className="nav-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      </button>
      <button className="nav-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </button>
    </nav>
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
    <Router>
      <div className="app">
        <div className="container">
          <Routes>
            <Route path="/store/:storeId" element={<Store onProductSelect={handleProductSelect} />} />
          </Routes>
          <BottomNavigation />
        </div>
        <ProductModal 
          productId={selectedProductId}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      </div>
    </Router>
  );
}

export default App;
