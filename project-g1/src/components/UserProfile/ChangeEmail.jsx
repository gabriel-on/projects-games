import React, { useState } from 'react';

const ChangeEmail = ({ user }) => {
  const [newEmail, setNewEmail] = useState('');

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleUpdateEmail = () => {
    // Adicione a lógica para atualizar o e-mail conforme necessário
  };

  return (
    <div>
      <label htmlFor="newEmail">Novo E-mail:</label>
      <input
        type="email"
        id="newEmail"
        value={newEmail}
        onChange={handleEmailChange}
      />
      <button onClick={handleUpdateEmail}>Atualizar E-mail</button>
    </div>
  );
};

export default ChangeEmail;
