import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import * as Yup from 'yup';

import '../AddGame/AddGame.css';

function AddGame() {
  const [newGame, setNewGame] = useState({
    title: '',
    description: '',
    image: '',
    genres: []
  });

  const [genresList, setGenresList] = useState([]);
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    image: '',
    genres: '',
  });

  const schema = Yup.object().shape({
    title: Yup.string().required('Campo obrigatório'),
    description: Yup.string().required('Campo obrigatório'),
    image: Yup.string().required('Campo obrigatório'),
    genres: Yup.array()
      .min(1, 'Selecione pelo menos um gênero')
      .required('Campo obrigatório'),
  });

  useEffect(() => {
    // Função para buscar os gêneros do Firebase
    const fetchGenres = async () => {
      const database = getDatabase();
      const genresRef = ref(database, 'genres');

      // Escuta mudanças no nó 'genres'
      onValue(genresRef, (snapshot) => {
        const genresData = snapshot.val();
        if (genresData) {
          // Converte os dados em um array
          const genresArray = Object.values(genresData);
          setGenresList(genresArray);
        }
      });
    };
    // Chama a função para buscar os gêneros
    fetchGenres();
  }, []); // O segundo parâmetro [] garante que a função é executada apenas uma vez, ao montar o componente

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Limpa a mensagem de erro do campo atual
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    // Se for um checkbox, atualize o array de gêneros
    if (type === 'checkbox') {
      setNewGame((prevGame) => {
        const genres = checked
          ? [...prevGame.genres, value]
          : prevGame.genres.filter((genre) => genre !== value);

        return { ...prevGame, genres };
      });
    } else {
      // Se não for um checkbox, atualize normalmente
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

      // Adiciona um novo jogo ao Firebase Realtime Database
      const newGameRef = push(gamesRef);

      // Use set com a referência ao nó recém-criado
      await set(newGameRef, newGame);

      console.log('Novo jogo adicionado com sucesso!');
      // Limpa o estado para um novo jogo
      setNewGame({
        title: '',
        description: '',
        image: '',
        genres: []
      });
      // Limpa as mensagens de erro
      setErrors({
        title: '',
        description: '',
        image: '',
        genres: '',
      });
    } catch (validationError) {
      // Atualiza as mensagens de erro para cada campo
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

        <button type="submit">Adicionar Jogo</button>
      </form>
    </div>
  );
}

export default AddGame;