const User = require('../models/User');


exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log('Login attempt:', {email, passwordProvided: !!password});

        if (!email || !password) {
            return res.status(400).json({success: false, message: 'Please provide an email and password'});
        }

        const user = await User.findOne({email}).select('+password');

        if (!user) {
            return res.status(401).json({success: false, message: 'Invalid credentials'});
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({success: false, message: 'Invalid credentials'});
        }

        const token = user.getSignedJwtToken();

        user.password = undefined;

        res.status(200).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        res.status(500).json({success: false, message: 'Server error'});
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({success: false, message: 'Server error'});
    }
};

exports.updateDetails = async (req, res) => {
    try {
        const fieldsToUpdate = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            photo: req.body.photo,
            city: req.body.city,
            country: req.body.country,
            gender: req.body.gender,
            category: req.body.category,
            birthdate: req.body.birthdate
        };

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({success: false, message: 'Server error'});
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({success: false, message: 'Password is incorrect'});
        }

        user.password = req.body.newPassword;
        await user.save();

        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token
        });
    } catch (error) {
        res.status(500).json({success: false, message: 'Server error'});
    }
};
