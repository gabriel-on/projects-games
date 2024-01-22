import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthentication';

// CSS
import '../AddGame/AddGame.css';

import MultipleSitesInput from '../../components/MultipleSitesInput/MultipleSitesInput';
import SecondaryImagesInput from '../../components/SecondaryImagesInput/SecondaryImagesInput';
import SystemRequirements from '../../components/SystemRequirements/SystemRequirements';
import AddGameSelectableList from './AddGameSelectableList';

function AddGame() {
  const [newGame, setNewGame] = useState({
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
    supportedLanguages: [],
    publishers: [], 
    players: [], 
    systemRequirements: {
      minProcessor: '',
      recProcessor: '',
      minRam: '',
      recRam: '',
      minStorage: '',
      recStorage: '',
    },
  });

  const [genresList, setGenresList] = useState([]);
  const [consolesList, setConsolesList] = useState([]);
  const [developersList, setDevelopersList] = useState([]);
  const [supportedLanguagesList, setSupportedLanguagesList] = useState([]);
  const [ratingsList, setRatingsList] = useState([]);
  const [publishersList, setPublishersList] = useState([]);
  const [playersList, setPlayersList] = useState([]);
  const [trailer, setTrailer] = useState('');

  const [hasReleaseDate, setHasReleaseDate] = useState(true);

  const navigate = useNavigate();
  const { error: authError, getCurrentUser } = useAuth();

  const currentUser = getCurrentUser();

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    image: '',
    genres: '',
    consoles: '',
    developers: '',
    rating: '',
    releaseDate: '',
    trailer: '',
  });

  const handleRequirementsChange = (e) => {
    const { name, value } = e.target;

    setSystemRequirements((prevSystemRequirements) => ({
      ...prevSystemRequirements,
      [name]: value,
    }));
  };

  const [systemRequirements, setSystemRequirements] = useState({
    minRam: '',
    minStorage: '',
    recRam: '',
    recStorage: '',
  });

  const schema = Yup.object().shape({
    title: Yup.string().required('Campo obrigatório'),
    description: Yup.string().required('Campo obrigatório'),
    image: Yup.string().required('Campo obrigatório'),
    genres: Yup.array()
      .min(1, 'Selecione pelo menos um gênero')
      .required('Campo obrigatório'),
    consoles: Yup.array()
      .min(1, 'Selecione pelo menos um console')
      .required('Campo obrigatório'),
    rating: Yup.string().required('Campo obrigatório'),
    // officialSite: Yup.string().url('URL inválida'),
    // releaseDate: Yup.string().required('Campo obrigatório'),
    trailer: Yup.string().url('URL do trailer inválida'),
  });

  useEffect(() => {
    const fetchGenres = async () => {
      const database = getDatabase();
      const genresRef = ref(database, 'genres');

      onValue(genresRef, (snapshot) => {
        const genresData = snapshot.val();
        if (genresData) {
          const genresArray = Object.values(genresData);
          setGenresList(genresArray);
        }
      });
    };

    const fetchConsoles = async () => {
      const database = getDatabase();
      const consolesRef = ref(database, 'consoles');

      onValue(consolesRef, (snapshot) => {
        const consolesData = snapshot.val();
        if (consolesData) {
          const consolesArray = Object.values(consolesData);
          setConsolesList(consolesArray);
        }
      });
    };

    const fetchDevelopers = async () => {
      const database = getDatabase();
      const developersRef = ref(database, 'developers');

      onValue(developersRef, (snapshot) => {
        const developersData = snapshot.val();
        if (developersData) {
          const developersArray = Object.values(developersData);
          setDevelopersList(developersArray);
        }
      });
    };

    const fetchRatings = async () => {
      const database = getDatabase();
      const ratingsRef = ref(database, 'ratings');

      onValue(ratingsRef, (snapshot) => {
        const ratingsData = snapshot.val();
        if (ratingsData) {
          const ratingsArray = Object.entries(ratingsData).map(([id, label]) => ({
            id,
            label,
          }));
          setRatingsList(ratingsArray);
        }
      });
    };

    const fetchSupportedLanguages = async () => {
      try {
        const database = getDatabase();
        const supportedLanguagesRef = ref(database, 'supportedLanguages');

        onValue(supportedLanguagesRef, (snapshot) => {
          const supportedLanguagesData = snapshot.val();
          if (supportedLanguagesData) {
            const supportedLanguagesArray = Object.values(supportedLanguagesData);
            setSupportedLanguagesList(supportedLanguagesArray);
          }
        });
      } catch (error) {
        console.error('Erro ao buscar idiomas suportados:', error.message);
      }
    };

    const fetchPublishers = async () => {
      const database = getDatabase();
      const publishersRef = ref(database, 'publishers');
    
      onValue(publishersRef, (snapshot) => {
        const publishersData = snapshot.val();
        if (publishersData) {
          const publishersArray = Object.values(publishersData);
          setPublishersList(publishersArray);
        }
      });
    };    

    const fetchPlayers = async () => {
      const database = getDatabase();
      const playersRef = ref(database, 'players');
    
      onValue(playersRef, (snapshot) => {
        const playersData = snapshot.val();
        if (playersData) {
          const playersArray = Object.values(playersData);
          setPlayersList(playersArray);
        }
      });
    };    

    fetchGenres();
    fetchConsoles();
    fetchDevelopers();
    fetchRatings();
    fetchSupportedLanguages();
    fetchPublishers();
    fetchPlayers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    if (name === 'trailer') {
      setTrailer(value);
    } else if (name === 'hasReleaseDate') {
      setHasReleaseDate(checked);
      // Limpar a data de lançamento se o usuário desmarcar a opção
      if (!checked) {
        setNewGame((prevGame) => ({
          ...prevGame,
          releaseDate: '',
        }));
      }
    } else if (type === 'checkbox') {
      setNewGame((prevGame) => {
        const updatedArray = checked
          ? [...prevGame[name], value]
          : prevGame[name].filter((item) => item !== value);

        return { ...prevGame, [name]: updatedArray };
      });
    } else {
      setNewGame((prevGame) => ({
        ...prevGame,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await schema.validate(newGame, { abortEarly: false });

      const database = getDatabase();
      const gamesRef = ref(database, 'games');

      const currentUser = getCurrentUser();

      if (currentUser) {
        const newGameWithUser = {
          ...newGame,
          addedBy: {
            userId: currentUser.uid,
            displayName: currentUser.displayName,
          },
          createdAt: new Date().toISOString(),
          systemRequirements: systemRequirements,
        };

        const newGameRef = push(gamesRef);
        await set(newGameRef, newGameWithUser);

        console.log('Novo jogo adicionado com sucesso!');
        setNewGame({
          title: '',
          description: '',
          image: '',
          genres: [],
          consoles: [],
          rating: '',
          releaseDate: '',
          trailer: '',
          systemRequirements: {
            minProcessor: '',
            recProcessor: '',
            minRam: '',
            recRam: '',
            minStorage: '',
            recStorage: '',
          },
        });
        setTrailer(''); // Adicione esta linha
        setErrors({
          title: '',
          description: '',
          image: '',
          genres: '',
          consoles: '',
          rating: '',
          releaseDate: '',
          trailer: '', // Adicione esta linha
          userNotFound: '', // Adicione esta linha
        });
        navigate("/dashboard");
      } else {
        setErrors('Usuário não encontrado ao adicionar o jogo.');
      }
    } catch (validationError) {
      const fieldErrors = {};
      validationError.inner.forEach((error) => {
        fieldErrors[error.path] = error.message;
      });
      setErrors(fieldErrors);
    }
  };

  const [showAllGenres, setShowAllGenres]
    = useState(false);
  const [showAllDevelopers, setShowAllDevelopers]
    = useState(false);
  const [showAllConsoles, setShowAllConsoles]
    = useState(false);
  const [showAllRatings, setShowAllRatings]
    = useState(false);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [showAllPublishers, setShowAllPublishers] = useState(false);
  const [showAllPlayers, setShowAllPlayers] = useState(false);

  return (
    <div>
      <form onSubmit={handleSubmit} className='add-game-container'>
        <h2>Adicionar Game</h2>
        <div className='field'>
          <label>
            Título:
            <input
              type="text"
              name="title"
              value={newGame.title}
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
              value={newGame.description}
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
              value={newGame.image}
              onChange={handleChange}
            />
            {errors.image && <p className="error-message">{errors.image}</p>}
          </label>
        </div>

        <AddGameSelectableList
          genresList={genresList}
          consolesList={consolesList}
          developersList={developersList}
          ratingsList={ratingsList}
          supportedLanguagesList={supportedLanguagesList}
          publishersList={publishersList}
          playersList={playersList}

          newGame={newGame}

          handleChange={handleChange}

          showAllGenres={showAllGenres}
          showAllConsoles={showAllConsoles}
          showAllDevelopers={showAllDevelopers}
          showAllRatings={showAllRatings}
          showAllLanguages={showAllLanguages}
          showAllPublishers={showAllPublishers}
          showAllPlayers={showAllPlayers} 

          setShowAllGenres={setShowAllGenres}
          setShowAllConsoles={setShowAllConsoles}
          setShowAllDevelopers={setShowAllDevelopers}
          setShowAllRatings={setShowAllRatings}
          setShowAllLanguages={setShowAllLanguages}
          setShowAllPublishers={setShowAllPublishers}
          setShowAllPlayers={setShowAllPlayers}

          errors={errors}
        />

        <SystemRequirements
          systemRequirements={systemRequirements}
          onChange={handleRequirementsChange}
        />

        <SecondaryImagesInput
          name="secondaryImages"
          value={newGame.secondaryImages}
          onChange={handleChange}
          error={errors.secondaryImages}
        />

        <MultipleSitesInput
          name="officialSites"
          value={newGame.officialSites}
          onChange={handleChange}
          error={errors.officialSite}
        />

        <div className='field'>
          <label>
            Trailer (Opcional):
            <input
              type="text"
              name="trailer"
              value={trailer}
              onChange={(e) => setTrailer(e.target.value)}
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
                value={newGame.releaseDate}
                onChange={handleChange}
              />
              {errors.releaseDate && <p className="error-message">{errors.releaseDate}</p>}
            </label>
          </div>
        )}

        <div className='field'>
          <label>
            Data de Lançamento Específica:
            <input
              type="checkbox"
              name="hasReleaseDate"
              checked={hasReleaseDate}
              onChange={handleChange}
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
                value={newGame.unspecifiedReleaseDate}
                onChange={handleChange}
              />
            </label>
          </div>
        )}

        <button type="submit">Adicionar Jogo</button>
      </form>
    </div>
  );
}

export default AddGame;