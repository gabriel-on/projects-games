import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import MultipleSitesInput from '../MultipleSitesInput/MultipleSitesInput';
import SecondaryImagesInput from '../SecondaryImagesInput/SecondaryImagesInput';
import SystemRequirements from '../SystemRequirements/SystemRequirements';
import EditGameSelectableList from './EditGameSelectableList';

const EditGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [hasReleaseDate, setHasReleaseDate] = useState(true);

  const [game, setGame] = useState({
    title: '',
    description: '',
    image: '',
    genres: [],
    consoles: [],
    developers: [],
    rating: '',
    releaseDate: '',
    unspecifiedReleaseDate: '',
    addedBy: null,
    trailer: '',
    players: [],
    systemRequirements: {
      minGraphicsCard1: '',
      minGraphicsCard2: '',
      minProcessor1: '',
      minProcessor2: '',
      minRam: '',
      minStorage: '',
      recGraphicsCard1: '',
      recGraphicsCard2: '',
      recProcessor1: '',
      recProcessor2: '',
      recRam: '',
      recStorage: '',
    },
  });

  const [lists, setLists] = useState({
    genres: [],
    consoles: [],
    developers: [],
    ratings: [],
    unspecifiedReleaseDate: '',
    supportedLanguages: [],
    publishers: [],
    players: [],
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    image: '',
    genres: '',
    consoles: '',
    developers: '',
    rating: '',
    trailer: '',
    players: [],
  });

  const handleRequirementsChange = (e) => {
    const { name, value } = e.target;

    setGame((prevGame) => ({
      ...prevGame,
      systemRequirements: {
        ...prevGame.systemRequirements,
        [name]: value,
      },
    }));
  };

  const schema = Yup.object().shape({
    title: Yup.string().required('Campo obrigatório'),
    description: Yup.string().required('Campo obrigatório'),
    image: Yup.string().required('Campo obrigatório'),
    genres: Yup.array().min(1, 'Selecione pelo menos um gênero').required('Campo obrigatório'),
    consoles: Yup.array().min(1, 'Selecione pelo menos um console').required('Campo obrigatório'),
    developers: Yup.array().min(1, 'Selecione pelo menos uma desenvolvedora').required('Campo obrigatório'),
    rating: Yup.string().required('Campo obrigatório'),
    // officialSites: Yup.string().url('URL inválida'),
    releaseDate: Yup.mixed(), // Remova a validação específica da data
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
            trailer: gameData.trailer || '',
            players: gameData.players || [],
          });
        }
      });
    };

    fetchGame();
    fetchData('genres', 'genres');
    fetchData('consoles', 'consoles');
    fetchData('developers', 'developers');
    fetchData('ratings', 'ratings');
    fetchData('players', 'players');
    fetchData('publishers', 'publishers');
    fetchData('supportedLanguages', 'supportedLanguages');
  }, [gameId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    setGame((prevGame) => {
      if (type === 'checkbox' && name === 'hasReleaseDate') {
        setHasReleaseDate(checked);

        return {
          ...prevGame,
          unspecifiedReleaseDate: checked ? '' : prevGame.unspecifiedReleaseDate,
        };
      }

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
      if (validationError.inner) {
        validationError.inner.forEach((error) => {
          fieldErrors[error.path] = error.message;
        });
      }

    }
  };
  const handleClearReleaseDate = () => {
    setGame((prevGame) => ({
      ...prevGame,
      releaseDate: '',
      unspecifiedReleaseDate: '',
    }));
    setHasReleaseDate(false); // Desmarcar o checkbox
  };

  const [showAllGenres, setShowAllGenres]
    = useState(false);
  const [showAllDevelopers, setShowAllDevelopers]
    = useState(false);
  const [showAllConsoles, setShowAllConsoles]
    = useState(false);
  const [showAllRatings, setShowAllRatings]
    = useState(false);
  const [showAllPlayers, setShowAllPlayers]
    = useState(false)
  const [showAllPublishers, setShowAllPublishers]
    = useState(false);
  const [showAllLanguages, setShowAllLanguages]
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

        <EditGameSelectableList
          lists={lists}

          showAllGenres={showAllGenres}
          showAllDevelopers={showAllDevelopers}
          showAllConsoles={showAllConsoles}
          showAllRatings={showAllRatings}
          showAllPlayers={showAllPlayers}
          showAllPublishers={showAllPublishers}
          showAllLanguages={showAllLanguages}

          handleChange={handleChange}
          game={game}

          setShowAllGenres={setShowAllGenres}
          setShowAllDevelopers={setShowAllDevelopers}
          setShowAllConsoles={setShowAllConsoles}
          setShowAllRatings={setShowAllRatings}
          setShowAllPlayers={setShowAllPlayers}
          setShowAllPublishers={setShowAllPublishers}
          setShowAllLanguages={setShowAllLanguages}

          errors={errors}
        />

        <SystemRequirements
          systemRequirements={game.systemRequirements}
          onChange={handleRequirementsChange}
        />

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

        {hasReleaseDate && (
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
        )}

        {/* Botão para limpar a data de lançamento */}
        {hasReleaseDate && (
          <div className='field'>
            <button type="button" onClick={handleClearReleaseDate}>
              Limpar Data de Lançamento
            </button>
          </div>
        )}

        <div className='field'>
          <label>
            Data de Lançamento Específica:
            <input
              type="checkbox"
              name="hasReleaseDate"
              checked={hasReleaseDate}
              onChange={() => setHasReleaseDate(!hasReleaseDate)}
            />
          </label>
        </div>

        {!hasReleaseDate && (
          <div className='field'>
            <label>
              Data de Lançamento Não Especificada:
              <input
                type="text"
                name="unspecifiedReleaseDate"
                value={game.unspecifiedReleaseDate}
                onChange={handleChange}
              />
            </label>
          </div>
        )}

        <button type="submit">Salvar Edições</button>
      </form>
    </div>
  );
};

export default EditGame;