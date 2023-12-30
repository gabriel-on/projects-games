function DeleteSelectedGames({ onDeleteSelected, selectedGames }) {
  const handleDeleteSelected = () => {
    console.log('Clicado em Excluir Selecionados');
    console.log('Jogos selecionados:', selectedGames);

    onDeleteSelected(selectedGames);
  };

  return (
    <div>
      <button onClick={handleDeleteSelected}>Excluir Selecionados</button>
    </div>
  );
}

export default DeleteSelectedGames;
