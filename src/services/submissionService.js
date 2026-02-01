// FREE Submission Service using Web3Forms
// 100% Free, unlimited submissions, no backend needed!

/**
 * Send inquiry details via Web3Forms (will be sent as email)
 * @param {Object} inquiryData - The inquiry details
 * @returns {Promise} - Resolves when submission is successful
 */
export const sendInquirySMS = async (inquiryData) => {
    const { name, phone, email, brand, model, repair } = inquiryData;

    // Web3Forms endpoint
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'YOUR_WEB3FORMS_KEY';

    if (accessKey === 'YOUR_WEB3FORMS_KEY') {
        throw new Error('System Configuration Error: Web3Forms Access Key is not configured.');
    }

    // Format the inquiry message
    const formData = new FormData();
    formData.append('access_key', accessKey);
    formData.append('subject', `🔧 New Repair Inquiry - ${brand} ${model}`);
    formData.append('from_name', 'Mobilphonefix Website');
    formData.append('name', name);
    formData.append('phone', phone);

    // Only append 'email' field if it is provided, to avoid validation errors
    if (email && email.includes('@')) {
        formData.append('email', email);
    }

    formData.append('device', `${brand} ${model}`);
    formData.append('repair', repair);

    // Custom message for better formatting
    formData.append('message', `
📱 NEW REPAIR INQUIRY

👤 Customer Information:
Name: ${name}
Phone: ${phone}
Email: ${email || 'Not provided'}

🔧 Device Information:
Device: ${brand} ${model}
Repair Type: ${repair}

⏰ Received: ${new Date().toLocaleString()}
  `);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Inquiry sent successfully via Web3Forms');
            return { success: true, method: 'Web3Forms' };
        } else {
            throw new Error(result.message || 'Failed to send inquiry');
        }
    } catch (error) {
        console.error('❌ Error sending inquiry:', error);
        throw error;
    }
};

/**
 * Send appointment details via Web3Forms (email)
 * @param {Object} appointmentData - The appointment details
 * @returns {Promise} - Resolves when email is sent
 */
export const sendAppointmentEmailViaBackend = async (appointmentData) => {
    const { name, phone, email, address, date, time, brand, model, repair } = appointmentData;

    // Web3Forms endpoint
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'YOUR_WEB3FORMS_KEY';

    if (accessKey === 'YOUR_WEB3FORMS_KEY') {
        throw new Error('System Configuration Error: Web3Forms Access Key is not configured.');
    }

    const formData = new FormData();
    formData.append('access_key', accessKey);
    formData.append('subject', `📅 New Appointment Request - ${brand} ${model}`);
    formData.append('from_name', 'Mobilphonefix Website');
    formData.append('name', name);
    formData.append('phone', phone);

    // Only append 'email' field if it is provided, to avoid validation errors
    if (email && email.includes('@')) {
        formData.append('email', email);
    }

    formData.append('address', address);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('device', `${brand} ${model}`);
    formData.append('repair', repair);

    // Custom formatted message
    formData.append('message', `
📅 NEW APPOINTMENT REQUEST

👤 Customer Information:
Name: ${name}
Phone: ${phone}
Email: ${email || 'Not provided'}
Address: ${address}

⏰ Appointment Details:
Date: ${date}
Time: ${time}

🔧 Device Information:
Device: ${brand} ${model}
Repair Type: ${repair}

📍 Service Location: ${address}
⏰ Received: ${new Date().toLocaleString()}
  `);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Appointment email sent successfully via Web3Forms');
            return { success: true, method: 'Web3Forms' };
        } else {
            throw new Error(result.message || 'Failed to send appointment');
        }
    } catch (error) {
        console.error('❌ Error sending appointment:', error);
        throw error;
    }
};
