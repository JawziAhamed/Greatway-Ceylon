const Inquiry = require('../models/Inquiry');
const { sendInquiryNotification } = require('../services/whatsappService');

// Submit new inquiry
exports.createInquiry = async (req, res) => {
    try {
        const newInquiry = new Inquiry(req.body);
        const savedInquiry = await newInquiry.save();

        let whatsappNotification = { sent: false, skipped: false };
        try {
            whatsappNotification = await sendInquiryNotification(savedInquiry);
        } catch (err) {
            console.error('[WhatsApp Cloud API] Failed to send inquiry notification:', err.message);
        }

        res.status(201).json({
            message: 'Inquiry submitted successfully',
            inquiry: savedInquiry,
            whatsappNotification: {
                sent: Boolean(whatsappNotification.sent),
                skipped: Boolean(whatsappNotification.skipped),
            },
        });
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
