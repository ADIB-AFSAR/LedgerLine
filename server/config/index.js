import mongoose from 'mongoose';
import adminSchema from '../models/Admin.js';

let adminConn;
let Admin;

export const connectDB = async () => {
    try {
        // Default connection (test database)
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Admin database connection
        // Assuming MONGO_URI has a database name at the end, we swap it for 'admin'
        const baseUri = process.env.MONGO_URI.includes('?') 
            ? process.env.MONGO_URI.split('?')[0]
            : process.env.MONGO_URI;
        
        const adminUri = baseUri.substring(0, baseUri.lastIndexOf('/')) + '/admin_db';
        const queryParams = process.env.MONGO_URI.includes('?') ? '?' + process.env.MONGO_URI.split('?')[1] : '';
        
        adminConn = mongoose.createConnection(adminUri + queryParams);
        Admin = adminConn.model('Admin', adminSchema);
        
        console.log(`Admin Database Connected`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export { Admin };