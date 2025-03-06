const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    firstname: {
        type: String,
        required: [true, 'Please add a firstname'],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'Please add a lastname'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    birthdate: {
        type: Date,
        required: [true, 'Please add a birthdate']
    },
    city: {
        type: String,
        required: [true, 'Please add a city']
    },
    country: {
        type: String,
        required: [true, 'Please add a country']
    },
    photo: {
        type: String,
        default: 'https://randomuser.me/api/portraits/lego/1.jpg'
    },
    category: {
        type: String,
        enum: ['Marketing', 'Client', 'Technique'],
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    );
};

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
