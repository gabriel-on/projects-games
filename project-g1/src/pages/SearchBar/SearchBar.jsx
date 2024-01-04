import React, { useState } from 'react';
import SearchResults from './SearchResults';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // Implemente sua lógica de pesquisa aqui
    console.log('Pesquisando por:', searchTerm);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <input
        type="search"
        name="search"
        id="search"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Pesquisar jogos..."
      />
      <div>
        <SearchResults searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default SearchBar;
