import React from 'react';
import { Smartphone, Tablet, Watch, Laptop, CheckCircle, ShieldCheck, Zap, Award, HelpCircle } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

const Services = ({ onSelectCategory }) => {
  const { t } = useLanguage();

  const services = [
    { id: 'smartphone', icon: <Smartphone size={32} />, name: t('cat_smartphone'), desc: t('service_smartphone_desc') },
    { id: 'tablet', icon: <Tablet size={32} />, name: t('cat_tablet'), desc: t('service_tablet_desc') },
    {
      id: 'find_model',
      icon: (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Smartphone size={32} />
          <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--accent)', borderRadius: '50%', padding: 2, color: 'white' }}>
            <HelpCircle size={14} />
          </div>
        </div>
      ),
      name: t('cat_find_model'),
      desc: t('service_find_model_desc')
    },
    { id: 'laptop', icon: <Laptop size={32} />, name: t('cat_laptop'), desc: t('service_laptop_desc') },
  ];

  return (
    <section className="services bg-white">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('services_title')}</h2>
          <p className="section-subtitle">{t('services_subtitle')}</p>
        </div>

        <div className="services-grid">
          {services.map((s) => (
            <div
              key={s.id}
              className="service-card"
              onClick={() => onSelectCategory(s.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="service-icon">{s.icon}</div>
              <h3 className="service-name">{s.name}</h3>
              <p className="service-desc">{s.desc}</p>
              <button className="btn-text" style={{ marginTop: '1rem', color: 'var(--accent)', fontWeight: '600' }}>{t('btn_select')} {s.name}</button>
            </div>
          ))}
        </div>

        <div className="benefits-cards">
          <div className="benefit-card">
            <ShieldCheck className="text-accent" size={40} />
            <h4>{t('benefit_warranty')}</h4>
            <p>{t('benefit_warranty_desc')}</p>
          </div>
          <div className="benefit-card">
            <Award className="text-accent" size={40} />
            <h4>{t('benefit_parts')}</h4>
            <p>{t('benefit_parts_desc')}</p>
          </div>
          <div className="benefit-card">
            <Zap className="text-accent" size={40} />
            <h4>{t('benefit_techs')}</h4>
            <p>{t('benefit_techs_desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
