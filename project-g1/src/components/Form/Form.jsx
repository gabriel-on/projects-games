import React, { useState } from 'react';
import PropTypes from 'prop-types';

import '../Form/Form.css';

function Form({ initialValues = {}, onSubmit, onDelete, title, textButton }) {
  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    image: initialValues.image || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className="form-container">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit}>
        {/* ... Campos do formulário ... */}
        <button type="submit">{textButton}</button>
        {onDelete && (
          <button type="button" onClick={handleDelete} className="delete-button">
            Excluir Item
          </button>
        )}
      </form>
    </div>
  );
}

Form.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  title: PropTypes.string.isRequired,
  textButton: PropTypes.string.isRequired,
};

export default Form;