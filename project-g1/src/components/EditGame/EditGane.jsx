import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

function EditGame() {
    const { gameId } = useParams();
    const navigate = useNavigate();

    const [game, setGame] = useState({
        title: '',
        description: '',
        image: '',
        genres: [],
        consoles: [],
        rating: '',
        officialSite: ''
    });

    const [genresList, setGenresList] = useState([]);
    const [consolesList, setConsolesList] = useState([]);
    const [ratingsList, setRatingsList] = useState([]);

    const [errors, setErrors] = useState({
        title: '',
        description: '',
        image: '',
        genres: '',
        consoles: '',
        rating: '',
        officialSite: ''
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
    });

    useEffect(() => {
        const fetchGame = async () => {
            const database = getDatabase();
            const gameRef = ref(database, `games/${gameId}`);

            onValue(gameRef, (snapshot) => {
                const gameData = snapshot.val();
                if (gameData) {
                    setGame({
                        title: gameData.title || '',
                        description: gameData.description || '',
                        image: gameData.image || '',
                        genres: gameData.genres || [],
                        consoles: gameData.consoles || [],
                        rating: gameData.rating || '',
                        officialSite: gameData.officialSite || ''
                    });
                }
            });
        };

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

        const fetchRatings = async () => {
            const database = getDatabase();
            const ratingsRef = ref(database, 'ratings');

            onValue(ratingsRef, (snapshot) => {
                const ratingsData = snapshot.val();
                if (ratingsData) {
                    const ratingsArray = Object.entries(ratingsData).map(([id, label]) => ({
                        id,
                        label
                    }));
                    setRatingsList(ratingsArray);
                }
            });
        };

        fetchGame();
        fetchGenres();
        fetchConsoles();
        fetchRatings();
    }, [gameId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));

        if (type === 'checkbox') {
            setGame((prevGame) => {
                const updatedArray = checked
                    ? [...prevGame[name], value]
                    : prevGame[name].filter((item) => item !== value);

                return { ...prevGame, [name]: updatedArray };
            });
        } else {
            setGame((prevGame) => ({
                ...prevGame,
                [name]: value,
            }));
        }
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
                        {genresList.map((genre) => (
                            <label key={genre} className='genre'>
                                <input
                                    type="checkbox"
                                    name="genres"
                                    value={genre}
                                    checked={game && game.genres && game.genres.includes(genre)}
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
                                    checked={game && game.consoles && game.consoles.includes(console)}
                                    onChange={handleChange}
                                />
                                {console}
                            </label>
                        ))}
                        {errors.consoles && <p className="error-message">{errors.consoles}</p>}
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
                                    checked={game.rating === rating.label}
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
                            value={game.officialSite}
                            onChange={handleChange}
                        />
                        {errors.officialSite && <p className="error-message">{errors.officialSite}</p>}
                    </label>
                </div>

                <button type="submit">Salvar Edições</button>
            </form>
        </div>
    );
}

export default EditGame;
