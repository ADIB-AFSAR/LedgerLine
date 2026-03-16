import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ITRForm from './models/ITRForm.js';
import User from './models/User.js';
import Purchase from './models/Purchase.js';

dotenv.config();

const checkITRs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to test database');

        const itrs = await ITRForm.find().populate('userId').populate('purchaseId');
        console.log(`Found ${itrs.length} ITR forms`);
        
        itrs.forEach(itr => {
            console.log(`ITR ID: ${itr._id}`);
            console.log(`User: ${itr.userId?.email}`);
            console.log(`Purchase ID: ${itr.purchaseId?._id}`);
            console.log(`Status: ${itr.status}`);
            console.log('---');
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkITRs();
