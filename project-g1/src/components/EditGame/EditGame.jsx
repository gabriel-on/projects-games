import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import MultipleSitesInput from '../MultipleSitesInput/MultipleSitesInput';
import SecondaryImagesInput from '../SecondaryImagesInput/SecondaryImagesInput';

const EditGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState({
    title: '',
    description: '',
    image: '',
    genres: [],
    consoles: [],
    developers: [],
    rating: '',
    releaseDate: '',
    addedBy: null,
    trailer: '', // Adicione o campo do trailer aqui
  });

  const [lists, setLists] = useState({
    genres: [],
    consoles: [],
    developers: [],
    ratings: [],
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    image: '',
    genres: '',
    consoles: '',
    developers: '',
    rating: '',
    trailer: '', // Adicione o campo do trailer aqui
  });

  const schema = Yup.object().shape({
    title: Yup.string().required('Campo obrigatório'),
    description: Yup.string().required('Campo obrigatório'),
    image: Yup.string().required('Campo obrigatório'),
    genres: Yup.array().min(1, 'Selecione pelo menos um gênero').required('Campo obrigatório'),
    consoles: Yup.array().min(1, 'Selecione pelo menos um console').required('Campo obrigatório'),
    developers: Yup.array().min(1, 'Selecione pelo menos uma desenvolvedora').required('Campo obrigatório'),
    rating: Yup.string().required('Campo obrigatório'),
    // officialSites: Yup.string().url('URL inválida'),
    releaseDate: Yup.date().required('Campo obrigatório'),
    trailer: Yup.string().url('URL do trailer inválida'), // Adicione o campo do trailer aqui
  });

  useEffect(() => {
    const fetchData = async (collection, stateKey) => {
      const database = getDatabase();
      const collectionRef = ref(database, collection);

      onValue(collectionRef, (snapshot) => {
        const collectionData = snapshot.val();
        if (collectionData) {
          const collectionArray = Object.values(collectionData);
          setLists((prevLists) => ({ ...prevLists, [stateKey]: collectionArray }));
        }
      });
    };

    const fetchGame = async () => {
      const database = getDatabase();
      const gameRef = ref(database, `games/${gameId}`);

      onValue(gameRef, (snapshot) => {
        const gameData = snapshot.val();
        if (gameData) {
          setGame({
            ...gameData,
            title: gameData.title || '',
            description: gameData.description || '',
            image: gameData.image || '',
            genres: gameData.genres || [],
            consoles: gameData.consoles || [],
            developers: gameData.developers || [],
            rating: gameData.rating || '',
            releaseDate: gameData.releaseDate || '',
            trailer: gameData.trailer || '', // Adicione o campo do trailer aqui
          });
        }
      });
    };

    fetchGame();
    fetchData('genres', 'genres');
    fetchData('consoles', 'consoles');
    fetchData('developers', 'developers');
    fetchData('ratings', 'ratings');
  }, [gameId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    setGame((prevGame) => {
      if (type === 'checkbox') {
        const updatedArray = checked
          ? [...prevGame[name], value]
          : prevGame[name].filter((item) => item !== value);
        return { ...prevGame, [name]: updatedArray };
      } else {
        return { ...prevGame, [name]: value };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await schema.validate(game, { abortEarly: false });

      const database = getDatabase();
      const gameRef = ref(database, `games/${gameId}`);
      await set(gameRef, game);

      console.log('Jogo editado com sucesso!');
      navigate(`/game/${gameId}`);
    } catch (validationError) {
      const fieldErrors = {};
      validationError.inner.forEach((error) => {
        fieldErrors[error.path] = error.message;
      });
      setErrors(fieldErrors);
    }
  };

  const MAX_OPTIONS_DISPLAYED = 12; // Defina o número máximo de opções a serem exibidas

  const [showAllGenres, setShowAllGenres]
    = useState(false);
  const [showAllDevelopers, setShowAllDevelopers]
    = useState(false);
  const [showAllConsoles, setShowAllConsoles]
    = useState(false);
  const [showAllRatings, setShowAllRatings]
    = useState(false);

  return (
    <div>
      <form onSubmit={handleSubmit} className='edit-game-container'>
        <h2>Editar Jogo</h2>

        <div className='field'>
          <label>
            Título:
            <input
              type="text"
              name="title"
              value={game.title}
              onChange={handleChange}
            />
            {errors.title && <p className="error-message">{errors.title}</p>}
          </label>
        </div>

        <div className='field'>
          <label>
            Descrição:
            <textarea
              name="description"
              value={game.description}
              onChange={handleChange}
            />
            {errors.description && <p className="error-message">{errors.description}</p>}
          </label>
        </div>

        <div className='field'>
          <label>
            URL da Imagem:
            <input
              type="text"
              name="image"
              value={game.image}
              onChange={handleChange}
            />
            {errors.image && <p className="error-message">{errors.image}</p>}
          </label>
        </div>

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

        <SecondaryImagesInput
          name="secondaryImages"
          value={game.secondaryImages}
          onChange={handleChange}
          error={errors.secondaryImages}
        />

        <MultipleSitesInput
          name="officialSites"
          value={game.officialSites}
          onChange={handleChange}
          error={errors.officialSites}
        />

        <div className='field'>
          <label>
            Trailer (Opcional):
            <input
              type="text"
              name="trailer"
              value={game.trailer}
              onChange={handleChange}
            />
            {errors.trailer && <p className="error-message">{errors.trailer}</p>}
          </label>
        </div>

        <div className='field'>
          <label>
            Data de Lançamento:
            <input
              type="date"
              name="releaseDate"
              value={game.releaseDate}
              onChange={handleChange}
            />
            {errors.releaseDate && <p className="error-message">{errors.releaseDate}</p>}
          </label>
        </div>

        <button type="submit">Salvar Edições</button>
      </form>
    </div>
  );
};

export default EditGame;
