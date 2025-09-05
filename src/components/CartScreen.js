import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './CartScreen.css';

const CartScreen = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await ApiService.getCart();
      console.log('Cart data received:', cartData);
      setCart(cartData);
      setError(null);
    } catch (err) {
      console.error('Error loading cart:', err);
      console.error('Error details:', err.message);
      setError(`Failed to load cart: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      await ApiService.updateCartItem(productId, newQuantity);
      await loadCart(); // Reload cart to get updated data
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update item quantity.');
    }
  };

  const removeItem = async (productId) => {
    try {
      await ApiService.removeFromCart(productId);
      await loadCart();
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item.');
    }
  };

  const clearCart = async () => {
    try {
      await ApiService.clearCart();
      await loadCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart.');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={loadCart} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="cart-screen">
        <button className="back-to-store" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Quay lai cua hang
        </button>
        <header className="cart-header">
          <h1 className="cart-title">Giỏ hàng</h1>
        </header>
        
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2 className="empty-cart-title">Giỏ hàng trống</h2>
          <p className="empty-cart-message">Thêm một số sản phẩm để bắt đầu mua sắm!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-screen">
      <button className="back-to-store" onClick={() => navigate(-1)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Quay lai cua hang
      </button>
      <header className="cart-header">
        <h1 className="cart-title">Giỏ hàng</h1>
        <span className="cart-count">{cart?.total_items || 0} sản phẩm</span>
      </header>

      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img 
                  src={item.product.image || '/api/placeholder/100/100'} 
                  alt={item.product.name}
                  onError={(e) => {
                    e.target.src = '/api/placeholder/100/100';
                  }}
                />
              </div>
              
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.product.name}</h3>
                <p className="cart-item-brand">{item.product.store_name || 'STORE'}</p>
                <p className="cart-item-price">${item.product.price}</p>
              </div>
              
              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
                
                <button 
                  className="remove-item-btn"
                  onClick={() => removeItem(item.product.id)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </button>
              </div>
              
              <div className="cart-item-total">
                ${item.subtotal}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-actions">
          <button className="clear-cart-btn" onClick={clearCart}>
            Xóa tất cả
          </button>
        </div>
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span className="summary-label">Tạm tính:</span>
          <span className="summary-value">${cart?.total_amount || '0.00'}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Phí vận chuyển:</span>
          <span className="summary-value">Miễn phí</span>
        </div>
        <div className="summary-row total-row">
          <span className="summary-label">Tổng cộng:</span>
          <span className="summary-value">${cart?.total_amount || '0.00'}</span>
        </div>
        
        <button className="checkout-btn" onClick={handleCheckout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default CartScreen;