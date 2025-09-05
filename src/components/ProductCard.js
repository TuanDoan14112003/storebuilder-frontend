import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onProductSelect }) => {
  const handleCardClick = () => {
    if (onProductSelect) {
      onProductSelect(product.id);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent card click when edit button is clicked
    // Edit functionality can be added here
    console.log('Edit product:', product.id);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image">
        <img 
          src={product.image || '/api/placeholder/300/300'} 
          alt={product.name}
          onError={(e) => {
            e.target.src = '/api/placeholder/300/300';
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">STORE</p>
        <p className="product-price">${product.price}</p>
        <button className="edit-button" onClick={handleEditClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;