import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearch, placeholder = "Search products..." }) => {
  return (
    <div className="search-container">
      <div className="search-bar">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            className="clear-button"
            onClick={() => onSearch('')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        )}
      </div>
      <button className="filter-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" fill="currentColor"/>
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;