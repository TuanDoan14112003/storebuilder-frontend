import React from 'react';
import { useCart } from '../context/CartContext';
import './CartScreen.css';

const CartScreen = () => {
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();

  const handleQuantityChange = (itemId, newQuantity, maxStock) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else if (newQuantity <= maxStock) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    alert(`Checkout with ${getTotalItems()} items for $${getTotalPrice().toFixed(2)}`);
  };

  if (items.length === 0) {
    return (
      <div className="cart-screen">
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
      <header className="cart-header">
        <h1 className="cart-title">Giỏ hàng</h1>
        <span className="cart-count">{getTotalItems()} sản phẩm</span>
      </header>

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img 
                  src={item.image || '/api/placeholder/100/100'} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = '/api/placeholder/100/100';
                  }}
                />
              </div>
              
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-brand">STORE</p>
                <p className="cart-item-price">${item.price}</p>
              </div>
              
              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                    disabled={item.quantity >= item.stock}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
                
                <button 
                  className="remove-item-btn"
                  onClick={() => removeItem(item.id)}
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
                ${(item.price * item.quantity).toFixed(2)}
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
          <span className="summary-value">${getTotalPrice().toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Phí vận chuyển:</span>
          <span className="summary-value">Miễn phí</span>
        </div>
        <div className="summary-row total-row">
          <span className="summary-label">Tổng cộng:</span>
          <span className="summary-value">${getTotalPrice().toFixed(2)}</span>
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