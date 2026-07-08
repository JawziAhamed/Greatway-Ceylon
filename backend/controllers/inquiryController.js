const Inquiry = require('../models/Inquiry');

const normalizePhoneNumber = (number) => {
    const value = number || '+94725737391';
    return value.replace(/^whatsapp:/, '').replace(/\D/g, '');
};

const getSubmittedAt = (inquiry) => {
    return new Date(inquiry.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Colombo' });
};

const buildInquiryMessage = (inquiry) => {
    return `*New Inquiry - Greatway Ceylon*\n\n` +
        `*Name:* ${inquiry.name}\n` +
        `*Email:* ${inquiry.email}\n` +
        `*Phone:* ${inquiry.phone}\n` +
        `*Product:* ${inquiry.productOfInterest || 'General Inquiry'}\n` +
        `*Message:* ${inquiry.message}\n` +
        `*Submitted:* ${getSubmittedAt(inquiry)}`;
};

const buildCloudApiPayload = (inquiry, toNumber) => {
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME;

    if (templateName) {
        return {
            messaging_product: 'whatsapp',
            to: toNumber,
            type: 'template',
            template: {
                name: templateName,
                language: {
                    code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en_US',
                },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: inquiry.name },
                            { type: 'text', text: inquiry.email },
                            { type: 'text', text: inquiry.phone },
                            { type: 'text', text: inquiry.productOfInterest || 'General Inquiry' },
                            { type: 'text', text: inquiry.message },
                            { type: 'text', text: getSubmittedAt(inquiry) },
                        ],
                    },
                ],
            },
        };
    }

    return {
        messaging_product: 'whatsapp',
        to: toNumber,
        type: 'text',
        text: {
            preview_url: false,
            body: buildInquiryMessage(inquiry),
        },
    };
};

const sendWhatsAppNotification = async (inquiry) => {
    if (process.env.BYPASS_WHATSAPP_NOTIFICATION === 'true') {
        console.warn('[WhatsApp] Notification bypass enabled. Skipping WhatsApp notification.');
        return;
    }

    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const apiVersion = process.env.WHATSAPP_GRAPH_VERSION || 'v23.0';
    const toNumber = normalizePhoneNumber(process.env.OFFICIAL_WHATSAPP_NUMBER);

    if (!accessToken || !phoneNumberId) {
        console.warn('[WhatsApp Cloud API] Credentials not configured. Skipping WhatsApp notification.');
        return;
    }

    try {
        const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(buildCloudApiPayload(inquiry, toNumber)),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.error?.message || `WhatsApp Cloud API request failed with ${response.status}`);
        }

        console.log(`[WhatsApp Cloud API] Inquiry notification sent successfully to +${toNumber}`);
    } catch (error) {
        console.error('[WhatsApp Cloud API] Error sending WhatsApp notification:', error.message);
    }
};

// Submit new inquiry
exports.createInquiry = async (req, res) => {
    try {
        const newInquiry = new Inquiry(req.body);
        const savedInquiry = await newInquiry.save();

        // Send WhatsApp notification in the background without delaying the user response.
        sendWhatsAppNotification(savedInquiry).catch(err => {
            console.error('[WhatsApp Cloud API] Background notification promise rejection:', err);
        });

        res.status(201).json({ message: 'Inquiry submitted successfully', inquiry: savedInquiry });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all inquiries (Admin)
exports.getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.status(200).json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update inquiry status
exports.updateInquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedInquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedInquiry) return res.status(404).json({ message: 'Inquiry not found' });
        res.status(200).json(updatedInquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an inquiry
exports.deleteInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        await Inquiry.findByIdAndDelete(id);
        res.status(200).json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
