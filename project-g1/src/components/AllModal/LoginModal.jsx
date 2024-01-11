import React from 'react';

const LoginModal = ({ showModal, closeModal }) => {
  return (
    showModal && (
      <div className="modal-container">
        <div className="backdrop" onClick={closeModal}></div>
        <div className="modal">
          <div className="modal-content">
            <p className="red-user">Você precisa estar logado para salvar as alterações.</p>
            <button onClick={closeModal}>Fechar</button>
          </div>
        </div>
      </div>
    )
  );
};

export default LoginModal;
