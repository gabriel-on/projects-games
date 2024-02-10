import React, { useState, useEffect } from 'react';
import AdvancedSearchResults from './AdvancedSearchResults';
import { getDatabase, ref, get } from 'firebase/database';
import SearchFilters from './SearchFilters';

const AdvancedSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedDeveloper, setSelectedDeveloper] = useState('');
    const [selectedPublisher, setSelectedPublisher] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [games, setGames] = useState([]);
    const [genreGamesCount, setGenreGamesCount] = useState({});
    const [genres, setGenres] = useState([]);
    const [years, setYears] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        const fetchGenres = async () => {
            const database = getDatabase();
            const genresRef = ref(database, 'genres');

            try {
                const snapshot = await get(genresRef);

                if (snapshot.exists()) {
                    const genresData = snapshot.val();
                    const availableGenres = Object.values(genresData);
                    setGenres(availableGenres);
                } else {
                    console.error('Nenhum gênero encontrado.');
                }
            } catch (error) {
                console.error('Erro ao buscar gêneros:', error);
            }
        };

        const fetchYears = async () => {
            const database = getDatabase();
            const gamesRef = ref(database, 'games');

            try {
                const snapshot = await get(gamesRef);

                if (snapshot.exists()) {
                    const gamesData = snapshot.val();

                    const uniqueYears = Array.from(
                        new Set(
                            Object.keys(gamesData).map(
                                (key) => gamesData[key].releaseDate.substring(0, 4)
                            )
                        )
                    );

                    setYears(uniqueYears);
                } else {
                    console.error('Dados de jogos não disponíveis para obter anos.');
                }
            } catch (error) {
                console.error('Erro ao buscar jogos para obter anos:', error);
            }
        };

        const fetchDevelopers = async () => {
            const database = getDatabase();
            const gamesRef = ref(database, 'games');

            try {
                const snapshot = await get(gamesRef);

                if (snapshot.exists()) {
                    const gamesData = snapshot.val();

                    const uniqueDevelopers = Array.from(
                        new Set(
                            Object.keys(gamesData).map(
                                (key) => gamesData[key].developers
                            ).flat()
                        )
                    );

                    setDevelopers(uniqueDevelopers);
                } else {
                    console.error('Dados de jogos não disponíveis para obter desenvolvedores.');
                }
            } catch (error) {
                console.error('Erro ao buscar jogos para obter desenvolvedores:', error);
            }
        };

        const fetchPublishers = async () => {
            const database = getDatabase();
            const gamesRef = ref(database, 'games');

            try {
                const snapshot = await get(gamesRef);

                if (snapshot.exists()) {
                    const gamesData = snapshot.val();

                    const uniquePublishers = Array.from(
                        new Set(
                            Object.keys(gamesData).map(
                                (key) => gamesData[key].publishers
                            ).flat()
                        )
                    );

                    setPublishers(uniquePublishers);
                } else {
                    console.error('Dados de jogos não disponíveis para obter publishers.');
                }
            } catch (error) {
                console.error('Erro ao buscar jogos para obter publishers:', error);
            }
        };

        const fetchRatings = async () => {
            const database = getDatabase();
            const gamesRef = ref(database, 'games');

            try {
                const snapshot = await get(gamesRef);

                if (snapshot.exists()) {
                    const gamesData = snapshot.val();

                    const uniqueRatings = Array.from(
                        new Set(
                            Object.keys(gamesData).map(
                                (key) => gamesData[key].rating
                            )
                        )
                    ).filter(Boolean);

                    setRatings(uniqueRatings);
                } else {
                    console.error('Dados de jogos não disponíveis para obter classificações.');
                }
            } catch (error) {
                console.error('Erro ao buscar jogos para obter classificações:', error);
            }
        };

        // Função para buscar os jogos ao iniciar a página
        const fetchAllGames = async () => {
            const database = getDatabase();
            const gamesRef = ref(database, 'games');

            try {
                const snapshot = await get(gamesRef);

                if (snapshot.exists()) {
                    const gamesData = snapshot.val();
                    const allGames = Object.keys(gamesData).map((key) => ({ ...gamesData[key], id: key }));

                    setGames(allGames);

                    const genreCounts = allGames.reduce((counts, game) => {
                        game.genres.forEach((genre) => {
                            counts[genre] = (counts[genre] || 0) + 1;
                        });
                        return counts;
                    }, {});

                    setGenreGamesCount(genreCounts);

                    // Extrair lista de gêneros dos jogos
                    const uniqueGenres = Array.from(
                        new Set(allGames.flatMap((game) => game.genres))
                    );

                    setGenres(uniqueGenres);
                } else {
                    console.error('Dados de jogos não disponíveis.');
                }
            } catch (error) {
                console.error('Erro ao buscar todos os jogos:', error);
            }
        };

        fetchGenres();
        fetchYears();
        fetchDevelopers();
        fetchPublishers();
        fetchRatings();
        fetchAllGames();
    }, []);

    const fetchGames = async () => {
        const database = getDatabase();
        const gamesRef = ref(database, 'games');

        try {
            const snapshot = await get(gamesRef);

            if (snapshot.exists()) {
                const gamesData = snapshot.val();

                const filteredGames = Object.keys(gamesData)
                    .filter(
                        (key) =>
                            (!selectedGenre ||
                                (gamesData[key].genres &&
                                    gamesData[key].genres.includes(selectedGenre))) &&
                            (!selectedYear || gamesData[key].releaseDate.startsWith(selectedYear)) &&
                            (!selectedDeveloper || gamesData[key].developers.includes(selectedDeveloper)) &&
                            (!selectedPublisher || gamesData[key].publishers.includes(selectedPublisher)) &&
                            (!selectedRating || gamesData[key].rating === selectedRating)
                    )
                    .map((key) => ({ ...gamesData[key], id: key }));

                setGames(filteredGames);

                const genreCounts = filteredGames.reduce((counts, game) => {
                    game.genres.forEach((genre) => {
                        counts[genre] = (counts[genre] || 0) + 1;
                    });
                    return counts;
                }, {});

                setGenreGamesCount(genreCounts);
            } else {
                console.error('Dados de jogos não disponíveis.');
            }
        } catch (error) {
            console.error('Erro ao buscar jogos:', error);
        }
    };

    const handleSearch = () => {
        fetchGames();
    };

    return (
        <div>
            <SearchFilters
                genres={genres}
                years={years}
                developers={developers}
                publishers={publishers}
                ratings={ratings}
                selectedGenre={selectedGenre}
                selectedYear={selectedYear}
                selectedDeveloper={selectedDeveloper}
                selectedPublisher={selectedPublisher}
                selectedRating={selectedRating}
                onGenreChange={(e) => setSelectedGenre(e.target.value)}
                onYearChange={(e) => setSelectedYear(e.target.value)}
                onDeveloperChange={(e) => setSelectedDeveloper(e.target.value)}
                onPublisherChange={(e) => setSelectedPublisher(e.target.value)}
                onRatingChange={(e) => setSelectedRating(e.target.value)}
            />

            <button onClick={handleSearch}>Pesquisar</button>

            <div>
                <h3>Quantidade de Jogos: {games.length}</h3>
                <ul>
                    {Object.entries(genreGamesCount).map(([genre, count]) => (
                        <li key={genre}>{`${genre}: ${count}`}</li>
                    ))}
                </ul>

                <AdvancedSearchResults results={games} />
            </div>
        </div>
    );
};

export default AdvancedSearch;