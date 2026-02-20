import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Plan from './models/Plan.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

// Plan Schema Enums: 
// type: ['Basic', 'Premium', 'Business']
// formType: ['ITR1', 'ITR2', 'ITR3', 'ITR4', 'GST', 'OTHER']

const plans = [
    { name: 'Salary (Basic) ITR', price: 799, features: ['ITR-1', 'Salary Income', 'Standard Deductions'], type: 'Basic', formType: 'ITR1' },
    { name: 'Salary (Premium)', price: 1499, features: ['ITR-2', 'Multiple Income Sources', 'House Property'], type: 'Premium', formType: 'ITR2' },
    { name: 'Capital Gain', price: 2999, features: ['LTCG & STCG', 'Stock Market Gains', 'Property Sales'], type: 'Premium', formType: 'ITR2' },
    { name: 'Foreign/NRI Income', price: 3499, features: ['NRI Tax Filing', 'Foreign Income', 'DTAA Benefits'], type: 'Premium', formType: 'ITR2' },

    { name: 'Business & Profession', price: 2999, features: ['ITR-3/ITR-4', 'Business Income', 'Professional Income'], type: 'Business', formType: 'ITR3' },
    { name: 'F&O Trading', price: 2499, features: ['F&O Trading Income', 'Speculative Income', 'Loss Carry Forward'], type: 'Business', formType: 'ITR3' },
    { name: 'House Property', price: 1999, features: ['Rental Income', 'Property Tax Deductions', 'Home Loan Interest'], type: 'Business', formType: 'ITR2' },
    { name: 'Crypto Trading', price: 3999, features: ['Crypto Trading Income', 'VDA Classification', 'TDS Compliance'], type: 'Business', formType: 'ITR2' },
    { name: 'HUF Filing', price: 2499, features: ['HUF Income', 'Family Business', 'Property Income'], type: 'Business', formType: 'ITR3' },

    // Registrations map to Business + OTHER
    { name: 'GST Registration', price: 1499, features: ['Online GST Registration', 'Document Preparation', 'GSTIN Certificate'], type: 'Business', formType: 'OTHER' },
    { name: 'HUF Registration', price: 2999, features: ['HUF Deed Preparation', 'PAN Application', 'Legal Documentation'], type: 'Business', formType: 'OTHER' },
    { name: 'Company Registration', price: 6999, features: ['ROC Filing', 'Certificate of Incorporation', 'Digital Signatures'], type: 'Business', formType: 'OTHER' },
    { name: 'LLP Registration', price: 4999, features: ['LLP Agreement', 'ROC Registration', 'Compliance Setup'], type: 'Business', formType: 'OTHER' },

    // Others
    { name: 'GST Filing', price: 999, features: ['GSTR-1 Filing', 'GSTR-3B Filing', 'Input Tax Credit'], type: 'Business', formType: 'GST' },
    { name: 'TDS Filing', price: 1499, features: ['TDS Return Filing', 'Certificate Generation', 'Compliance Tracking'], type: 'Business', formType: 'OTHER' },
    { name: 'PF & ESIC', price: 1999, features: ['PF Registration', 'ESIC Registration', 'Monthly Returns'], type: 'Business', formType: 'OTHER' }
];

const importData = async () => {
    try {
        await connectDB();

        await Plan.deleteMany(); // Clear existing
        console.log('Plans cleared...');

        await Plan.insertMany(plans);
        console.log('Plans Imported!');

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await Plan.deleteMany();
        console.log('Plans Destroyed!');

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
