import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ITRForm from './models/ITRForm.js';
import User from './models/User.js';
import Purchase from './models/Purchase.js';

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to test database');

        const itrs = await ITRForm.find();
        console.log(`ITR Forms: ${itrs.length}`);
        itrs.forEach(i => console.log(`- ITR ${i._id}, userId: ${i.userId}, purchaseId: ${i.purchaseId}`));

        const purchases = await Purchase.find();
        console.log(`Purchases: ${purchases.length}`);
        purchases.forEach(p => console.log(`- Purchase ${p._id}, userId: ${p.userId}, paymentStatus: ${p.paymentStatus}`));

        const users = await User.find({ email: 'sainipawan2929@gmail.com' });
        console.log(`Users with email sainipawan2929@gmail.com: ${users.length}`);
        users.forEach(u => console.log(`- User ${u._id}, role: ${u.role}, email: ${u.email}`));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkData();
