import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import adminSchema from './models/Admin.js';

dotenv.config();

const fixRoles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to test database');

        // Fix users in test database who have role 'admin' or 'ca' back to 'user'
        // EXCEPT if they are actually the primary admin? The user said "in user db entry named as user not admin"
        const result = await User.updateMany(
            { role: { $in: ['admin', 'ca'] } },
            { role: 'user' }
        );
        console.log(`Updated ${result.modifiedCount} users in test database to role 'user'`);

        // Close connection
        await mongoose.disconnect();
        console.log('Finished fixing roles');
    } catch (error) {
        console.error('Error fixing roles:', error);
    }
};

fixRoles();
