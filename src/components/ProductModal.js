import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import './ProductModal.css';

const ProductModal = ({ productId, isOpen, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen && productId) {
      loadProduct();
      setQuantity(1); // Reset quantity when modal opens
    }
  }, [isOpen, productId]);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.fetchProductById(productId);
      setProduct(data);
    } catch (err) {
      setError('Failed to load product details');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = async () => {
    try {
      await ApiService.addToCart(product.id, quantity);
      alert(`Added ${quantity} ${product.name} to cart!`);
      onClose(); // Close modal after adding to cart
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {loading ? (
          <div className="modal-loading">
            <div className="loading-spinner"></div>
            <p>Loading product details...</p>
          </div>
        ) : error ? (
          <div className="modal-error">
            <p>{error}</p>
            <button onClick={loadProduct} className="retry-button">
              Try Again
            </button>
          </div>
        ) : product ? (
          <div className="modal-body">
            <div className="modal-image-section">
              <img 
                src={product.image || '/api/placeholder/500/500'} 
                alt={product.name}
                className="modal-product-image"
                onError={(e) => {
                  e.target.src = '/api/placeholder/500/500';
                }}
              />
            </div>

            <div className="modal-info-section">
              <div className="modal-header">
                <h2 className="modal-product-name">{product.name}</h2>
                <p className="modal-product-brand">STORE</p>
                <p className="modal-product-price">${product.price}</p>
              </div>

              <div className="modal-details">
        
                <div className="modal-detail-row">
                  <span className="modal-detail-label">Stock:</span>
                  <span className="modal-detail-value">{product.stock} items</span>
                </div>

                {product.description && (
                  <div className="modal-description">
                    <h3 className="modal-section-title">Description</h3>
                    <p className="modal-product-description">{product.description}</p>
                  </div>
                )}
              </div>

              <div className="modal-quantity-section">
                <h3 className="modal-section-title">Quantity</h3>
                <div className="modal-quantity-controls">
                  <button 
                    className="modal-quantity-btn" 
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                  <span className="modal-quantity-display">{quantity}</span>
                  <button 
                    className="modal-quantity-btn" 
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="modal-add-to-cart"
                  onClick={handleAddToCart}
                  disabled={product.stock < 1}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Add to Cart
                </button>
                
                <button className="modal-favorite">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductModal;