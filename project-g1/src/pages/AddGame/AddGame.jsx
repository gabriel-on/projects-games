// AddGame.js

import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthentication';
import '../AddGame/AddGame.css';

function AddGame() {
  const [newGame, setNewGame] = useState({
    title: '',
    description: '',
    image: '',
    genres: [],
    consoles: [],
    developers: [],
    rating: '',
    officialSite: '',
    releaseDate: '',
    addedBy: null,
    trailer: '',
  });

  const [genresList, setGenresList] = useState([]);
  const [consolesList, setConsolesList] = useState([]);
  const [developersList, setDevelopersList] = useState([]);
  const [ratingsList, setRatingsList] = useState([]);
  const [trailer, setTrailer] = useState('');

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
    officialSite: '',
    releaseDate: '',
    trailer: '',
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
    officialSite: Yup.string().url('URL inválida'),
    releaseDate: Yup.string().required('Campo obrigatório'),
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

    fetchGenres();
    fetchConsoles();
    fetchDevelopers();
    fetchRatings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    if (name === 'trailer') {
      setTrailer(value);
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
          addedBy: currentUser.displayName,
          createdAt: new Date().toISOString(),
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
          officialSite: '',
          releaseDate: '',
          trailer: '', // Adicione esta linha
        });
        setTrailer(''); // Adicione esta linha
        setErrors({
          title: '',
          description: '',
          image: '',
          genres: '',
          consoles: '',
          rating: '',
          officialSite: '',
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

        <div className='field'>
          <p>Gêneros:</p>
          <div className='genres-list'>
            {genresList.map((genre) => (
              <label key={genre} className='genre'>
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
        </div>

        <div className='field'>
          <p>Consoles:</p>
          <div className='consoles-list'>
            {consolesList.map((console) => (
              <label key={console} className='console'>
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
        </div>

        <div className='field'>
          <p>Desenvolvedores:</p>
          <div className='developers-list'>
            {developersList.map((developer) => (
              <label key={developer} className='developer'>
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
        </div>

        <div className='field'>
          <p>Classificação Indicativa:</p>
          <div className='rating-list'>
            {ratingsList.map((rating) => (
              <label key={rating.id} className='rating'>
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
        </div>

        <div className='field'>
          <label>
            Site Oficial (Opcional):
            <input
              type="text"
              name="officialSite"
              value={newGame.officialSite}
              onChange={handleChange}
            />
            {errors.officialSite && <p className="error-message">{errors.officialSite}</p>}
          </label>
        </div>

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

        <button type="submit">Adicionar Jogo</button>
      </form>
    </div>
  );
}

export default AddGame;