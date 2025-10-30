import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="search-input-group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a city or town name"
            className="search-input"
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={!input.trim()}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;