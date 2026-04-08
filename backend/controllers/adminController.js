const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
        res.status(200).json({ token });
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
