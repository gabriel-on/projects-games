import React, { useState } from 'react';
import SearchResults from './SearchResults';
import '../SearchBar/SearchBar.css'
import { Link } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='search'>
      <div className='search-bar-container'>
        <input
          type="search"
          name="search"
          id="search-bar"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Pesquisar jogos..."
        />
        <div>
          <Link to={"/genres"} className='find-genres'>Procurar por Genero</Link>
        </div>
      </div>
      <div>
        <SearchResults searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default SearchBar;
