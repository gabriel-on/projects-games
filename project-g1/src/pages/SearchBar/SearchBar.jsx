import React, { useState } from 'react';
import SearchResults from './SearchResults';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  return (
    <div>
      <input
        type="search"
        name="search"
        id="search"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Digite o nome do jogo"
      />
      <div>
        <SearchResults searchTerm={searchTerm} />
      </div>
    </div>
  );
}

export default SearchBar;
