import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { Link } from 'react-router-dom';
import '../../pages/Home/Home.css'

const AllGames = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGamesData = async () => {
            try {
                const database = getDatabase();
                const gamesRef = ref(database, 'games');

                const snapshot = await get(gamesRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const gamesArray = Object.entries(data).map(([gameId, gameData]) => ({
                        id: gameId,
                        ...gameData,
                    }));
                    setGames(gamesArray);
                } else {
                    console.log('Nenhum jogo encontrado.');
                }
            } catch (error) {
                console.error('Erro ao obter dados do Firebase:', error);
            }
        };

        fetchGamesData();
    }, []);

    return (
        <div>
            <ul>
                {games.map((game) => (
                    <li key={game.id}>
                        <Link to={`/game/${game.id}`}>
                            <h3>{game.title}</h3>
                            <img src={game.image} alt={game.title} style={{ maxWidth: '100%' }} />
                            <p>{game.description}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllGames;
