import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ userId, user, isAdmin, logout, isOpen }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(isOpen);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    setIsSidebarOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handlePopState = () => {
      closeSidebar();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div>
      {isSidebarOpen && <div className="backdrop-sidebar" onClick={closeSidebar}></div>}

      <div className={`sidebar ${isSidebarOpen ? 'show' : ''}`}>
        <ul className="links_list">
          <li>
            <NavLink to="/" onClick={closeSidebar} className="active">
              <i className="icon bi bi-house-door" /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard" onClick={closeSidebar} className="active">
              <i className="icon bi bi-bar-chart" /> Ranking
            </NavLink>
          </li>
          <li>
            <NavLink to="/profiles" onClick={closeSidebar} className="active">
              <i className="icon bi bi-person" /> Usuários
            </NavLink>
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
            <li>
              <NavLink to={`/profile/${userId}`} onClick={closeSidebar} className="active">
                <i className="icon bi bi-person-circle" /> Perfil
              </NavLink>
            </li>
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
