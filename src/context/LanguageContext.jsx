import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

import { translations } from '../data/translations';

// Helper for interpolation
const formatString = (str, params) => {
    if (!params) return str;
    return Object.keys(params).reduce((acc, key) => {
        return acc.replace(new RegExp(`{${key}}`, 'g'), params[key]);
    }, str);
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // 'en' or 'es'

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'es' : 'en');
    };

    const t = (key, params) => {
        if (!translations[language]) return key;
        const str = translations[language][key] || key;
        return formatString(str, params);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
