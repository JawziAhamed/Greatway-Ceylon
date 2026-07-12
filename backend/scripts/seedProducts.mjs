import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { allProducts } from '../../frontend/src/data/products.js';

const forceUpdate = process.argv.includes('--force');

const toProductPayload = (product) => ({
    name: product.name,
    slug: product.slug,
    category: product.category,
    shortDescription: product.shortDescription || product.desc || product.description,
    description: product.description || product.desc || product.shortDescription,
    imageUrl: product.imageUrl || product.image,
    images: product.images || [product.imageUrl || product.image].filter(Boolean),
    scientificName: product.scientificName,
    origin: product.origin || 'Sri Lanka',
    hsCode: product.hsCode,
    availability: product.availability,
    packaging: product.packaging,
    shelfLife: product.shelfLife,
    storage: product.storage,
    supplyCapacity: product.supplyCapacity,
    price: product.price,
    exportInfo: product.exportInfo,
    benefits: product.benefits || [],
    certifications: product.certifications || [],
    nutritionPer: product.nutritionPer,
    nutrition: product.nutrition,
    exportAvailability: product.exportAvailability !== false,
});

const seedProducts = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/greatway-exports';
    await mongoose.connect(mongoUri);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const product of allProducts) {
        const payload = toProductPayload(product);

        if (forceUpdate) {
            const result = await Product.updateOne(
                { slug: payload.slug },
                { $set: payload },
                { upsert: true, runValidators: true }
            );

            if (result.upsertedCount > 0) created += 1;
            else updated += 1;
            continue;
        }

        const result = await Product.updateOne(
            { slug: payload.slug },
            { $setOnInsert: payload },
            { upsert: true, runValidators: true }
        );

        if (result.upsertedCount > 0) created += 1;
        else skipped += 1;
    }

    console.log(`Product seed complete. Created: ${created}, updated: ${updated}, already existed: ${skipped}.`);
};

seedProducts()
    .catch((error) => {
        console.error('Product seed failed:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
