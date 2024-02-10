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
}) => {
  return (
    <div>
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

      <select value={selectedPublisher} onChange={onPublisherChange}>
        <option key="" value="">
          Todos os Publishers
        </option>
        {publishers.map((publisher, index) => (
          <option key={index} value={publisher}>
            {publisher}
          </option>
        ))}
      </select>

      {/* Dropdown de seleção para rating */}
      <select value={selectedRating} onChange={onRatingChange}>
        <option key="" value="">
          Todas as Classificações
        </option>
        {ratings.map((rating, index) => (
          <option key={index} value={rating}>
            {rating}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilters;
