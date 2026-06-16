import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    mobile: {
        type: String,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    googleId: {
        type: String
    },
    firebaseUid: {
        type: String,
        unique: true,
        sparse: true
    },
    isMobileVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'ca'],
        default: 'user' // Default to user until approved
    },
    adminStatus: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none'
    },
    adminRequestedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    mobileOtp: {
        type: String
    },
    mobileOtpExpires: {
        type: Date
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    }
}, { collection: 'users' }); // Specify collection name as 'users'

// Encrypt password using bcrypt
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
adminSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

export default adminSchema;
