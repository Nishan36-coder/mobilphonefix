export const CATEGORIES = [
    { id: 'find_model', name: 'Find Model', icon: 'HelpCircle' },
    { id: 'smartphone', name: 'Smartphone', icon: 'Smartphone' },
    { id: 'tablet', name: 'Tablet', icon: 'Tablet' },
    { id: 'laptop', name: 'Laptop', icon: 'Laptop' },
];

export const BRANDS = {
    smartphone: [
        'Apple', 'Samsung', 'Google', 'Motorola', 'OnePlus', 'LG', 'Sony', 'Xiaomi',
        'Huawei', 'Oppo', 'Realme', 'Asus', 'BlackBerry', 'CAT', 'Honor',
        'HTC', 'Lenovo', 'Microsoft', 'Alcatel', 'Fairphone', 'Nokia'
    ],
    tablet: [
        'Apple', 'Samsung', 'Microsoft', 'Amazon', 'Lenovo', 'Huawei', 'Asus', 'LG', 'Google', 'Sony'
    ],
    watch: [
        'Apple', 'Samsung', 'Google', 'Fitbit', 'LG', 'Motorola', 'Huawei'
    ],
    laptop: [
        'Apple', 'Microsoft', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer'
    ]
};

export const MODELS = {
    Apple: {
        smartphone: [
            'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
            'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
            'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
            'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13 Mini', 'iPhone 13',
            'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12 Mini', 'iPhone 12',
            'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11', 'iPhone SE (2022)', 'iPhone SE (2020)'
        ],
        tablet: [
            'iPad Pro 12.9 (6th Gen)', 'iPad Pro 11 (4th Gen)', 'iPad Air (5th Gen)',
            'iPad (10th Gen)', 'iPad Mini (6th Gen)', 'iPad Pro 12.9 (5th Gen)',
            'iPad Pro 11 (3rd Gen)', 'iPad Air (4th Gen)', 'iPad (9th Gen)'
        ],
        watch: [
            'Apple Watch Ultra 2', 'Apple Watch Series 9', 'Apple Watch SE (2nd Gen)',
            'Apple Watch Ultra', 'Apple Watch Series 8', 'Apple Watch Series 7',
            'Apple Watch Series 6', 'Apple Watch Series 5', 'Apple Watch Series 4'
        ],
        laptop: [
            'MacBook Pro 16", M3', 'MacBook Pro 14", M3', 'MacBook Air 15", M2',
            'MacBook Air 13", M2', 'MacBook Pro 13", M2', 'MacBook Pro 16", M1',
            'MacBook Pro 14", M1', 'MacBook Air, M1'
        ]
    },
    Samsung: {
        smartphone: {
            'Galaxy S Series': [
                'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
                'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23',
                'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
                'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21 FE', 'Galaxy S21',
                'Galaxy S20 Ultra', 'Galaxy S20+', 'Galaxy S20',
                'Galaxy S10+', 'Galaxy S10', 'Galaxy S10e'
            ],
            'Galaxy Z Series': [
                'Galaxy Z Fold 6', 'Galaxy Z Flip 6',
                'Galaxy Z Fold 5', 'Galaxy Z Flip 5',
                'Galaxy Z Fold 4', 'Galaxy Z Flip 4',
                'Galaxy Z Fold 3', 'Galaxy Z Flip 3',
                'Galaxy Z Fold 2', 'Galaxy Z Flip'
            ],
            'Galaxy Note Series': [
                'Galaxy Note 20 Ultra', 'Galaxy Note 20',
                'Galaxy Note 10+', 'Galaxy Note 10',
                'Galaxy Note 9', 'Galaxy Note 8'
            ],
            'Galaxy A Series': [
                'Galaxy A54', 'Galaxy A53', 'Galaxy A52',
                'Galaxy A34', 'Galaxy A33', 'Galaxy A32',
                'Galaxy A24', 'Galaxy A23', 'Galaxy A22',
                'Galaxy A14', 'Galaxy A13', 'Galaxy A12'
            ]
        },
        tablet: [
            'Galaxy Tab S9 Ultra', 'Galaxy Tab S9+', 'Galaxy Tab S9',
            'Galaxy Tab S8 Ultra', 'Galaxy Tab S8+', 'Galaxy Tab S8',
            'Galaxy Tab A9', 'Galaxy Tab A8'
        ],
        watch: [
            'Galaxy Watch 6 Classic', 'Galaxy Watch 6', 'Galaxy Watch 5 Pro',
            'Galaxy Watch 5', 'Galaxy Watch 4 Classic', 'Galaxy Watch 4'
        ]
    },
    Google: {
        smartphone: [
            'Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a',
            'Pixel 6 Pro', 'Pixel 6', 'Pixel 6a'
        ],
        watch: [
            'Pixel Watch 2', 'Pixel Watch'
        ]
    }
    // Add other brands as needed or use a default list for less popular brands
};

export const REPAIRS = [
    { id: 'screen', name: 'Screen Repair' },
    { id: 'lcd', name: 'LCD Display / Touchscreen' },
    { id: 'battery', name: 'Battery Replacement' },
    { id: 'charging', name: 'Charging Port Repair' },
    { id: 'camera_back', name: 'Back-facing Camera' },
    { id: 'camera_front', name: 'Front-facing Camera' },
    { id: 'camera_lens', name: 'Camera Lens Repair' },
    { id: 'earspeaker', name: 'Earspeaker Repair' },
    { id: 'loudspeaker', name: 'Loudspeaker Repair' },
    { id: 'mic', name: 'Microphone Repair' },
    { id: 'back_cover', name: 'Back Cover / Glass' },
    { id: 'housing', name: 'Housing / Mid-frame' },
    { id: 'water_damage', name: 'Water Damage Investigation' },
    { id: 'investigation', name: 'Standard Investigation / Other Issue' },
];

export const getModels = (brand, category) => {
    if (MODELS[brand] && MODELS[brand][category]) {
        const models = MODELS[brand][category];
        // Check if it's a hierarchical structure (object with series)
        if (typeof models === 'object' && !Array.isArray(models)) {
            return models; // Return the hierarchical object
        }
        return models; // Return flat array
    }
    // Generic models for brands not explicitly defined
    return [
        `${brand} Generic Model 1`,
        `${brand} Generic Model 2`,
        'Other Model'
    ];
};

// Helper function to check if models are hierarchical
export const isHierarchical = (brand, category) => {
    const models = MODELS[brand]?.[category];
    return models && typeof models === 'object' && !Array.isArray(models);
};

