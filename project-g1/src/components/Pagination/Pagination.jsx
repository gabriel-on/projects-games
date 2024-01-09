import React, { useEffect, useRef } from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        const MAX_PAGES_DISPLAYED = 5;

        let startPage = Math.max(1, currentPage - Math.floor(MAX_PAGES_DISPLAYED / 2));
        let endPage = Math.min(totalPages, startPage + MAX_PAGES_DISPLAYED - 1);

        if (endPage - startPage + 1 < MAX_PAGES_DISPLAYED) {
            startPage = Math.max(1, endPage - MAX_PAGES_DISPLAYED + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const isMounted = useRef(true);

    useEffect(() => {
        // Recuperar a página atual do localStorage ao montar o componente
        const storedPage = localStorage.getItem('currentPage');
        if (storedPage && isMounted.current) {
            onPageChange(parseInt(storedPage));
            console.log('Página atual recuperada do localStorage:', storedPage);
            isMounted.current = false; // Defina para falso após a primeira execução
        }
    }, [onPageChange]);

    // Efeito para armazenar a página atual no localStorage sempre que ela for alterada
    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    return (
        <div>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                Anterior
            </button>
            {getPageNumbers().map((page) => (
                <button key={page} onClick={() => onPageChange(page)} disabled={page === currentPage}>
                    {page}
                </button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Próximo
            </button>
            <span>
                Página {currentPage} de {totalPages}
            </span>
        </div>
    );
};

export default Pagination;