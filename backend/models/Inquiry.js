const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
    productOfInterest: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
