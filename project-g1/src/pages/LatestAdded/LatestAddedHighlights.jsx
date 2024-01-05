import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { Link } from 'react-router-dom';

const LatestAddedHighlights = ({ gamesPerPage, currentPage }) => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGamesData = async () => {
            try {
                const database = getDatabase();
                const gamesRef = ref(database, 'games');

                const snapshot = await get(gamesRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const gamesArray = Object.entries(data)
                        .map(([gameId, gameData]) => ({
                            id: gameId,
                            ...gameData,
                        }));

                    const gamesWithCreatedAt = gamesArray.filter(game => game.createdAt);

                    gamesWithCreatedAt.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    const startIndex = (currentPage - 1) * gamesPerPage;
                    const endIndex = startIndex + gamesPerPage;

                    const limitedGamesArray = gamesWithCreatedAt.slice(startIndex, endIndex);
                    setGames(limitedGamesArray);
                } else {
                    console.log('Nenhum jogo encontrado.');
                }
            } catch (error) {
                console.error('Erro ao obter dados do Firebase:', error);
            }
        };

        fetchGamesData();
    }, [gamesPerPage, currentPage]);

    return (
        <div className='all-games-list-container'>
            <ul className='all-games-list'>
                {games.map((game) => (
                    <li key={game.id}>
                        <Link to={`/game/${game.id}`}>
                            <img src={game.image} alt={game.title} />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LatestAddedHighlights;
