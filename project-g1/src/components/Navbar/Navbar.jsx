import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthentication';
import { useAuthValue } from '../../context/AuthContext';
import '../Navbar/Navbar.css';
import Sidebar from '../Sidebar/Sidebar';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const Navbar = ({ userId, toggleTheme, isDarkMode }) => {
  const { logout } = useAuth();
  const { user } = useAuthValue();

  const isAdmin = user && user.isAdmin;

  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
      <div>
        <NavLink to="/" className="brand">
          <h1>Logo</h1>
        </NavLink>
        <ul className="links_list">
          <li className='search-links_list'>
            <NavLink to="/search">
              <i className="bi bi-search" />
            </NavLink>
          </li>
          <li>
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </li>
          <li>
            <Sidebar userId={userId} user={user} isAdmin={isAdmin} logout={logout} isOpen={isSidebarOpen} />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
