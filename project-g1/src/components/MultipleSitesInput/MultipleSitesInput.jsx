// MultipleSitesInput.js

import React from 'react';

function MultipleSitesInput({ value, onChange, name, error }) {
  // Ensure that value is an array
  const sites = Array.isArray(value) ? value : [];

  // Função para atualizar a lista de sites ao modificar a entrada
  const handleInputChange = (e, index) => {
    const newValue = sites.map((site, i) => (i === index ? { ...site, [e.target.name]: e.target.value } : site));
    onChange({ target: { name, value: newValue } });
  };

  return (
    <div className='field'>
      <label>
        Site(s) Oficial(is) (Opcional):
        {sites.map((site, index) => (
          <div key={index}>
            <input
              type="text"
              name="name" // Add name attribute for the name input
              placeholder="Nome do site"
              value={site.name || ''}
              onChange={(e) => handleInputChange(e, index)}
            />
            <input
              type="text"
              name="link" // Add name attribute for the link input
              placeholder="Link do site"
              value={site.link || ''}
              onChange={(e) => handleInputChange(e, index)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange({ target: { name, value: [...sites, {}] } })}
        >
          Adicionar Site
        </button>
        {error && <p className="error-message">{error}</p>}
      </label>
    </div>
  );
}

export default MultipleSitesInput;
