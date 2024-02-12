// LocalStorageService.js

// Chave para armazenar os filtros no localStorage
const LOCAL_STORAGE_KEY = 'advanced_search_filters';

// Função para salvar os filtros no localStorage
export const saveFiltersToLocalStorage = (filters) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filters));
};

// Função para carregar os filtros do localStorage
export const loadFiltersFromLocalStorage = () => {
    const filtersJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    return filtersJson ? JSON.parse(filtersJson) : null;
};

// Função para limpar os filtros do localStorage
export const clearLocalStorageFilters = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};
