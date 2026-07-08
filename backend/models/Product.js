const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    category: { type: String, required: true },
    shortDescription: { type: String, trim: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    images: [{ type: String, trim: true }],
    scientificName: { type: String, trim: true },
    origin: { type: String, trim: true },
    hsCode: { type: String, trim: true },
    availability: { type: String, trim: true },
    packaging: { type: String, trim: true },
    shelfLife: { type: String, trim: true },
    storage: { type: String, trim: true },
    supplyCapacity: { type: String, trim: true },
    price: { type: String, trim: true },
    exportInfo: { type: String, trim: true },
    benefits: [{ type: String, trim: true }],
    certifications: [{ type: String, trim: true }],
    nutritionPer: { type: String, trim: true },
    nutrition: { type: Map, of: String, default: undefined },
    exportAvailability: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
