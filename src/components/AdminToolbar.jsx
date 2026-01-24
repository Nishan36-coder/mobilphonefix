import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Settings, Eye, Edit3, Move, Save, LogOut, Calendar } from 'lucide-react';
import AvailabilityManager from './AvailabilityManager';

const AdminToolbar = () => {
    const { isAdmin, toggleAdmin, editMode, toggleEditMode } = useAdmin();
    const [showAvailability, setShowAvailability] = useState(false);

    if (!isAdmin) return null;

    return (
        <>
            <div className="admin-toolbar">
                <div className="admin-toolbar-inner container">
                    <div className="admin-status">
                        <Settings size={18} className="spin-slow" />
                        <span>Admin Mode</span>
                    </div>

                    <div className="admin-actions">
                        <button
                            className={`admin-btn ${showAvailability ? 'active' : ''}`}
                            onClick={() => setShowAvailability(true)}
                        >
                            <Calendar size={16} /> Availability
                        </button>
                        <button
                            className={`admin-btn ${!editMode ? 'active' : ''}`}
                            onClick={() => editMode && toggleEditMode()}
                        >
                            <Eye size={16} /> Preview
                        </button>
                        <button
                            className={`admin-btn ${editMode ? 'active' : ''}`}
                            onClick={() => !editMode && toggleEditMode()}
                        >
                            <Edit3 size={16} /> Edit Content
                        </button>
                        <button className="admin-btn logout" onClick={toggleAdmin}>
                            <LogOut size={16} /> Exit Admin
                        </button>
                    </div>
                </div>
            </div>
            {showAvailability && <AvailabilityManager onClose={() => setShowAvailability(false)} />}
        </>
    );
};

export default AdminToolbar;
