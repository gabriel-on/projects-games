import React, { useState } from 'react';

function SecondaryImagesInput({ value, onChange, name, error }) {
  const images = Array.isArray(value) ? value : [];

  const handleInputChange = (e, index) => {
    const newValue = images.map((image, i) => (i === index ? { ...image, [e.target.name]: e.target.value } : image));
    onChange({ target: { name, value: newValue } });
  };

  const handleUpdate = (index) => {
    // Implemente a lógica para atualizar a imagem conforme necessário
    const updatedImage = images[index];
    console.log(`Atualizando imagem para o índice ${index}:`, updatedImage);
  };

  return (
    <div className='field'>
      <label>
        Fotos (Opcional):
        {images.map((image, index) => (
          <div key={index}>
            <input
              type="text"
              name="link"
              placeholder="Link da foto"
              value={image.link || ''}
              onChange={(e) => handleInputChange(e, index)}
            />
            <button
              type="button"
              onClick={() => handleUpdate(index)}
            >
              Atualizar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange({ target: { name, value: [...images, {}] } })}
        >
          Adicionar Foto
        </button>
        {error && <p className="error-message">{error}</p>}
      </label>
    </div>
  );
}

export default SecondaryImagesInput;