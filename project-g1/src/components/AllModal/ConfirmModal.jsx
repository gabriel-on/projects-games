import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
    return (
        isOpen && (
            <div className="modal-container">
                <div className="backdrop" onClick={onClose}></div>
                <div className='modal'>
                    <div className="modal-content">
                        <p>{message}</p>
                        <button onClick={onConfirm}>Confirmar</button>
                        <button onClick={onClose}>Cancelar</button>
                    </div>
                </div>
            </div>
        )
    );
};

export default ConfirmModal;
