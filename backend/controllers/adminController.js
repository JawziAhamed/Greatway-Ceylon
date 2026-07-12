const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const getPublicProfile = (admin) => ({
    id: admin._id,
    username: admin.username,
    fullName: admin.fullName || '',
    email: admin.email || '',
    phone: admin.phone || '',
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
});

const findAdminFromToken = async (decoded) => {
    if (decoded.id) return Admin.findById(decoded.id);
    if (decoded.username) return Admin.findOne({ username: decoded.username });
    return null;
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // In a real app, you would create the first admin user via a seed script
        // For this demo, let's allow a hardcoded fallback if no admins exist
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0 && username === 'admin' && password === 'admin123') {
            const token = jwt.sign({ username: 'admin' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
            return res.status(200).json({ token, message: 'Logged in with default credentials' });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
        res.status(200).json({ token, admin: getPublicProfile(admin) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const admin = await findAdminFromToken(req.admin);

        if (!admin && req.admin?.username === 'admin') {
            return res.status(200).json({
                username: 'admin',
                fullName: 'Default Admin',
                email: '',
                phone: '',
                isDefaultFallback: true,
            });
        }

        if (!admin) return res.status(404).json({ message: 'Admin profile not found' });

        res.status(200).json(getPublicProfile(admin));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, fullName, email, phone, currentPassword, newPassword } = req.body;
        const wantsPasswordChange = Boolean(newPassword);
        const adminCount = await Admin.countDocuments();
        let admin = await findAdminFromToken(req.admin);

        if (!currentPassword) {
            return res.status(400).json({ message: 'Current password is required to update profile details' });
        }

        if (!admin && req.admin?.username === 'admin' && adminCount === 0) {
            if (currentPassword !== 'admin123') {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }

            const passwordHash = await bcrypt.hash(newPassword || currentPassword, 10);
            admin = await Admin.create({
                username: username?.trim() || 'admin',
                password: passwordHash,
                fullName: fullName?.trim() || 'Default Admin',
                email: email?.trim() || '',
                phone: phone?.trim() || '',
            });

            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
            return res.status(200).json({ admin: getPublicProfile(admin), token });
        }

        if (!admin) return res.status(404).json({ message: 'Admin profile not found' });

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const cleanUsername = username?.trim();
        if (cleanUsername && cleanUsername !== admin.username) {
            const existing = await Admin.findOne({ username: cleanUsername, _id: { $ne: admin._id } });
            if (existing) return res.status(409).json({ message: 'Username is already in use' });
            admin.username = cleanUsername;
        }

        admin.fullName = fullName?.trim() || '';
        admin.email = email?.trim() || '';
        admin.phone = phone?.trim() || '';

        if (wantsPasswordChange) {
            if (newPassword.length < 8) {
                return res.status(400).json({ message: 'New password must be at least 8 characters' });
            }
            admin.password = await bcrypt.hash(newPassword, 10);
        }

        await admin.save();
        res.status(200).json({ admin: getPublicProfile(admin) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
