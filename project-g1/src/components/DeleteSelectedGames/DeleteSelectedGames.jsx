import React, { useState } from 'react';

function DeleteSelectedGames({ onDeleteSelected, selectedGames }) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleDeleteSelected = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log('Clicado em Confirmar Exclusão');
    onDeleteSelected(selectedGames);
    setIsConfirmationOpen(false);
  };

  const handleCancelDelete = () => {
    console.log('Clicado em Cancelar Exclusão');
    setIsConfirmationOpen(false);
  };

  return (
    <div>
      <button onClick={handleDeleteSelected}>Excluir Selecionados</button>

      {isConfirmationOpen && (
        <div>
          <p>Tem certeza de que deseja excluir os jogos selecionados?</p>
          <button onClick={handleConfirmDelete}>Confirmar</button>
          <button onClick={handleCancelDelete}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default DeleteSelectedGames;