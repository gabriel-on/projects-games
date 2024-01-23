import React from 'react';

function AddGameLanguageList({
    languages,
    selectedLanguages,
    onChange,
    showAllLanguages,
    onShowAllLanguagesClick,
    errors,
}) {
    const MAX_OPTIONS_DISPLAYED = 12;

    const handleCheckboxChange = (e) => {
        const { name, value } = e.target;
        console.log('Checkbox Change:', name, value);
        onChange(e);
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        console.log('Select Change:', name, value);
        onChange(e);
    };

    return (
        <div className='field'>
            <p>Idiomas Suportados:</p>
            <div className='languages-list'>
                {languages.slice(0, showAllLanguages ? languages.length : MAX_OPTIONS_DISPLAYED).map((language) => (
                    <div key={language} className="language-option">
                        <label
                            className={`language ${selectedLanguages.includes(language) ? 'checked-language' : ''}`}
                        >
                            <input
                                type="checkbox"
                                name="supportedLanguages"
                                value={language}
                                checked={selectedLanguages.includes(language)}
                                onChange={handleCheckboxChange}
                            />
                            {language}
                        </label>
                        {selectedLanguages.includes(language) && (
                            <div className="language-options">
                                <label>
                                    Interface:
                                    <select
                                        name={`interface_${language}`}
                                        onChange={handleSelectChange}
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
                                    >
                                        <option value={''}>Nenhum</option>
                                        <option value={'true'}>Sim</option>
                                        <option value={'false'}>Não</option>
                                    </select>
                                </label>
                                <label>
                                    Legendas:
                                    <select
                                        name={`subtitles_${language}`}
                                        onChange={handleSelectChange}
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
            {languages.length > MAX_OPTIONS_DISPLAYED && !showAllLanguages && (
                <button className="show-more-options" onClick={onShowAllLanguagesClick}>
                    Mostrar Tudo
                </button>
            )}
        </div>
    );
}

export default AddGameLanguageList;
