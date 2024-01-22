import React, { useState } from 'react';

function AddGameSelectableList({
  handleChange,
  genresList,
  consolesList,
  developersList,
  newGame,
  showAllGenres,
  showAllConsoles,
  showAllDevelopers,
  showAllRatings,
  showAllLanguages,
  setShowAllGenres,
  setShowAllConsoles,
  setShowAllDevelopers,
  setShowAllRatings,
  setShowAllLanguages,
  errors,
  ratingsList,
  supportedLanguagesList, }) {
  const MAX_OPTIONS_DISPLAYED = 12;

  return (
    <div>
      <div className='field'>
        <p>Gêneros:</p>
        <div className='genres-list'>
          {genresList.slice(0, showAllGenres ? genresList.length : MAX_OPTIONS_DISPLAYED).map((genre) => (
            <label
              key={genre}
              className={`genre ${newGame.genres.includes(genre) ? 'checked-genre' : ''}`}
            >
              <input
                type="checkbox"
                name="genres"
                value={genre}
                checked={newGame.genres.includes(genre)}
                onChange={handleChange}
              />
              {genre}
            </label>
          ))}
          {errors.genres && <p className="error-message">{errors.genres}</p>}
        </div>
        {genresList.length > MAX_OPTIONS_DISPLAYED && !showAllGenres && (
          <button className="show-more-options" onClick={() => setShowAllGenres(true)}>
            Mostrar Tudo
          </button>
        )}
      </div>

      <div className='field'>
        <p>Consoles:</p>
        <div className='consoles-list'>
          {consolesList.slice(0, showAllConsoles ? consolesList.length : MAX_OPTIONS_DISPLAYED).map((console) => (
            <label
              key={console}
              className={`console ${newGame.consoles.includes(console) ? 'checked-console' : ''}`}
            >
              <input
                type="checkbox"
                name="consoles"
                value={console}
                checked={newGame.consoles.includes(console)}
                onChange={handleChange}
              />
              {console}
            </label>
          ))}
          {errors.consoles && <p className="error-message">{errors.consoles}</p>}
        </div>
        {consolesList.length > MAX_OPTIONS_DISPLAYED && !showAllConsoles && (
          <button className="show-more-options" onClick={() => setShowAllConsoles(true)}>
            Mostrar Tudo
          </button>
        )}
      </div>

      <div className='field'>
        <p>Desenvolvedores:</p>
        <div className='developers-list'>
          {developersList.slice(0, showAllDevelopers ? developersList.length : MAX_OPTIONS_DISPLAYED).map((developer) => (
            <label
              key={developer}
              className={`developer ${newGame.developers.includes(developer) ? 'checked-developer' : ''}`}
            >
              <input
                type="checkbox"
                name="developers"
                value={developer}
                checked={newGame.developers.includes(developer)}
                onChange={handleChange}
              />
              {developer}
            </label>
          ))}
          {errors.developers && <p className="error-message">{errors.developers}</p>}
        </div>
        {developersList.length > MAX_OPTIONS_DISPLAYED && !showAllDevelopers && (
          <button className="show-more-options" onClick={() => setShowAllDevelopers(true)}>
            Mostrar Tudo
          </button>
        )}
      </div>

      <div className='field'>
        <p>Classificação Indicativa:</p>
        <div className='rating-list'>
          {ratingsList.slice(0, showAllRatings ? ratingsList.length : MAX_OPTIONS_DISPLAYED).map((rating) => (
            <label
              key={rating.id}
              className={`rating ${newGame.rating === rating.label ? 'checked-rating' : ''}`}
            >
              <input
                type="radio"
                name="rating"
                value={rating.label}
                checked={newGame.rating === rating.label}
                onChange={handleChange}
              />
              {rating.label}
            </label>
          ))}
          {errors.rating && <p className="error-message">{errors.rating}</p>}
        </div>
        {ratingsList.length > MAX_OPTIONS_DISPLAYED && !showAllRatings && (
          <button className="show-more-options" onClick={() => setShowAllRatings(true)}>
            Mostrar Tudo
          </button>
        )}
      </div>

      <div className='field'>
        <p>Idiomas Suportados:</p>
        <div className='languages-list'>
          {supportedLanguagesList.slice(0, showAllLanguages ? supportedLanguagesList.length : MAX_OPTIONS_DISPLAYED).map((language) => (
            <label
              key={language}
              className={`language ${newGame.supportedLanguages.includes(language) ? 'checked-language' : ''}`}
            >
              <input
                type="checkbox"
                name="supportedLanguages"
                value={language}
                checked={newGame.supportedLanguages.includes(language)}
                onChange={handleChange}
              />
              {language}
            </label>
          ))}
          {errors.supportedLanguages && <p className="error-message">{errors.supportedLanguages}</p>}
        </div>
        {supportedLanguagesList.length > MAX_OPTIONS_DISPLAYED && !showAllLanguages && (
          <button className="show-more-options" onClick={() => setShowAllLanguages(true)}>
            Mostrar Tudo
          </button>
        )}
      </div>

    </div>
  );
}

export default AddGameSelectableList;
