import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../Sidebar/Sidebar.css';
import defaultProfileImage from '../../img/perfil.png';

const Sidebar = ({ userId, user, isAdmin, logout, isOpen }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isBackdropVisible, setBackdropVisible] = useState(false);

    const closeSidebar = () => {
        setSidebarOpen(false);
        setBackdropVisible(false);
    };

    useEffect(() => {
        // Lógica adicional, se necessário, quando o estado isSidebarOpen é alterado.
    }, [isSidebarOpen]);

    return (
        <div>
            <button
                className='standard-profile-sidebar'
                onClick={() => {
                    setSidebarOpen(!isSidebarOpen);
                    setBackdropVisible(!isBackdropVisible);
                }}>
                <div>
                    {user && user.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt="Foto de Perfil"
                        />
                    ) : (
                        <img
                            src={defaultProfileImage}
                            alt="Foto de Perfil Padrão"
                        />
                    )}
                </div>
            </button>

            {isBackdropVisible && (
                <div
                    className="backdrop-sidebar"
                    onClick={closeSidebar}
                />
            )}
            <div id='sidebar' className={`sidebar ${isSidebarOpen ? 'show' : ''}`}>
                <button className="close-button" onClick={closeSidebar}>
                    Fechar
                </button>

                <ul className="links_list">
                    <li>
                        <NavLink to="/" onClick={closeSidebar} className="active">
                            <i className="icon bi bi-house-door" /> Home
                        </NavLink>
                    </li>
                    {user && (
                        <ul className="links_list">
                            <li>
                                <NavLink to={`/profile/${userId}`} onClick={closeSidebar} className="active">
                                    <i className="icon bi bi-person-circle" /> Perfil
                                </NavLink>
                            </li>
                        </ul>
                    )}
                    <li>
                        <NavLink to="/leaderboard" onClick={closeSidebar} className="active">
                            <i className="icon bi bi-bar-chart" /> Ranking
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/members" onClick={closeSidebar} className="active">
                            <i className="icon bi bi-person" /> Membros
                        </NavLink>
                    </li>
                    {/* <li>
                        <NavLink to="/achievements" onClick={closeSidebar} className="active">
                        <i className="icon bi-award"></i>                            Conquistas
                        </NavLink>
                    </li> */}
                    <li title='Em Breve'>
                        <button className='em-breve' disabled>
                            <i className="icon bi-award"></i>                            Conquistas
                        </button>
                    </li>
                    <li title='Em Breve'>
                        {/* <NavLink to="/community" onClick={closeSidebar} className="active" disabled>
                            <i className="icon bi-chat-left-text" /> Comunidade
                        </NavLink> */}
                        <button className='em-breve' disabled>
                            <i className="icon bi-chat-left-text" /> Comunidade
                        </button>
                    </li>

                    {!user && (
                        <>
                            <li>
                                <NavLink to="/login" onClick={closeSidebar} className={isActive => (isActive ? 'active' : '')}>
                                    Entrar
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/register" onClick={closeSidebar} className={isActive => (isActive ? 'active' : '')}>
                                    Cadastrar
                                </NavLink>
                            </li>
                        </>
                    )}

                </ul>
                {user && (
                    <ul className="links_list">
                        {isAdmin && (
                            <>
                                <li>
                                    <NavLink to="/dashboard" onClick={closeSidebar} className="active" id="md-dash-admin-1">
                                        <i className="icon bi bi-speedometer2" /> Dashboard
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin" onClick={closeSidebar} className="active" id="md-dash-admin-2">
                                        <i className="icon bi bi-shield-shaded" /> Admin
                                    </NavLink>
                                </li>
                            </>
                        )}
                        <li>
                            <NavLink to="/" onClick={logout} className="logout">
                                <i className="icon bi bi-box-arrow-right" /> Sair
                            </NavLink>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Sidebar;