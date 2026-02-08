import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { USFlag, SpainFlag } from './FlagIcons';

const Header = ({ onNavigate }) => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="header">
      <div className="container header-content">
        <div className="header-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="Mobilphonefix" className="header-logo-img" />
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
          <a href="#services" style={{ textDecoration: 'none', fontWeight: '500' }}>{t('nav_services')}</a>
          <a href="#how-it-works" style={{ textDecoration: 'none', fontWeight: '500', scrollBehavior: 'smooth' }}>{t('nav_how_it_works')}</a>
          <a href="#booking" style={{ textDecoration: 'none', fontWeight: '500' }}>{t('nav_book')}</a>
        </div>
        <div className="header-info">
          <span className="availability">{t('header_availability')}</span>
          <button
            onClick={toggleLanguage}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '50%',
              transition: 'transform 0.2s',
              marginRight: '0.5rem'
            }}
            title={language === 'en' ? "Switch to Spanish" : "Switch to English"}
          >
            {language === 'en' ? <USFlag size={32} /> : <SpainFlag size={32} />}
          </button>
          <a href="tel:+12272597780" className="btn-primary phone-btn">{t('btn_call')}</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
