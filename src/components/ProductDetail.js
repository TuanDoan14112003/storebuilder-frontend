import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await ApiService.fetchProductById(id);
      setProduct(data);
      setError(null);
    } catch (err) {
      setError('Failed to load product details');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleAddToCart = () => {
    // Add to cart functionality - placeholder for now
    alert(`Added ${quantity} ${product.name} to cart!`);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="error">
            <p>{error || 'Product not found'}</p>
            <button onClick={handleBack} className="back-button">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <header className="detail-header">
          <button className="back-button" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <h1 className="detail-title">Product Details</h1>
          <button className="share-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </header>

        <main className="detail-main">
          <div className="product-image-container">
            <img 
              src={product.image || '/api/placeholder/400/400'} 
              alt={product.name}
              className="product-detail-image"
              onError={(e) => {
                e.target.src = '/api/placeholder/400/400';
              }}
            />
          </div>

          <div className="product-info-section">
            <div className="product-header">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-brand">STORE</p>
              <p className="product-price">${product.price}</p>
            </div>

            <div className="product-details">
       
              
              <div className="detail-row">
                <span className="detail-label">Stock:</span>
                <span className="detail-value">{product.stock} items</span>
              </div>

              {product.description && (
                <div className="description-section">
                  <h3 className="section-title">Description</h3>
                  <p className="product-description">{product.description}</p>
                </div>
              )}
            </div>

            <div className="quantity-section">
              <h3 className="section-title">Quantity</h3>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn" 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  className="quantity-btn" 
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

            <div className="action-buttons">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.is_available || product.stock < 1}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Add to Cart
              </button>
              
              <button className="favorite-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductDetail;