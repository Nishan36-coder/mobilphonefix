import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { X, Plus, Calendar, Clock, Check, Trash2, Settings } from 'lucide-react';

const AvailabilityManager = ({ onClose }) => {
    const {
        availability,
        addTimeSlot,
        removeTimeSlot,
        toggleDateAvailability,
        setCustomTimeSlots,
        getAvailableTimeSlots
    } = useAdmin();

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [newGlobalSlot, setNewGlobalSlot] = useState('');
    const [newCustomSlot, setNewCustomSlot] = useState('');

    const isDateDisabled = availability.disabledDates.includes(selectedDate);
    const dateSlots = getAvailableTimeSlots(selectedDate);
    // Check if slots are custom (different from default)
    const isCustom = JSON.stringify(dateSlots) !== JSON.stringify(availability.timeSlots) && !isDateDisabled;

    const handleAddGlobal = () => {
        if (newGlobalSlot.trim()) {
            addTimeSlot(newGlobalSlot.trim());
            setNewGlobalSlot('');
        }
    };

    const handleAddCustom = () => {
        if (newCustomSlot.trim()) {
            const currentSlots = isCustom ? [...dateSlots] : [...availability.timeSlots];
            const updatedSlots = [...currentSlots, newCustomSlot.trim()];
            setCustomTimeSlots(selectedDate, updatedSlots);
            setNewCustomSlot('');
        }
    };

    const handleRemoveCustom = (slot) => {
        const currentSlots = isCustom ? [...dateSlots] : [...availability.timeSlots];
        const updatedSlots = currentSlots.filter(s => s !== slot);
        setCustomTimeSlots(selectedDate, updatedSlots);
    };

    const handleResetDate = () => {
        // Remove custom schedule for this date
        const newSchedule = { ...availability.customSchedule };
        delete newSchedule[selectedDate];
        // We can't directly delete from context state with a dedicated function yet, 
        // so we might need to expose a way to unset or just set it to default.
        // For now, let's just set it to match defaults or empty.
        // Actually, the context `setCustomTimeSlots` adds to the object.
        // We might need to update AdminContext to allow removing a custom schedule key,
        // or we can just set it to default slots manually.
        setCustomTimeSlots(selectedDate, availability.timeSlots);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content availability-manager">
                <div className="modal-header">
                    <h3><Settings size={20} /> Availability Settings</h3>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="am-grid">
                    {/* Left Column: Global Settings */}
                    <div className="am-section global-settings">
                        <h4>Global Default Slots</h4>
                        <p className="subtitle">These apply to all dates unless successfully overridden.</p>

                        <div className="slot-list">
                            {availability.timeSlots.map(slot => (
                                <div key={slot} className="slot-item">
                                    <span>{slot}</span>
                                    <button onClick={() => removeTimeSlot(slot)} className="delete-btn">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="add-slot-form">
                            <input
                                type="text"
                                placeholder="e.g. 9:00 AM - 11:00 AM"
                                value={newGlobalSlot}
                                onChange={(e) => setNewGlobalSlot(e.target.value)}
                            />
                            <button onClick={handleAddGlobal} className="btn-icon"><Plus size={18} /></button>
                        </div>
                    </div>

                    {/* Right Column: Date Specific */}
                    <div className="am-section date-settings">
                        <h4>Manage Specific Date</h4>

                        <div className="date-picker-wrapper">
                            <label>Select Date:</label>
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="date-input"
                            />
                        </div>

                        <div className="date-status">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={!isDateDisabled}
                                    onChange={() => toggleDateAvailability(selectedDate)}
                                />
                                <span className="toggle-text">Date is Available</span>
                            </label>
                        </div>

                        {!isDateDisabled && (
                            <div className="custom-slots-wrapper">
                                <div className="section-header">
                                    <h5>Time Slots for {selectedDate}</h5>
                                    {isCustom && <button onClick={handleResetDate} className="btn-text-small">Reset to Default</button>}
                                </div>

                                <div className="slot-list">
                                    {dateSlots.map((slot, idx) => (
                                        <div key={`${slot}-${idx}`} className="slot-item custom">
                                            <span>{slot}</span>
                                            <button onClick={() => handleRemoveCustom(slot)} className="delete-btn">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {dateSlots.length === 0 && <p className="empty-text">No slots available</p>}
                                </div>

                                <div className="add-slot-form">
                                    <input
                                        type="text"
                                        placeholder="Add override slot..."
                                        value={newCustomSlot}
                                        onChange={(e) => setNewCustomSlot(e.target.value)}
                                    />
                                    <button onClick={handleAddCustom} className="btn-icon"><Plus size={18} /></button>
                                </div>
                            </div>
                        )}

                        {isDateDisabled && (
                            <div className="disabled-message">
                                <span className="warning-icon">🚫</span>
                                <p>Bookings are disabled for this date.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 900px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    display: flex;
                    flex-direction: column;
                }
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-header h3 {
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: var(--text-main);
                }
                .close-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 5px;
                    color: #999;
                    transition: color 0.2s;
                }
                .close-btn:hover { color: #333; }
                
                .am-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    padding: 2rem;
                }
                @media (max-width: 768px) {
                    .am-grid { grid-template-columns: 1fr; }
                }
                
                .am-section {
                    background: #f8fafc;
                    padding: 1.5rem;
                    border-radius: 8px;
                    border: 1px solid #edf2f7;
                }
                
                .am-section h4 {
                    margin-top: 0;
                    margin-bottom: 0.5rem;
                    color: var(--text-main);
                }
                .subtitle {
                    font-size: 0.85rem;
                    color: #718096;
                    margin-bottom: 1.5rem;
                }
                
                .slot-list {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    max-height: 300px;
                    overflow-y: auto;
                    margin-bottom: 1rem;
                }
                .slot-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid #edf2f7;
                    color: #333;
                }
                .slot-item:last-child { border-bottom: none; }
                
                .delete-btn {
                    color: #e53e3e;
                    background: none;
                    border: none;
                    cursor: pointer;
                    opacity: 0.6;
                    padding: 4px;
                }
                .delete-btn:hover { opacity: 1; background: #fff5f5; border-radius: 4px; }
                
                .add-slot-form {
                    display: flex;
                    gap: 0.5rem;
                }
                .add-slot-form input {
                    flex: 1;
                    padding: 0.5rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                }
                .btn-icon {
                    background: var(--accent);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    width: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                
                .date-picker-wrapper {
                    margin-bottom: 1.5rem;
                }
                .date-input {
                    display: block;
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid #cbd5e0;
                    border-radius: 6px;
                    margin-top: 0.5rem;
                }
                
                .date-status {
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                }
                .toggle-label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    font-weight: 500;
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }
                .section-header h5 { margin: 0; color: #4a5568; }
                .btn-text-small {
                    background: none;
                    border: none;
                    color: var(--accent);
                    font-size: 0.8rem;
                    cursor: pointer;
                    text-decoration: underline;
                }
                
                .disabled-message {
                    text-align: center;
                    padding: 2rem;
                    color: #718096;
                }
                .warning-icon { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
            `}</style>
        </div>
    );
};

export default AvailabilityManager;
