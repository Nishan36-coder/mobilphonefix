import React from 'react';
import EditableText from './EditableText';
import { useLanguage } from '../context/LanguageContext';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: t('hiw_step1_title'),
      desc: t('hiw_step1_desc')
    },
    {
      title: t('hiw_step2_title'),
      desc: t('hiw_step2_desc')
    },
    {
      title: t('hiw_step3_title'),
      desc: t('hiw_step3_desc')
    },
  ];

  return (
    <section className="how-it-works">
      <div className="container">
        <div className="section-header" style={{ color: 'white', textAlign: 'center', marginBottom: '5rem' }}>
          <EditableText id="howItWorksTitle" tag="h2" className="section-title">{t('hiw_title')}</EditableText>
        </div>

        <div className="steps-container">
          {steps.map((step, i) => (
            <div key={i} className="step-item">
              <div className="step-number">{i + 1}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="about-summary" style={{ textAlign: 'center', marginTop: '4rem', color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: '800px', margin: '4rem auto 0' }}>
          <p>{t('hiw_summary')}</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
