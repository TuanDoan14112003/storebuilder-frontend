import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    shipping_address: '',
    phone: '',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await ApiService.getCart();
      setCart(cartData);
      setError(null);
    } catch (err) {
      setError('Không thể tải giỏ hàng. Vui lòng thử lại.');
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.guest_name.trim()) {
      errors.guest_name = 'Họ và tên là bắt buộc';
    }
    
    if (!formData.guest_email.trim()) {
      errors.guest_email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.guest_email)) {
      errors.guest_email = 'Email không hợp lệ';
    }
    
    if (!formData.shipping_address.trim()) {
      errors.shipping_address = 'Địa chỉ giao hàng là bắt buộc';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Vui lòng nhập số điện thoại hợp lệ';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      // Convert cart items to the order format
      const items = cart.items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }));

      const orderData = {
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        shipping_address: formData.shipping_address,
        phone: formData.phone,
        notes: formData.notes || '',
        items: items
      };

      const result = await ApiService.createOrder(orderData);
      
      // Show success message and navigate back to store or show order summary
      const orderCount = result.orders?.length || 1;
      const firstOrderId = result.orders?.[0]?.id || 'N/A';
      alert(`${result.message || 'Order placed successfully!'}\nFirst Order ID: ${firstOrderId}`);
      
      // Clear the cart after successful order
      await ApiService.clearCart();
      navigate('/cart'); // Navigate back to cart (which should be empty now)
      
    } catch (err) {
      setError('Không thể đặt hàng. Vui lòng thử lại.');
      console.error('Error during checkout:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-screen">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-screen">
        <div className="error">
          <p>{error}</p>
          <button onClick={loadCart} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="checkout-screen">
        <header className="checkout-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h1 className="checkout-title">Thanh toán</h1>
        </header>
        
        <div className="empty-checkout">
          <h2>Giỏ hàng trống</h2>
          <p>Thêm một số sản phẩm để tiến hành thanh toán</p>
          <button onClick={() => navigate(-1)} className="continue-shopping-btn">
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-screen">
      <header className="checkout-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="checkout-title">Thanh toán</h1>
      </header>

      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h2 className="section-title">Thông tin liên hệ</h2>
            
            <div className="form-group">
              <label className="form-label">Họ và tên *</label>
              <input
                type="text"
                name="guest_name"
                value={formData.guest_name}
                onChange={handleInputChange}
                className={`form-input ${formErrors.guest_name ? 'error' : ''}`}
                placeholder="Nhập họ và tên của bạn"
              />
              {formErrors.guest_name && <span className="error-text">{formErrors.guest_name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Địa chỉ email *</label>
              <input
                type="email"
                name="guest_email"
                value={formData.guest_email}
                onChange={handleInputChange}
                className={`form-input ${formErrors.guest_email ? 'error' : ''}`}
                placeholder="Nhập địa chỉ email"
              />
              {formErrors.guest_email && <span className="error-text">{formErrors.guest_email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-input ${formErrors.phone ? 'error' : ''}`}
                placeholder="Nhập số điện thoại"
              />
              {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Thông tin giao hàng</h2>
            
            <div className="form-group">
              <label className="form-label">Địa chỉ giao hàng *</label>
              <textarea
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleInputChange}
                className={`form-textarea ${formErrors.shipping_address ? 'error' : ''}`}
                placeholder="Nhập địa chỉ giao hàng đầy đủ"
                rows="3"
              />
              {formErrors.shipping_address && <span className="error-text">{formErrors.shipping_address}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Ghi chú đơn hàng (Tùy chọn)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Hướng dẫn đặc biệt cho việc giao hàng"
                rows="2"
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Phương thức thanh toán</h2>
            <div className="payment-method">
              <div className="payment-option selected">
                <div className="payment-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="22" height="18" rx="2" ry="2"/>
                    <line x1="1" y1="9" x2="23" y2="9"/>
                  </svg>
                </div>
                <div className="payment-details">
                  <h3>Thanh toán khi nhận hàng (COD)</h3>
                  <p>Thanh toán khi đơn hàng được giao đến địa chỉ của bạn</p>
                </div>
                <div className="payment-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="order-summary">
          <h2 className="section-title">Tổng quan đơn hàng</h2>
          
          <div className="order-items">
            {cart.items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-image">
                  <img 
                    src={item.product.image || '/api/placeholder/60/60'} 
                    alt={item.product.name}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/60/60';
                    }}
                  />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.product.name}</h3>
                  <p className="item-store">{item.product.store_name || 'Cửa hàng'}</p>
                  <p className="item-price">${item.product.price} × {item.quantity}</p>
                </div>
                <div className="item-total">
                  ${item.subtotal}
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span className="total-label">Tạm tính:</span>
              <span className="total-value">${cart.total_amount}</span>
            </div>
            <div className="total-row">
              <span className="total-label">Phí giao hàng:</span>
              <span className="total-value">Miễn phí</span>
            </div>
            <div className="total-row final-total">
              <span className="total-label">Tổng cộng:</span>
              <span className="total-value">${cart.total_amount}</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            className="place-order-btn"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <>
                <div className="spinner"></div>
                Đang đặt hàng...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Đặt hàng - ${cart.total_amount}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;