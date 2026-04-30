import mongoose from 'mongoose';
import adminSchema from '../models/Admin.js';

let adminConn;
export let Admin;

let connectionPromise = null;

export const connectDB = async () => {
    if (connectionPromise) return connectionPromise;

    connectionPromise = (async () => {
        try {
            const mongoOptions = {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                family: 4
            };

            const conn = await mongoose.connect(process.env.MONGO_URI, mongoOptions);
            console.log(`MongoDB Connected: ${conn.connection.host}`);

            const baseUri = process.env.MONGO_URI.includes('?') 
                ? process.env.MONGO_URI.split('?')[0]
                : process.env.MONGO_URI;
            
            const adminUri = baseUri.substring(0, baseUri.lastIndexOf('/')) + '/admin_db';
            const queryParams = process.env.MONGO_URI.includes('?') ? '?' + process.env.MONGO_URI.split('?')[1] : '';
            
            adminConn = mongoose.createConnection(adminUri + queryParams, mongoOptions);
            Admin = adminConn.model('Admin', adminSchema);
            
            console.log(`Admin Database Connected`);
            return { Admin };
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    })();

    return connectionPromise;
};

export const getAdminModel = async () => {
    if (Admin) return Admin;
    await connectDB();
    // Wait slightly if still setting up
    for (let i = 0; i < 20; i++) {
        if (Admin) return Admin;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return Admin;
};
