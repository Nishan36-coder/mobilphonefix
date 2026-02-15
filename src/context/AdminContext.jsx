import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES, BRANDS, MODELS, REPAIRS } from '../data/repairData';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Website Content State
    const [siteContent, setSiteContent] = useState(() => {
        const saved = localStorage.getItem('site_content');
        return saved ? JSON.parse(saved) : {
            heroTitle: 'Reliable Certified Phone Repair',
            heroSubtitle: 'Professional repair for your electronic devices. We bring your tech back to life with quality parts and expert service.',
            servicesTitle: 'Our Services',
            servicesSubtitle: 'We specialize in professional repairs for all your favorite devices. From screen replacements to battery upgrades.',
            howItWorksTitle: 'How It Works',
            sectionOrder: ['home', 'booking', 'services', 'how-it-works']
        };
    });

    // Repair Data State
    const [repairData, setRepairData] = useState(() => {
        const savedV5 = localStorage.getItem('repair_data_v5');
        if (savedV5) return JSON.parse(savedV5);

        const savedV4 = localStorage.getItem('repair_data_v4');
        if (savedV4) {
            const data = JSON.parse(savedV4);
            return {
                ...data,
                modelRepairs: data.modelRepairs || {}
            };
        }

        return {
            brands: BRANDS,
            models: MODELS,
            repairs: REPAIRS,
            modelRepairs: {} // { 'category_brand_model': [repair, ...] }
        };
    });

    // Availability Management State
    const [availability, setAvailability] = useState(() => {
        const saved = localStorage.getItem('availability_data');
        return saved ? JSON.parse(saved) : {
            timeSlots: [
                '9:00 AM - 11:00 AM',
                '11:00 AM - 1:00 PM',
                '1:00 PM - 3:00 PM',
                '3:00 PM - 5:00 PM'
            ],
            disabledDates: [], // Array of date strings in YYYY-MM-DD format
            customSchedule: {} // { 'YYYY-MM-DD': ['9:00 AM - 11:00 AM', ...] }
        };
    });

    // Persistence
    useEffect(() => {
        localStorage.setItem('site_content', JSON.stringify(siteContent));
    }, [siteContent]);

    useEffect(() => {
        localStorage.setItem('repair_data_v5', JSON.stringify(repairData));
    }, [repairData]);

    useEffect(() => {
        localStorage.setItem('availability_data', JSON.stringify(availability));
    }, [availability]);

    const updateContent = (key, value) => {
        setSiteContent(prev => ({ ...prev, [key]: value }));
    };

    const updateSectionOrder = (newOrder) => {
        setSiteContent(prev => ({ ...prev, sectionOrder: newOrder }));
    };

    // Availability Management Functions
    const addTimeSlot = (timeSlot) => {
        setAvailability(prev => ({
            ...prev,
            timeSlots: [...prev.timeSlots, timeSlot]
        }));
    };

    const removeTimeSlot = (timeSlot) => {
        setAvailability(prev => ({
            ...prev,
            timeSlots: prev.timeSlots.filter(slot => slot !== timeSlot)
        }));
    };

    const toggleDateAvailability = (dateString) => {
        setAvailability(prev => {
            const isDisabled = prev.disabledDates.includes(dateString);
            return {
                ...prev,
                disabledDates: isDisabled
                    ? prev.disabledDates.filter(d => d !== dateString)
                    : [...prev.disabledDates, dateString]
            };
        });
    };

    const setCustomTimeSlots = (dateString, timeSlots) => {
        setAvailability(prev => ({
            ...prev,
            customSchedule: {
                ...prev.customSchedule,
                [dateString]: timeSlots
            }
        }));
    };

    const getAvailableTimeSlots = (dateString) => {
        // Check if date is disabled
        if (availability.disabledDates.includes(dateString)) {
            return [];
        }
        // Return custom schedule if exists, otherwise default time slots
        return availability.customSchedule[dateString] || availability.timeSlots;
    };

    const isDateAvailable = (dateString) => {
        return !availability.disabledDates.includes(dateString);
    };

    const addBrand = (category, brandName) => {
        setRepairData(prev => {
            const newBrands = { ...prev.brands };
            if (!newBrands[category].includes(brandName)) {
                newBrands[category] = [...newBrands[category], brandName];
            }
            return { ...prev, brands: newBrands };
        });
    };

    const deleteBrand = (category, brandName) => {
        setRepairData(prev => {
            const newBrands = { ...prev.brands };
            newBrands[category] = newBrands[category].filter(b => b !== brandName);
            return { ...prev, brands: newBrands };
        });
    };

    const addModel = (brand, category, modelName, isNewSeries = false, seriesName = null) => {
        setRepairData(prev => {
            const newModels = { ...prev.models };
            // Deep copy the brand object to avoid mutation
            newModels[brand] = { ...newModels[brand] } || {};

            // Check if current structure is hierarchical
            const currentData = newModels[brand][category];
            const isHierarchical = currentData && typeof currentData === 'object' && !Array.isArray(currentData);

            if (isNewSeries) {
                // Adding a new series (e.g., "Galaxy M Series")
                if (!isHierarchical) {
                    // Convert to hierarchical if not already
                    newModels[brand][category] = {};
                }
                newModels[brand][category] = { ...newModels[brand][category] };
                if (!newModels[brand][category][modelName]) {
                    newModels[brand][category][modelName] = [];
                }
            } else if (seriesName) {
                // Adding a model to a specific series
                newModels[brand][category] = { ...newModels[brand][category] };
                if (!newModels[brand][category][seriesName]) {
                    newModels[brand][category][seriesName] = [];
                }
                if (!newModels[brand][category][seriesName].includes(modelName)) {
                    newModels[brand][category][seriesName] = [...newModels[brand][category][seriesName], modelName];
                }
            } else {
                // Adding to flat array structure
                if (!newModels[brand][category]) newModels[brand][category] = [];
                if (!newModels[brand][category].includes(modelName)) {
                    newModels[brand][category] = [...newModels[brand][category], modelName];
                }
            }
            return { ...prev, models: newModels };
        });
    };

    const deleteModel = (brand, category, modelName, seriesName = null) => {
        setRepairData(prev => {
            const newModels = { ...prev.models };
            if (newModels[brand] && newModels[brand][category]) {
                // Deep copy before modifying
                newModels[brand] = { ...newModels[brand] };

                const currentData = newModels[brand][category];
                const isHierarchical = typeof currentData === 'object' && !Array.isArray(currentData);

                if (isHierarchical && seriesName) {
                    // Delete from specific series
                    newModels[brand][category] = { ...newModels[brand][category] };
                    if (newModels[brand][category][seriesName]) {
                        newModels[brand][category][seriesName] = newModels[brand][category][seriesName].filter(m => m !== modelName);
                    }
                } else if (Array.isArray(currentData)) {
                    // Delete from flat array
                    newModels[brand][category] = newModels[brand][category].filter(m => m !== modelName);
                }
            }
            return { ...prev, models: newModels };
        });
    };

    const getRepairs = (category, brand, model) => {
        const key = `${category}_${brand}_${model}`.replace(/\s+/g, '_');
        if (repairData.modelRepairs && repairData.modelRepairs[key]) {
            return repairData.modelRepairs[key];
        }
        return repairData.repairs || [];
    };

    const addRepairAction = (repair, category, brand, model) => {
        const key = `${category}_${brand}_${model}`.replace(/\s+/g, '_');
        setRepairData(prev => {
            const currentRepairs = (prev.modelRepairs && prev.modelRepairs[key])
                ? prev.modelRepairs[key]
                : [...(prev.repairs || [])];

            const newRepairs = [...currentRepairs, { id: Date.now().toString(), name: repair }];

            return {
                ...prev,
                modelRepairs: {
                    ...(prev.modelRepairs || {}),
                    [key]: newRepairs
                }
            };
        });
    };

    const deleteRepairAction = (id, category, brand, model) => {
        const key = `${category}_${brand}_${model}`.replace(/\s+/g, '_');
        setRepairData(prev => {
            const currentRepairs = (prev.modelRepairs && prev.modelRepairs[key])
                ? prev.modelRepairs[key]
                : [...(prev.repairs || [])];

            const newRepairs = currentRepairs.filter(r => r.id !== id);

            return {
                ...prev,
                modelRepairs: {
                    ...(prev.modelRepairs || {}),
                    [key]: newRepairs
                }
            };
        });
    };

    const toggleAdmin = () => setIsAdmin(!isAdmin);
    const toggleEditMode = () => setEditMode(!editMode);

    return (
        <AdminContext.Provider value={{
            isAdmin, toggleAdmin,
            editMode, toggleEditMode,
            siteContent, updateContent, updateSectionOrder,
            repairData, addBrand, deleteBrand, addModel, deleteModel, addRepairAction, deleteRepairAction, getRepairs,
            availability, addTimeSlot, removeTimeSlot, toggleDateAvailability, setCustomTimeSlots, getAvailableTimeSlots, isDateAvailable
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
