import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ITRForm from './models/ITRForm.js';
import User from './models/User.js';
import Purchase from './models/Purchase.js';
import Plan from './models/Plan.js';

dotenv.config();

const testGetAllITRs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');

        const itrs = await ITRForm.find({})
            .populate('userId', 'name email mobile')
            .populate({
                path: 'purchaseId',
                populate: {
                    path: 'planId'
                }
            });
        
        console.log('ITRs found:', itrs.length);
        if (itrs.length > 0) {
            console.log('First ITR:', JSON.stringify(itrs[0], null, 2));
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

testGetAllITRs();
