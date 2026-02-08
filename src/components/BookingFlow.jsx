import React, { useState, useEffect } from 'react';
import {
  Smartphone, Tablet, Watch, Laptop,
  Phone, ArrowLeft, CheckCircle2, Search, Send, Clock, Info, Mail, MessageSquare, HelpCircle, ChevronRight, User, MapPin, Calendar
} from 'lucide-react';
import { CATEGORIES, BRANDS as FallbackBrands } from '../data/repairData';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';
import { Plus, X } from 'lucide-react';
import { sendInquirySMS, sendAppointmentEmailViaBackend } from '../services/submissionService';

const BookingFlow = ({ initialCategory, initialSearch, onReset }) => {
  const { t } = useLanguage();
  const { repairData, addBrand, deleteBrand, addModel, deleteModel, addRepairAction, deleteRepairAction, editMode, getAvailableTimeSlots } = useAdmin();

  // Robustly handle data source per category
  const getBrandsForCategory = (cat) => {
    const contextList = repairData?.brands?.[cat];
    // If context has data, use it. Otherwise fallback to static data.
    if (contextList && Array.isArray(contextList) && contextList.length > 0) {
      return contextList;
    }
    return FallbackBrands[cat] || [];
  };

  const MODELS = repairData?.models || {};
  const REPAIRS = repairData?.repairs || [];

  const [step, setStep] = useState(1);
  const [identifyTab, setIdentifyTab] = useState('ios'); // 'ios' or 'android'
  const [newBrandName, setNewBrandName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [newRepairName, setNewRepairName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [requestType, setRequestType] = useState('inquiry'); // 'inquiry' or 'appointment'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selection, setSelection] = useState({
    category: '',
    brand: '',
    model: '',
    repair: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    date: '',
    time: '9:00 AM - 11:00 AM'
  });

  useEffect(() => {
    if (initialCategory) {
      const isSearchMode = !!initialSearch;

      setSelection(prev => ({
        ...prev,
        category: initialCategory,
        // Reset fields but keep search if present
        brand: '',
        model: '',
        repair: ''
      }));
      setSearchTerm(initialSearch || '');

      // If user searched, aim for Model Selection (Step 3) if possible, or Brand (Step 2)
      // The user requested: "take them directly to the select model option"
      if (isSearchMode) {
        setStep(3); // Jump to Model Selection
        // potentially need to set a default brand if step 3 requires it, 
        // but step 3 in this code lists models based on brand. 
        // If brand is empty, step 3 might show nothing or all models?
        // Let's check step 3 logic. It filters models based on selection.brand.
        // If selection.brand is empty, we must ensure Step 3 handles it or we default to a "Search All Models" view.
        // For now, let's assume valid search flow involves picking a brand first in standard flow, 
        // but to support "Search for iPhone 13", we might need to be smarter.
        // IF we force Step 3, we need a brand. 
        // Let's stick to user request: "select model option". 
        // If I search "iPhone", I want to see iPhone models. 
        // This implies we should defaulting brand to "Apple" if search contains "iPhone"?
        // Or we can modify Step 3 to show ALL models if brand is empty?
        // Let's just set Step 2 (Brand) for general search, OR Step 3 if we can guess brand.

        // REVISION based on user request "take directly to select model option":
        // We will set Brand to "Apple" and Step 3 if search is "iPhone". 
        // Otherwise, we default to Step 2 so they pick a brand.
        // Actually, let's try to be generic: 
        if (initialSearch && initialSearch.toLowerCase().includes('iphone')) {
          setSelection(prev => ({ ...prev, category: 'smartphone', brand: 'Apple', model: '' }));
          setStep(3);
        } else if (initialSearch && initialSearch.toLowerCase().includes('samsung')) {
          setSelection(prev => ({ ...prev, category: 'smartphone', brand: 'Samsung', model: '' }));
          setStep(3);
        } else {
          setStep(2); // Fallback to brand selection if we can't guess
        }
      } else {
        setStep(2);
      }
    }
  }, [initialCategory, initialSearch]);

  const handleReset = () => {
    // 1. Reset Internal State
    setStep(1);
    setSearchTerm('');
    setSelection({
      category: '',
      brand: '',
      model: '',
      repair: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      date: '',
      time: '9:00 AM - 11:00 AM'
    });
    setIdentifyTab('ios');
    setIsSubmitting(false);

    // 2. Notify Parent
    if (onReset) {
      onReset();
    }

    // 3. Scroll to top (optional, but good UX)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => {
    if (step === 1) return;
    setStep(step - 1);
  };

  // Validation and Submission
  const handleSubmit = async (type) => {
    // Validation
    if (type === 'inquiry') {
      if (!selection.name || !selection.phone) {
        alert('Please fill in your name and phone number for the inquiry.');
        return;
      }
    } else {
      if (!selection.name || !selection.phone || !selection.address || !selection.date || !selection.time) {
        alert('Please fill in your name, phone, address, preferred date, and time for the appointment.');
        return;
      }
    }

    setIsSubmitting(true);
    setRequestType(type);

    try {
      if (type === 'inquiry') {
        // Send inquiry via SMS to +1 (227) 259-7780
        const inquiryData = {
          name: selection.name,
          phone: selection.phone,
          email: selection.email,
          brand: selection.brand,
          model: selection.model,
          repair: selection.repair
        };

        await sendInquirySMS(inquiryData);
        console.log('✅ Inquiry SMS sent successfully to +1 (227) 259-7780');
      } else {
        // Send appointment via email to mobilphonefix@gmail.com
        const appointmentData = {
          name: selection.name,
          phone: selection.phone,
          email: selection.email,
          address: selection.address,
          date: selection.date,
          time: selection.time,
          brand: selection.brand,
          model: selection.model,
          repair: selection.repair
        };

        await sendAppointmentEmailViaBackend(appointmentData);
        console.log('✅ Appointment email sent successfully to mobilphonefix@gmail.com');
      }

      setIsSubmitting(false);
      handleNext();
    } catch (error) {
      console.error('❌ Error submitting request:', error);
      setIsSubmitting(false);
      alert(`There was an error submitting your ${type}: ${error.message}\n\nPlease try again or contact us directly at +1 (227) 259-7780.`);
    }
  };

  // Handle Reset - Return to home


  const filteredBrands = selection.category
    ? (getBrandsForCategory(selection.category).filter(b => b.toLowerCase().includes(searchTerm.toLowerCase())))
    : [];

  const icons = {
    smartphone: <Smartphone size={48} />,
    tablet: <Tablet size={48} />,
    find_model: (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Smartphone size={48} />
        <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--accent)', borderRadius: '50%', padding: 4, color: 'white' }}>
          <HelpCircle size={20} />
        </div>
      </div>
    ),
    laptop: <Laptop size={48} />
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-fade">
            <h3>{t('step_category')}</h3>
            <div className="category-grid">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  className={`category-card ${selection.category === c.id ? 'active' : ''}`}
                  onClick={() => {
                    if (c.id === 'find_model') {
                      setSelection({ ...selection, category: 'smartphone', brand: '', model: '' });
                      setStep(10); // Special step for Identify Device
                    } else {
                      setSelection({ ...selection, category: c.id, brand: '', model: '' });
                      setSearchTerm('');
                      handleNext();
                    }
                  }}
                >
                  <div className="icon">{icons[c.id]}</div>
                  <span>{t(`cat_${c.id}`) || c.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-fade">
            <h3>{t('step_brand')}</h3>
            <div className="search-container" style={{ marginBottom: '1.5rem' }}>
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder={t('search_brand_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="search-list">
              {filteredBrands.map(b => (
                <button
                  key={b}
                  className={`list-item ${selection.brand === b ? 'active' : ''}`}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => {
                    setSelection({ ...selection, brand: b, model: '' });
                    setSearchTerm('');
                    handleNext();
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    {b} <ChevronRight size={18} />
                  </span>
                  {editMode && (
                    <button
                      className="admin-delete-btn"
                      onClick={(e) => { e.stopPropagation(); deleteBrand(selection.category, b); }}
                      style={{ marginLeft: '1rem' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </button>
              ))}
              {editMode && (
                <div className="admin-add-item">
                  <input
                    type="text"
                    placeholder="Add new brand..."
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                  />
                  <button className="btn-primary" onClick={() => { addBrand(selection.category, newBrandName); setNewBrandName(''); }}>
                    <Plus size={18} />
                  </button>
                </div>
              )}
            </div>
            <div style={{ marginTop: '2rem' }}>
              <button className="back-link" onClick={handleBack}><ArrowLeft size={16} /> Back</button>
            </div>
          </div>
        );
      case 3:
        // Use repairData for specific models, or empty if models is undefined
        const models = (repairData?.models?.[selection.brand]?.[selection.category]) || [];
        const filteredModels = models.filter(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
        return (
          <div className="step-fade">
            <h3>{t('step_model')}</h3>
            <div className="search-container" style={{ marginBottom: '1.5rem' }}>
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder={t('search_model_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="search-list">
              {filteredModels.map(m => (
                <button
                  key={m}
                  className="list-item"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => {
                    setSelection({ ...selection, model: m });
                    setSearchTerm('');
                    handleNext();
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    {m} <ChevronRight size={18} />
                  </span>
                  {editMode && (
                    <button
                      className="admin-delete-btn"
                      onClick={(e) => { e.stopPropagation(); deleteModel(selection.brand, selection.category, m); }}
                      style={{ marginLeft: '1rem' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </button>
              ))}
              {editMode && (
                <div className="admin-add-item">
                  <input
                    type="text"
                    placeholder="Add new model..."
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                  />
                  <button className="btn-primary" onClick={() => { addModel(selection.brand, selection.category, newModelName); setNewModelName(''); }}>
                    <Plus size={18} />
                  </button>
                </div>
              )}
            </div>
            <div style={{ marginTop: '2rem' }}>
              <button className="back-link" onClick={handleBack}><ArrowLeft size={16} /> Back</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-fade">
            <h3>{t('step_repair')}</h3>
            <div className="search-list repair-list">
              {REPAIRS.map(r => (
                <button
                  key={r.id}
                  className="list-item"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => { setSelection({ ...selection, repair: r.name }); handleNext(); }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <div className="repair-info">
                      <span className="repair-name">{r.name}</span>
                    </div>
                    <ChevronRight size={18} />
                  </span>
                  {editMode && (
                    <button
                      className="admin-delete-btn"
                      onClick={(e) => { e.stopPropagation(); deleteRepairAction(r.id); }}
                      style={{ marginLeft: '1rem' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </button>
              ))}
              {editMode && (
                <div className="admin-add-item">
                  <input
                    type="text"
                    placeholder="Add new repair..."
                    value={newRepairName}
                    onChange={(e) => setNewRepairName(e.target.value)}
                  />
                  <button className="btn-primary" onClick={() => { addRepairAction(newRepairName); setNewRepairName(''); }}>
                    <Plus size={18} />
                  </button>
                </div>
              )}
            </div>
            <div style={{ marginTop: '2rem' }}>
              <button className="back-link" onClick={handleBack}><ArrowLeft size={16} /> Back</button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="step-fade finalize-step">
            <h3>{t('step_finalize')}</h3>

            <div style={{ background: 'var(--accent-light)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--accent-dark)', fontWeight: '500', textAlign: 'center' }}>
              <p>{t('form_note_text')} <strong>+1 (227) 259-7780</strong></p>
            </div>

            <div className="finalize-dual-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              {/* Box 1: Just Inquiry */}
              <div className="form-box inquiry-box" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: '#4a5568' }}>
                  <MessageSquare size={24} className="text-accent" />
                  <h4 style={{ margin: 0 }}>{t('form_inquiry_title')}</h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '1.5rem' }}>{t('form_inquiry_desc')}</p>

                <div className="input-group">
                  <label><User size={14} /> {t('label_name')}</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={selection.name}
                    onChange={(e) => setSelection({ ...selection, name: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label><Phone size={14} /> {t('label_phone')}</label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={selection.phone}
                    onChange={(e) => setSelection({ ...selection, phone: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label><Mail size={14} /> {t('label_email')}</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={selection.email}
                    onChange={(e) => setSelection({ ...selection, email: e.target.value })}
                  />
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                  <button
                    className="btn-primary"
                    disabled={isSubmitting}
                    style={{ background: '#4A5568', borderColor: '#4A5568', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                    onClick={() => handleSubmit('inquiry')}
                  >
                    <Send size={18} /> {isSubmitting && requestType === 'inquiry' ? t('btn_sending') : t('btn_send_inquiry')}
                  </button>
                </div>
              </div>

              {/* Box 2: Book Appointment */}
              <div className="form-box appointment-box" style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '2px solid var(--accent)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <Clock size={24} className="text-accent" />
                  <h4 style={{ margin: 0 }}>{t('form_book_title')}</h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '1.5rem' }}>{t('form_book_desc')}</p>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  {/* We repeat Name/Phone/Email here for clarity as its a separate 'box' */}
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label><User size={14} /> {t('label_name')}</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={selection.name}
                      onChange={(e) => setSelection({ ...selection, name: e.target.value })}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label><Phone size={14} /> {t('label_phone')}</label>
                    <input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={selection.phone}
                      onChange={(e) => setSelection({ ...selection, phone: e.target.value })}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label><MapPin size={14} /> {t('label_address')}</label>
                    <input
                      type="text"
                      placeholder="Street, City, Zip Code"
                      value={selection.address}
                      onChange={(e) => setSelection({ ...selection, address: e.target.value })}
                    />
                  </div>

                  <div className="datetime-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label><Calendar size={14} /> {t('label_date')}</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={selection.date}
                        onChange={(e) => setSelection({ ...selection, date: e.target.value, time: '' })}
                      />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>{t('label_time')}</label>
                      <select
                        style={{ height: '38px' }}
                        value={selection.time}
                        onChange={(e) => setSelection({ ...selection, time: e.target.value })}
                        disabled={!selection.date}
                      >
                        <option value="">Select Time</option>
                        {selection.date && getAvailableTimeSlots(selection.date).map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="availability-note" style={{ background: '#f7fafc', padding: '0.6rem', borderRadius: '0.4rem', display: 'flex', gap: '0.4rem', marginTop: '1rem', fontSize: '0.75rem', color: '#4a5568', border: '1px solid #e2e8f0' }}>
                  <Info size={14} className="text-accent" style={{ flexShrink: 0 }} />
                  <p style={{ margin: 0 }}>{t('note_availability')}</p>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <button
                    className="btn-primary"
                    disabled={isSubmitting}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                    onClick={() => handleSubmit('appointment')}
                  >
                    <Clock size={18} /> {isSubmitting && requestType === 'appointment' ? t('btn_booking') : t('btn_book')}
                  </button>
                </div>
              </div>
            </div>

            <div className="summary-horizontal" style={{ background: '#f8fafc', padding: '1rem 1.5rem', borderRadius: '0.5rem', border: '1px dashed #cbd5e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ fontSize: '0.9rem' }}><strong style={{ color: '#718096' }}>{t('summary_device')}</strong> {selection.brand} {selection.model}</div>
                <div style={{ fontSize: '0.9rem' }}><strong style={{ color: '#718096' }}>{t('summary_repair')}</strong> {selection.repair}</div>
              </div>
              <div style={{ color: '#48bb78', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} /> {t('guarantee_text')}
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button className="back-link" onClick={handleBack}><ArrowLeft size={16} /> {t('btn_change_selection')}</button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="step-fade success-step" style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className="success-icon" style={{ color: '#48bb78', marginBottom: '2rem' }}><CheckCircle2 size={64} /></div>
            <h2>{requestType === 'inquiry' ? t('success_inquiry_title') : t('success_book_title')}</h2>
            <p style={{ color: '#718096', marginBottom: '0.5rem' }}>
              {requestType === 'inquiry'
                ? t('success_inquiry_msg')
                : t('success_book_msg', { name: selection.name })}
            </p>
            <p className="success-note" style={{ fontWeight: '600', marginBottom: '3rem' }}>
              {t('success_forward_msg')} <strong>+1 (227) 259-7780</strong>. {t('success_contact_msg', { phone: selection.phone })}
            </p>
            <button className="btn-primary" onClick={handleReset}>{t('btn_back_home')}</button>
          </div>
        );
      case 10: // Identify Device Step
        return (
          <div className="step-fade" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>{t('identify_title')}</h3>

              <div className="tab-switcher" style={{ display: 'inline-flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '2rem', marginBottom: '2rem' }}>
                <button
                  onClick={() => setIdentifyTab('ios')}
                  style={{
                    padding: '0.5rem 1.5rem',
                    borderRadius: '1.5rem',
                    border: 'none',
                    background: identifyTab === 'ios' ? 'white' : 'transparent',
                    color: identifyTab === 'ios' ? 'var(--text-main)' : 'var(--text-light)',
                    fontWeight: identifyTab === 'ios' ? '600' : '400',
                    boxShadow: identifyTab === 'ios' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {t('identify_tab_ios')}
                </button>
                <button
                  onClick={() => setIdentifyTab('android')}
                  style={{
                    padding: '0.5rem 1.5rem',
                    borderRadius: '1.5rem',
                    border: 'none',
                    background: identifyTab === 'android' ? 'white' : 'transparent',
                    color: identifyTab === 'android' ? 'var(--text-main)' : 'var(--text-light)',
                    fontWeight: identifyTab === 'android' ? '600' : '400',
                    boxShadow: identifyTab === 'android' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {t('identify_tab_android')}
                </button>
              </div>
            </div>

            <div className="instruction-grid" style={{ display: 'grid', gap: '2rem' }}>
              {identifyTab === 'ios' ? (
                <>
                  <div className="instruction-step" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>STEP 1</h4>
                      <p>{t('identify_ios_step1')}</p>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      <img src="/instructions/ios_step1.png" alt="iOS Settings" style={{ borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', maxWidth: '200px' }} />
                    </div>
                  </div>
                  <div className="instruction-step" style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexDirection: 'row-reverse' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>STEP 2</h4>
                      <p>{t('identify_ios_step2')}</p>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      <img src="/instructions/ios_step2.png" alt="iOS General About" style={{ borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', maxWidth: '200px' }} />
                    </div>
                  </div>
                  <div className="instruction-step" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>STEP 3</h4>
                      <p>{t('identify_ios_step3')}</p>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      <img src="/instructions/ios_step3.png" alt="iOS Model Name" style={{ borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', maxWidth: '200px' }} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="instruction-step" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>STEP 1</h4>
                      <p>{t('identify_android_step1')}</p>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      <img src="/instructions/android_step1.png" alt="Android Settings" style={{ borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', maxWidth: '200px' }} />
                    </div>
                  </div>
                  <div className="instruction-step" style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexDirection: 'row-reverse' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>STEP 2</h4>
                      <p>{t('identify_android_step2')}</p>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      <img src="/instructions/android_step2.png" alt="Android About Phone" style={{ borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', maxWidth: '200px' }} />
                    </div>
                  </div>
                  <div className="instruction-step" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>STEP 3</h4>
                      <p>{t('identify_android_step3')}</p>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      <img src="/instructions/android_step3.png" alt="Android Model Detail" style={{ borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', maxWidth: '200px' }} />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="back-link" onClick={() => setStep(1)}><ArrowLeft size={16} /> {t('btn_back_categories')}</button>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  className="btn-outline"
                  onClick={() => {
                    // Continue based on tab
                    if (identifyTab === 'ios') {
                      setSelection({ ...selection, category: 'smartphone', brand: 'Apple', model: '' });
                      setStep(3); // Go to iPhone Models
                    } else {
                      setSelection({ ...selection, category: 'smartphone', brand: '', model: '' });
                      setStep(2); // Go to Brand Selection (Android)
                    }
                  }}
                >
                  {t('btn_found_model')}
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    // Default to brand selection for manual search if they can't find it
                    setSelection({ ...selection, category: 'smartphone', brand: '', model: '' });
                    setStep(2);
                  }}
                >
                  {t('btn_search_model')}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="booking-container bg-white">
      <div className="container">
        <div className="stepper">
          {[1, 2, 3, 4, 5].map((s) => (
            <React.Fragment key={s}>
              <div className={`step-dot ${step >= s ? 'active' : ''}`}>{s}</div>
              {s < 5 && <div className={`step-line ${step >= s + 1 ? 'active' : ''}`}></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="booking-content">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
