import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import BookingFlow from './components/BookingFlow'
import Services from './components/Services'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import AdminToolbar from './components/AdminToolbar'
import { AdminProvider, useAdmin } from './context/AdminContext'
import { LanguageProvider } from './context/LanguageContext'
import { Move } from 'lucide-react'
import './App.css'

function AppContent() {
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [initialSearch, setInitialSearch] = useState('')
    const { siteContent, editMode } = useAdmin();

    const handleStartBooking = (category, search = '') => {
        setSelectedCategory(category)
        setInitialSearch(search)
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' })
    }

    const sections = {
        home: (
            <div id="home" key="home" className={editMode ? 'admin-section' : ''}>
                {editMode && (
                    <div className="section-admin-controls">
                        <div className="section-drag-handle"><Move size={16} /> Hero Section</div>
                    </div>
                )}
                <Hero onSearch={handleStartBooking} />
            </div>
        ),
        booking: (
            <div id="booking" key="booking">
                <BookingFlow
                    initialCategory={selectedCategory}
                    initialSearch={initialSearch}
                    onReset={() => { setSelectedCategory(null); setInitialSearch(''); }}
                />
            </div>
        ),
        services: (
            <div id="services" key="services" className={editMode ? 'admin-section' : ''}>
                {editMode && (
                    <div className="section-admin-controls">
                        <div className="section-drag-handle"><Move size={16} /> Services Section</div>
                    </div>
                )}
                <Services onSelectCategory={handleStartBooking} />
            </div>
        ),
        howItWorks: (
            <div id="how-it-works" key="howItWorks" className={editMode ? 'admin-section' : ''}>
                {editMode && (
                    <div className="section-admin-controls">
                        <div className="section-drag-handle"><Move size={16} /> How It Works</div>
                    </div>
                )}
                <HowItWorks />
            </div>
        )
    };

    // Always show all sections - no deletion allowed
    const activeOrder = ['home', 'booking', 'services', 'howItWorks'];

    return (
        <div className={`app ${editMode ? 'admin-mode-active' : ''}`}>
            <AdminToolbar />
            <Header onNavigate={handleStartBooking} />

            {activeOrder.map(sectionId => sections[sectionId])}

            <Footer onNavigate={handleStartBooking} />
        </div>
    )
}

function App() {
    return (
        <AdminProvider>
            <LanguageProvider>
                <AppContent />
            </LanguageProvider>
        </AdminProvider>
    )
}

export default App
