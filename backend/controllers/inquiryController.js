const Inquiry = require('../models/Inquiry');
const twilio = require('twilio');

const normalizeWhatsAppNumber = (number) => {
    const value = number || '+94725737391';
    return value.startsWith('whatsapp:') ? value : `whatsapp:${value}`;
};

const sendWhatsAppNotification = async (inquiry) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'; // Twilio sandbox default
    const toNumber = normalizeWhatsAppNumber(process.env.OFFICIAL_WHATSAPP_NUMBER);

    if (!accountSid || !authToken) {
        console.warn('[Twilio] Credentials not configured in backend/.env. Skipping WhatsApp notification.');
        return;
    }

    try {
        const client = twilio(accountSid, authToken);
        const text = `*New Inquiry - Greatway Ceylon*\n\n` +
            `*Name:* ${inquiry.name}\n` +
            `*Email:* ${inquiry.email}\n` +
            `*Phone:* ${inquiry.phone}\n` +
            `*Product:* ${inquiry.productOfInterest || 'General Inquiry'}\n` +
            `*Message:* ${inquiry.message}\n` +
            `*Submitted:* ${new Date(inquiry.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}`;

        await client.messages.create({
            body: text,
            from: fromNumber,
            to: toNumber
        });
        console.log(`[Twilio] WhatsApp inquiry notification sent successfully to ${toNumber}`);
    } catch (error) {
        console.error('[Twilio] Error sending WhatsApp notification:', error.message);
    }
};

// Submit new inquiry
exports.createInquiry = async (req, res) => {
    try {
        const newInquiry = new Inquiry(req.body);
        const savedInquiry = await newInquiry.save();

        // Send WhatsApp notification in the background
        sendWhatsAppNotification(savedInquiry).catch(err => {
            console.error('[Twilio] Background notification promise rejection:', err);
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
