import React, { useState } from 'react';

const ToggleButton = ({ onClick, isOpen }) => {

    return (
        <div>
            <button className={`toggle-button ${isOpen ? 'open' : ''}`} onClick={onClick}>
                <i className="icon bi bi-person-circle" />
            </button>
            {/* {isSidebarOpen && <div className="backdrop-sidebar" onClick={closeSidebar}></div>} */}
        </div>
    );
};

export default ToggleButton;
