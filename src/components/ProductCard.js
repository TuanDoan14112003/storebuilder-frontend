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
        
      </div>
    </div>
  );
};

export default ProductCard;