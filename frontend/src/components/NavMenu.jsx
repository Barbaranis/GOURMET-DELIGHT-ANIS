// src/components/NavMenu.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../Style/NavMenu.css';
import { useAuth } from '../context/AuthContext';

const NavMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Source de vérité : contexte
  const { user, logout } = useAuth();
  const isAuth = !!user;
  const role = user?.role || localStorage.getItem('role') || null;

  // Fermer le menu quand la route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const toggleMenu = () => setMenuOpen((s) => !s);

  const handleLogout = async () => {
    try { await logout(); } catch {}
    navigate('/login');
  };

  // Destination pour "Compte"
  const accountPath =
    role === 'admin' || role === 'chef_cuisine' ? '/admin/dashboard' : '/compte';

  return (
    <>
      {/* Bouton burger (caché si menu ouvert) */}
      <button
        className={`menu-toggle ${menuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={menuOpen}
        aria-controls="navigation-mobile"
        style={{ display: menuOpen ? 'none' : 'flex' }}
      >
        <span></span><span></span><span></span>
      </button>

      {/* Navigation mobile */}
      <nav
        id="navigation-mobile"
        className={`nav-menu ${menuOpen ? 'show' : ''}`}
        aria-hidden={!menuOpen}
        aria-label="Menu mobile"
      >
        <button className="close-btn" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu">×</button>

        <Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
        <Link to="/menu" onClick={() => setMenuOpen(false)}>Menu</Link>
        <Link to="/reservation" onClick={() => setMenuOpen(false)}>Reservation</Link>
        <Link to="/chefs" onClick={() => setMenuOpen(false)}>Chefs</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>À propos</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        <Link to="/avis" onClick={() => setMenuOpen(false)}>Témoignages</Link>

        {isAuth ? (
          <>
            <Link to={accountPath} onClick={() => setMenuOpen(false)}>Compte</Link>
            <button className="logout-link" onClick={handleLogout}>Déconnexion</button>
          </>
        ) : (
          <Link to="/login" onClick={() => setMenuOpen(false)}>Connexion</Link>
        )}
      </nav>

      {/* Navigation desktop */}
      <nav className="nav-desktop" aria-label="Navigation principale">
        <Link to="/">Accueil</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/reservation">Reservation</Link>
        <Link to="/chefs">Chefs</Link>
        <Link to="/about">À propos</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/avis">Témoignages</Link>

        {isAuth ? (
          <>
            <Link to={accountPath}>Compte</Link>
            <button className="logout-link" onClick={handleLogout}>Déconnexion</button>
          </>
        ) : (
          <Link to="/login">Connexion</Link>
        )}
      </nav>
    </>
  );
};

export default NavMenu;

