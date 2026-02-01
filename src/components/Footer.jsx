import React from 'react';
import { Smartphone, Tablet, Watch, Laptop, Instagram, Facebook, Youtube } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

import { useLanguage } from '../context/LanguageContext';

const Footer = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { toggleAdmin } = useAdmin();
  const clickCount = React.useRef(0);

  const handleSecretTrigger = () => {
    clickCount.current++;
    console.log(`🔐 Admin click ${clickCount.current}/3`);

    if (clickCount.current >= 3) {
      console.log('🎯 Triggering password prompt...');
      clickCount.current = 0;

      // Use setTimeout to ensure prompt appears after click event
      setTimeout(() => {
        const password = prompt('Please enter admin password:');
        console.log('Password entered:', password ? '***' : 'cancelled');

        if (password === 'January17') {
          toggleAdmin();
          console.log('✅ Admin mode activated!');
        } else if (password) {
          alert('Incorrect password');
          console.log('❌ Wrong password');
        }
      }, 100);
    }

    if (window.adminTriggerTimeout) clearTimeout(window.adminTriggerTimeout);
    window.adminTriggerTimeout = setTimeout(() => {
      clickCount.current = 0;
      console.log('⏱️ Click counter reset');
    }, 2000);
  };

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h2 className="footer-logo">Mobilphonefix</h2>
          <p className="footer-tagline">{t('footer_tagline')}</p>

          <div className="social-icons">
            <a href="https://www.instagram.com/mr.techniician?igsh=enp5YnZ2ZXJtOGow&utm_source=qr" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
              <Instagram size={24} />
            </a>
            <a href="https://www.facebook.com/share/1DqaSVcuKm/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
              <Facebook size={24} />
            </a>
            <a href="https://youtube.com/@mr.techniician?si=fNZWrrK4aKEffXfX" target="_blank" rel="noopener noreferrer" className="social-icon youtube">
              <Youtube size={24} />
            </a>
          </div>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h4>{t('footer_quick_links')}</h4>
            <ul>
              <li><button className="btn-text" onClick={() => onNavigate(null)}>{t('footer_book_now')}</button></li>
              <li><a href="#services">{t('nav_services')}</a></li>
              <li><a href="#how-it-works">{t('nav_how_it_works')}</a></li>
            </ul>
          </div>
          <div className="link-group">
            <h4>{t('footer_services')}</h4>
            <ul>
              <li><button className="btn-text" onClick={() => onNavigate('smartphone')}><Smartphone size={14} /> {t('cat_smartphone')}</button></li>
              <li><button className="btn-text" onClick={() => onNavigate('tablet')}><Tablet size={14} /> {t('cat_tablet')}</button></li>
              <li><button className="btn-text" onClick={() => onNavigate('find_model')}><Watch size={14} /> {t('cat_find_model')}</button></li>
              <li><button className="btn-text" onClick={() => onNavigate('laptop')}><Laptop size={14} /> {t('cat_laptop')}</button></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="footer-bottom" onClick={handleSecretTrigger}>
          <p>&copy; {new Date().getFullYear()} Mobilphonefix. {t('footer_rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
