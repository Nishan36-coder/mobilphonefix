import React, { useState } from 'react';
import { Search } from 'lucide-react';
import EditableText from './EditableText';
import { useLanguage } from '../context/LanguageContext';

const Hero = ({ onSearch }) => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(null, input.trim());
    }
  };

  return (
    <section className="hero">
      <div className="container">
        <h1 className="hero-title">
          <EditableText id="heroTitle">{t('hero_title')}</EditableText>
        </h1>
        <p className="hero-subtitle">
          <EditableText id="heroSubtitle">{t('hero_subtitle')}</EditableText>
        </p>

        <div className="booking-search">
          <form className="search-container" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={t('hero_search_placeholder')}
              className="search-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="search-btn">{t('hero_search_btn')}</button>
          </form>
          <div className="quick-categories">
            <span>{t('hero_browse')}</span>
            <button className="category-tag-btn" onClick={() => onSearch('smartphone')}>{t('cat_smartphone')}</button>
            <button className="category-tag-btn" onClick={() => onSearch('tablet')}>{t('cat_tablet')}</button>
            <button className="category-tag-btn" onClick={() => onSearch('find_model')}>{t('cat_find_model')}</button>
            <button className="category-tag-btn" onClick={() => onSearch('laptop')}>{t('cat_laptop')}</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
