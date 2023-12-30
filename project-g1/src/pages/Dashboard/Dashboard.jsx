// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getFirestore, collection, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import EditGame from '../../components/EditGame/EditGane';
import DeleteSelectedGames from '../../components/DeleteSelectedGames/DeleteSelectedGames';

import '../AddGame/AddGame.css';

function Dashboard() {
  const [games, setGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);

  const navigate = useNavigate();
  const [selectedGameId, setSelectedGameId] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      const database = getDatabase();
      const gamesRef = ref(database, 'games');

      onValue(gamesRef, (snapshot) => {
        const gamesData = snapshot.val();
        if (gamesData) {
          const gamesArray = Object.entries(gamesData).map(([id, game]) => ({
            id,
            ...game
          }));
          setGames(gamesArray);
        }
      });
    };

    fetchGames();
  }, []);

  const handleEdit = (gameId) => {
    setSelectedGameId(gameId);
    navigate(`/edit/${gameId}`);
  };

  const handleDelete = (gameId) => {
    setSelectedGameId(gameId);
    navigate(`/delete/${gameId}`);
  };

  const handleCheckboxChange = (gameId) => {
    setSelectedGames((prevSelectedGames) =>
      prevSelectedGames.includes(gameId)
        ? prevSelectedGames.filter((selectedGame) => selectedGame !== gameId)
        : [...prevSelectedGames, gameId]
    );
  };

  const deleteSelectedItems = async (selectedItems, collectionRef) => {
    for (const gameId of selectedItems) {
      const gameDocRef = doc(collectionRef, gameId);
      await deleteDoc(gameDocRef);
    }
  };

  const handleDeleteSelected = async (selectedGames) => {
    try {
      const database = getFirestore();
      const gamesCollection = collection(database, 'games');

      await deleteSelectedItems(selectedGames, gamesCollection);

      alert('Jogos selecionados excluídos com sucesso!');

      const updatedGames = games.filter((game) => !selectedGames.includes(game.id));
      setGames(updatedGames);

      setSelectedGames([]);
    } catch (error) {
      console.error('Erro ao excluir jogos selecionados: ', error);
    }
  };

  return (
    <div>
      <h2>Lista de Jogos</h2>
      <DeleteSelectedGames onDeleteSelected={handleDeleteSelected} selectedGames={selectedGames} />
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <input
              type="checkbox"
              checked={selectedGames.includes(game.id)}
              onChange={() => handleCheckboxChange(game.id)}
            />
            <strong>{game.title}</strong>
            <img src={game.image} alt="" />
            <button onClick={() => handleEdit(game.id)}>Editar</button>
            <button onClick={() => handleDelete(game.id)}>Excluir</button>
          </li>
        ))}
      </ul>

      {selectedGameId && <EditGame gameId={selectedGameId} />}
    </div>
  );
}

export default Dashboard;
