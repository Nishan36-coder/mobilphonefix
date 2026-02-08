import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { USFlag, SpainFlag } from './FlagIcons';
import { Menu, X } from 'lucide-react';

const Header = ({ onNavigate }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header">
      <div className="container header-content">
        <div className="header-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="Mobilphonefix" className="header-logo-img" />
        </div>

        {/* Desktop Nav */}
        <div className="nav-links desktop-nav">
          <a href="#services" onClick={() => setIsMenuOpen(false)}>{t('nav_services')}</a>
          <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>{t('nav_how_it_works')}</a>
          <a href="#booking" onClick={() => setIsMenuOpen(false)}>{t('nav_book')}</a>
        </div>

        <div className="header-info">
          <span className="availability">{t('header_availability')}</span>
          <button
            onClick={toggleLanguage}
            className="lang-btn"
            title={language === 'en' ? "Switch to Spanish" : "Switch to English"}
          >
            {language === 'en' ? <USFlag size={32} /> : <SpainFlag size={32} />}
          </button>

          <a href="tel:+12272597780" className="btn-primary phone-btn desktop-phone-btn">{t('btn_call')}</a>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            <a href="#services" onClick={() => setIsMenuOpen(false)}>{t('nav_services')}</a>
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>{t('nav_how_it_works')}</a>
            <a href="#booking" onClick={() => setIsMenuOpen(false)}>{t('nav_book')}</a>
            <div className="mobile-divider"></div>
            <span className="mobile-availability">{t('header_availability')}</span>
            <a href="tel:+12272597780" className="btn-primary phone-btn mobile-phone-btn">{t('btn_call')}</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
