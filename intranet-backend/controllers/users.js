const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getRandomUser = async (req, res) => {
    try {

        const users = await User.find({ _id: { $ne: req.user.id } });

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'No other users found' });
        }

        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];

        res.status(200).json({
            success: true,
            data: randomUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const userData = req.body;
        const requiredFields = ['firstname', 'lastname', 'email', 'password', 'city', 'country', 'category'];

        for (const field of requiredFields) {
            if (!userData[field] || (typeof userData[field] === 'string' && userData[field].trim() === '')) {
                return res.status(400).json({
                    success: false,
                    message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required and cannot be empty`
                });
            }

            if (typeof userData[field] === 'string') {
                userData[field] = userData[field].trim();
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        const user = await User.create(userData);

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('User creation error:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await User.deleteOne({ _id: user._id });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.filterUsers = async (req, res) => {
    try {
        const { name, location, category } = req.query;
        const query = {};

        if (name) {
            query.$or = [
                { firstname: { $regex: name, $options: 'i' } },
                { lastname: { $regex: name, $options: 'i' } }
            ];
        }

        if (location) {
            query.$or = [
                { city: { $regex: location, $options: 'i' } },
                { country: { $regex: location, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        const users = await User.find(query);

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
