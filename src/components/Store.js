import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import ApiService from '../services/api';

const Store = ({ onProductSelect }) => {
  const { storeId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStoreProducts();
  }, [storeId]);

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const loadStoreProducts = async () => {
    try {
      setLoading(true);
      const data = await ApiService.fetchStoreProducts(storeId);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load store products. Please try again.');
      console.error('Error loading store products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading store products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={loadStoreProducts} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="header">
        <h1 className="title">Store {storeId}</h1>
        <SearchBar 
          searchTerm={searchTerm} 
          onSearch={handleSearch}
          placeholder="Search products..."
        />
      </header>

      <main className="main">
        {filteredProducts.length === 0 && searchTerm ? (
          <div className="no-results">
            <p>No products found for "{searchTerm}"</p>
            <button onClick={() => setSearchTerm('')} className="clear-search-button">
              Show All Products
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onProductSelect={onProductSelect}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Store;