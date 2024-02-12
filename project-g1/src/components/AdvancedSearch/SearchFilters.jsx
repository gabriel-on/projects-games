import React from 'react';

const SearchFilters = ({
  genres,
  years,
  developers,
  publishers,
  ratings,
  selectedGenre,
  selectedYear,
  selectedDeveloper,
  selectedPublisher,
  selectedRating,
  onGenreChange,
  onYearChange,
  onDeveloperChange,
  onPublisherChange,
  onRatingChange,
  selectedSort,
  onSortChange
}) => {
  return (
    <div className="search-filters">
      <div className="filter-group">
        <label>Gênero:</label>
        <select value={selectedGenre} onChange={onGenreChange}>
          <option key="" value="">
            Todos os Gêneros
          </option>
          {genres.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Ano:</label>
        <select value={selectedYear} onChange={onYearChange}>
          <option key="" value="">
            Todos os Anos
          </option>
          {years.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Desenvolvedor:</label>
        <select value={selectedDeveloper} onChange={onDeveloperChange}>
          <option key="" value="">
            Todos os Desenvolvedores
          </option>
          {developers.map((developer, index) => (
            <option key={index} value={developer}>
              {developer}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Distribuidora:</label>
        <select value={selectedPublisher} onChange={onPublisherChange}>
          <option key="" value="">
            Todos as Distribuidoras
          </option>
          {publishers.map((publisher, index) => (
            <option key={index} value={publisher}>
              {publisher}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Idade:</label>
        <select value={selectedRating} onChange={onRatingChange}>
          <option key="" value="">
            Todas as Idades
          </option>
          {ratings.map((rating, index) => (
            <option key={index} value={rating}>
              {rating}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Ordenar por:</label>
        <select value={selectedSort} onChange={onSortChange}>
          <option value="">Sem ordenação</option>
          <option value="name">Nome</option>
          <option value="releaseDate">Data de Lançamento</option>
          <option value="rating">Idade</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;