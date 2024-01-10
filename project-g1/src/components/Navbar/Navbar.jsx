
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthentication';
import { useAuthValue } from '../../context/AuthContext';
import '../Navbar/Navbar.css';
import Sidebar from '../Sidebar/Sidebar';

const Navbar = ({ userId }) => {
  const { logout } = useAuth();
  const { user } = useAuthValue();

  const isAdmin = user && user.isAdmin;

  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
        <h1>Logo</h1>
      </NavLink>
      <ul className="links_list">
        <li>
          <NavLink to="/search">
            <i className="bi bi-search" />
          </NavLink>
        </li>
        <li>
          <Sidebar userId={userId} user={user} isAdmin={isAdmin} logout={logout} isOpen={isSidebarOpen} />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
