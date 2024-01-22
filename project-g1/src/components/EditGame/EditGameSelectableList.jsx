import React from 'react'

function EditGameSelectableList({
    showAllGenres,
    setShowAllGenres,
    showAllDevelopers,
    setShowAllDevelopers,
    showAllConsoles,
    setShowAllConsoles,
    showAllRatings,
    setShowAllRatings,
    showAllPlayers,
    setShowAllPlayers,
    showAllPublishers,
    setShowAllPublishers,
    showAllLanguages,
    setShowAllLanguages,
    lists,
    handleChange,
    errors,
    game }) {

    const MAX_OPTIONS_DISPLAYED = 12;

    return (
        <div>
            <div className='field'>
                <p>Gêneros:</p>
                <div className='genres-list'>
                    {lists.genres.slice(0, showAllGenres ? lists.genres.length : MAX_OPTIONS_DISPLAYED).map((genre) => (
                        <label
                            key={genre}
                            className={`genre ${game.genres && game.genres.includes(genre) ? 'checked-genre' : ''}`}
                        >
                            <input
                                type="checkbox"
                                name="genres"
                                value={genre}
                                checked={game.genres && game.genres.includes(genre)}
                                onChange={handleChange}
                            />
                            {genre}
                        </label>
                    ))}
                    {errors.genres && <p className="error-message">{errors.genres}</p>}
                </div>
                {lists.genres.length > MAX_OPTIONS_DISPLAYED && !showAllGenres && (
                    <button className="show-more-options" onClick={() => setShowAllGenres(true)}>
                        Mostrar Mais
                    </button>
                )}
            </div>

            <div className='field'>
                <p>Consoles:</p>
                <div className='consoles-list'>
                    {lists.consoles.slice(0, showAllConsoles ? lists.consoles.length : MAX_OPTIONS_DISPLAYED).map((console) => (
                        <label
                            key={console}
                            className={`console ${game.consoles && game.consoles.includes(console) ? 'checked-console' : ''}`}
                        >
                            <input
                                type="checkbox"
                                name="consoles"
                                value={console}
                                checked={game.consoles && game.consoles.includes(console)}
                                onChange={handleChange}
                            />
                            {console}
                        </label>
                    ))}
                    {errors.consoles && <p className="error-message">{errors.consoles}</p>}
                </div>
                {lists.consoles.length > MAX_OPTIONS_DISPLAYED && !showAllConsoles && (
                    <button className="show-more-options" onClick={() => setShowAllConsoles(true)}>
                        Mostrar Mais
                    </button>
                )}
            </div>

            <div className='field'>
                <p>Desenvolvedores:</p>
                <div className='developers-list'>
                    {lists.developers.slice(0, showAllDevelopers ? lists.developers.length : MAX_OPTIONS_DISPLAYED).map((developer) => (
                        <label
                            key={developer}
                            className={`developer ${game.developers && game.developers.includes(developer) ? 'checked-developer' : ''}`}
                        >
                            <input
                                type="checkbox"
                                name="developers"
                                value={developer}
                                checked={game.developers && game.developers.includes(developer)}
                                onChange={handleChange}
                            />
                            {developer}
                        </label>
                    ))}
                    {errors.developers && <p className="error-message">{errors.developers}</p>}
                </div>
                {lists.developers.length > MAX_OPTIONS_DISPLAYED && !showAllDevelopers && (
                    <button className="show-more-options" onClick={() => setShowAllDevelopers(true)}>
                        Mostrar Mais
                    </button>
                )}
            </div>

            <div className='field'>
                <p>Publicadoras:</p>
                <div className='publishers-list'>
                    {lists.publishers.slice(0, showAllPublishers ? lists.publishers.length : MAX_OPTIONS_DISPLAYED).map((publisher) => (
                        <label
                            key={publisher}
                            className={`publisher ${game.publishers && game.publishers.includes(publisher) ? 'checked-publisher' : ''}`}
                        >
                            <input
                                type="checkbox"
                                name="publishers"
                                value={publisher}
                                checked={game.publishers && game.publishers.includes(publisher)}
                                onChange={handleChange}
                            />
                            {publisher}
                        </label>
                    ))}
                    {errors.publishers && <p className="error-message">{errors.publishers}</p>}
                </div>
                {lists.publishers.length > MAX_OPTIONS_DISPLAYED && !showAllPublishers && (
                    <button className="show-more-options" onClick={() => setShowAllPublishers(true)}>
                        Mostrar Mais
                    </button>
                )}
            </div>

            <div className='field'>
                <p>Classificação Indicativa:</p>
                <div className='rating-list'>
                    {lists.ratings.slice(0, showAllRatings ? lists.ratings.length : MAX_OPTIONS_DISPLAYED).map((rating) => (
                        <label
                            key={rating}
                            className={`rating ${game.rating === rating ? 'checked-rating' : ''}`}
                        >
                            <input
                                type="radio"
                                name="rating"
                                value={rating}
                                checked={game.rating === rating}
                                onChange={handleChange}
                            />
                            {rating}
                        </label>
                    ))}
                    {errors.rating && <p className="error-message">{errors.rating}</p>}
                </div>
                {lists.ratings.length > MAX_OPTIONS_DISPLAYED && !showAllRatings && (
                    <button className="show-more-options" onClick={() => setShowAllRatings(true)}>
                        Mostrar Mais
                    </button>
                )}
            </div>

            <div className='field'>
                <p>Idiomas Suportados:</p>
                <div className='languages-list'>
                    {lists.supportedLanguages.slice(0, showAllLanguages ? lists.supportedLanguages.length : MAX_OPTIONS_DISPLAYED).map((language) => (
                        <label
                            key={language}
                            className={`language ${game.supportedLanguages && game.supportedLanguages.includes(language) ? 'checked-language' : ''}`}
                        >
                            <input
                                type="checkbox"
                                name="supportedLanguages"
                                value={language}
                                checked={game.supportedLanguages && game.supportedLanguages.includes(language)}
                                onChange={handleChange}
                            />
                            {language}
                        </label>
                    ))}
                    {errors.supportedLanguages && <p className="error-message">{errors.supportedLanguages}</p>}
                </div>
                {lists.supportedLanguages.length > MAX_OPTIONS_DISPLAYED && !showAllLanguages && (
                    <button className="show-more-options" onClick={() => setShowAllLanguages(true)}>
                        Mostrar Mais
                    </button>
                )}
            </div>


            <div className='field'>
                <p>Jogadores:</p>
                <div className='players-list'>
                    {lists.players.slice(0, showAllPlayers ? lists.players.length : MAX_OPTIONS_DISPLAYED).map((player) => (
                        <label
                            key={player}
                            className={`player ${game.players && game.players.includes(player) ? 'checked-player' : ''}`}
                        >
                            <input
                                type="checkbox"
                                name="players"
                                value={player}
                                checked={game.players && game.players.includes(player)}
                                onChange={handleChange}
                            />
                            {player}
                        </label>
                    ))}
                    {errors.players && <p className="error-message">{errors.players}</p>}
                </div>
                {lists.players.length > MAX_OPTIONS_DISPLAYED && !showAllPlayers && (
                    <button className="show-more-options" onClick={() => setShowAllPlayers(true)}>
                        Mostrar Mais
                    </button>
                )}
            </div>

        </div>
    )
}

export default EditGameSelectableList