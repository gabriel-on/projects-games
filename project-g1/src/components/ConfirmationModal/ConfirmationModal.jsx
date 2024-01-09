import React from 'react';
import '../../ConfirmationModal/ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, userName }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-container">
            <div className="backdrop" onClick={onClose}></div>
            <div className="modal">
                <div className="modal-content">
                    <p>Deseja realmente excluir o usuário, <span className='red-user'>{userName}</span>?</p>
                    <button onClick={onConfirm}>Sim</button>
                    <button onClick={onClose}>Não</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;