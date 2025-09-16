
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      setIsDarkMode(true);
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header>
      <div className="container">
        <nav>
          <div className="logo">
            <Link to="/">Sparx 2025</Link>
          </div>
          <div className="nav-desktop">
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/schedule">Schedule</Link></li>
              <li><Link to="/registration">Register</Link></li>
              <li><Link to="/admin">Admin</Link></li>
            </ul>
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
          <div className="nav-mobile">
            <button className="mobile-theme" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu} aria-label={isMobileMenuOpen ? 'Close menu' : 'Menu'} aria-expanded={isMobileMenuOpen} aria-controls="mobileMenu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
        <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}></div>
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`} id="mobileMenu">
          <div className="mobile-menu-header">
            <div className="logo">SPARX</div>
          </div>
          <div className="mobile-menu-content">
            <ul className="mobile-nav-links">
              <li><Link to="/" onClick={toggleMobileMenu}>Home</Link></li>
              <li><Link to="/events" onClick={toggleMobileMenu}>Events</Link></li>
              <li><Link to="/schedule" onClick={toggleMobileMenu}>Schedule</Link></li>
              <li><Link to="/registration" onClick={toggleMobileMenu}>Register</Link></li>
              <li><Link to="/admin" onClick={toggleMobileMenu}>Admin</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
