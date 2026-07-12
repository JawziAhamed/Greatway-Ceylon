const Product = require('../models/Product');
const mongoose = require('mongoose');

const slugify = (value = '') =>
    value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toCleanArray = (value) => {
    if (Array.isArray(value)) {
        return value.map(item => item?.toString().trim()).filter(Boolean);
    }

    if (typeof value === 'string') {
        return value
            .split(/\r?\n|,/)
            .map(item => item.trim())
            .filter(Boolean);
    }

    return [];
};

const normalizeNutrition = (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;

    return Object.entries(value).reduce((acc, [key, item]) => {
        const cleanKey = key?.toString().trim();
        const cleanValue = item?.toString().trim();
        if (cleanKey && cleanValue) acc[cleanKey] = cleanValue;
        return acc;
    }, {});
};

const toBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return Boolean(value);
};

const normalizeProductPayload = (body) => {
    const payload = { ...body };

    [
        'name', 'slug', 'category', 'shortDescription', 'description', 'imageUrl',
        'scientificName', 'origin', 'hsCode', 'availability', 'packaging', 'shelfLife',
        'storage', 'supplyCapacity', 'price', 'exportInfo', 'nutritionPer',
    ].forEach((field) => {
        if (payload[field] !== undefined) payload[field] = payload[field].toString().trim();
    });

    if (payload.slug) payload.slug = slugify(payload.slug);
    if (payload.benefits !== undefined) payload.benefits = toCleanArray(payload.benefits);
    if (payload.certifications !== undefined) payload.certifications = toCleanArray(payload.certifications);
    if (payload.images !== undefined) payload.images = toCleanArray(payload.images);
    if (payload.nutrition !== undefined) payload.nutrition = normalizeNutrition(payload.nutrition);
    if (payload.exportAvailability !== undefined) payload.exportAvailability = toBoolean(payload.exportAvailability);

    if (!payload.shortDescription && payload.description) {
        payload.shortDescription = payload.description.length > 160
            ? `${payload.description.slice(0, 157).trim()}...`
            : payload.description;
    }

    if ((!payload.images || payload.images.length === 0) && payload.imageUrl) {
        payload.images = [payload.imageUrl];
    }

    return payload;
};

const getUniqueSlug = async (value, excludeId) => {
    const baseSlug = slugify(value) || 'product';
    const escapedBase = escapeRegex(baseSlug);
    const query = { slug: new RegExp(`^${escapedBase}(-\\d+)?$`) };

    if (excludeId) query._id = { $ne: excludeId };

    const matchingProducts = await Product.find(query).select('slug').lean();
    const usedSlugs = new Set(matchingProducts.map(product => product.slug));

    if (!usedSlugs.has(baseSlug)) return baseSlug;

    let suffix = 2;
    while (usedSlugs.has(`${baseSlug}-${suffix}`)) suffix += 1;
    return `${baseSlug}-${suffix}`;
};

const notDeletedFilter = { isDeleted: { $ne: true } };

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const includeUnavailable = req.query.includeUnavailable === 'true';
        const filter = includeUnavailable
            ? { ...notDeletedFilter }
            : { ...notDeletedFilter, exportAvailability: { $ne: false } };
        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get one product by id or slug
exports.getProduct = async (req, res) => {
    try {
        const { identifier } = req.params;
        const includeUnavailable = req.query.includeUnavailable === 'true';
        const filter = mongoose.Types.ObjectId.isValid(identifier)
            ? { _id: identifier }
            : { slug: identifier };

        if (!includeUnavailable) filter.exportAvailability = { $ne: false };
        filter.isDeleted = { $ne: true };

        const product = await Product.findOne(filter);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a product
exports.createProduct = async (req, res) => {
    try {
        const payload = normalizeProductPayload(req.body);
        const requestedSlug = slugify(payload.slug || payload.name);
        payload.isDeleted = false;
        payload.deletedAt = null;

        const deletedProduct = await Product.findOne({ slug: requestedSlug, isDeleted: true });
        if (deletedProduct) {
            payload.slug = requestedSlug;
            const restoredProduct = await Product.findByIdAndUpdate(
                deletedProduct._id,
                payload,
                { new: true, runValidators: true }
            );
            return res.status(201).json(restoredProduct);
        }

        payload.slug = await getUniqueSlug(requestedSlug);

        const newProduct = new Product(payload);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = normalizeProductPayload(req.body);
        payload.isDeleted = false;
        payload.deletedAt = null;

        if (payload.slug || payload.name) {
            payload.slug = await getUniqueSlug(payload.slug || payload.name, id);
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id, ...notDeletedFilter },
            payload,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findOneAndUpdate(
            { _id: id, ...notDeletedFilter },
            { isDeleted: true, deletedAt: new Date(), exportAvailability: false },
            { new: true }
        );
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
