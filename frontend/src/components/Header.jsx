// src/components/Header.jsx
import React from 'react';
import '../Style/Header.css';
import logo from '../assets/logo.jpg';
import NavMenu from './NavMenu';


const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <img src={logo} alt="Logo Gourmet Delight" className="logo" />
        </div>
        <NavMenu />
      </div>
    </header>
  );
};


export default Header;

