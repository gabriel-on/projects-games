import React from 'react';

function EditGameLanguageList({
  lists,
  showAllLanguages,
  setShowAllLanguages,
  game,
  handleChange,
  errors,
}) {
  const MAX_OPTIONS_DISPLAYED = 12;

  const handleCheckboxChange = (e) => {
    handleChange(e);
  };

  const handleSelectChange = (e) => {
    handleChange(e);
  };

  const convertYesNoToBoolean = (value) => {
    return value === 'true';
  };

  return (
    <div className='field'>
      <p>Idiomas Suportados:</p>
      <div className='languages-list'>
        {lists.supportedLanguages.slice(0, showAllLanguages ? lists.supportedLanguages.length : MAX_OPTIONS_DISPLAYED).map((language) => (
          <div key={language} className="language-option">
            <label
              className={`language ${game.supportedLanguages && game.supportedLanguages.includes(language) ? 'checked-language' : ''}`}
            >
              <input
                type="checkbox"
                name="supportedLanguages"
                value={language}
                checked={game.supportedLanguages && game.supportedLanguages.includes(language)}
                onChange={handleCheckboxChange}
              />
              {language}
            </label>
            {game.supportedLanguages && game.supportedLanguages.includes(language) && (
              <div className="language-options">
                <label>
                  Interface:
                  <select
                    name={`interface_${language}`}
                    onChange={handleSelectChange}
                    value={convertYesNoToBoolean(game[`interface_${language}`])}
                  >
                    <option value={''}>Nenhum</option>
                    <option value={'true'}>Sim</option>
                    <option value={'false'}>Não</option>
                  </select>
                </label>
                <label>
                  Dublagem:
                  <select
                    name={`dubbing_${language}`}
                    onChange={handleSelectChange}
                    value={convertYesNoToBoolean(game[`dubbing_${language}`])}
                  >
                    <option value={''}>Nenhum</option>
                    <option value={'true'}>Sim</option>
                    <option value={'false'}>Não</option>
                  </select>
                </label>
                <label>
                  Dublagem:
                  <select
                    name={`
                    subtitles_${language}`}
                    onChange={handleSelectChange}
                    value={convertYesNoToBoolean(game[`subtitles_${language}`])}
                  >
                    <option value={''}>Nenhum</option>
                    <option value={'true'}>Sim</option>
                    <option value={'false'}>Não</option>
                  </select>
                </label>
              </div>
            )}
          </div>
        ))}
        {errors.supportedLanguages && <p className="error-message">{errors.supportedLanguages}</p>}
      </div>
      {lists.supportedLanguages.length > MAX_OPTIONS_DISPLAYED && !showAllLanguages && (
        <button className="show-more-options" onClick={() => setShowAllLanguages(true)}>
          Mostrar Tudo
        </button>
      )}
    </div>
  );
}

export default EditGameLanguageList;
