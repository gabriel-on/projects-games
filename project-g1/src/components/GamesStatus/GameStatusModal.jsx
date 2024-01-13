// GameStatusModal.js
import React from 'react';
import GameStatus from './GamesStatus';

const GameStatusModal = ({
    gameId,
    userClassification,
    onClassificationChange,
    onStatusChange,
    onToggleFavorite,
    onSaveChanges,
    onClose
}) => {
    return (
        <div className="modal-container">
            <div className="backdrop" onClick={onClose}></div>
            <div className='modal'>
                <div className="modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    <GameStatus
                        gameId={gameId}
                        userClassification={userClassification}
                        onClassificationChange={onClassificationChange}
                        onStatusChange={onStatusChange}
                        onToggleFavorite={onToggleFavorite}
                        onSaveChanges={onSaveChanges}
                    />
                </div>
            </div>
        </div>
    );
};

export default GameStatusModal;
