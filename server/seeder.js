import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
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
    { name: 'Salary (Basic) ITR', features: ['ITR-1', 'Salary Income', 'Standard Deductions'], type: 'Basic', formType: 'ITR1' },
    { name: 'Salary (Premium)', features: ['ITR-2', 'Multiple Income Sources', 'House Property'], type: 'Premium', formType: 'ITR2' },
    { name: 'Capital Gain', features: ['LTCG & STCG', 'Stock Market Gains', 'Property Sales'], type: 'Premium', formType: 'ITR2' },
    { name: 'Foreign / NRI Income', features: ['NRI Tax Filing', 'Foreign Income', 'DTAA Benefits'], type: 'Premium', formType: 'ITR2' },

    { name: 'Business & Profession', features: ['ITR-3/ITR-4', 'Business Income', 'Professional Income'], type: 'Business', formType: 'ITR3' },
    { name: 'F&O Trading', features: ['F&O Trading Income', 'Speculative Income', 'Loss Carry Forward'], type: 'Business', formType: 'ITR3' },
    { name: 'House Property', features: ['Rental Income', 'Property Tax Deductions', 'Home Loan Interest'], type: 'Business', formType: 'ITR2' },
    { name: 'Crypto Trading', features: ['Crypto Trading Income', 'VDA Classification', 'TDS Compliance'], type: 'Business', formType: 'ITR2' },
    { name: 'HUF Filing', features: ['HUF Income', 'Family Business', 'Property Income'], type: 'Business', formType: 'ITR3' },

    // Registrations map to Business + OTHER
    { name: 'GST Registration', features: ['Online GST Registration', 'Document Preparation', 'GSTIN Certificate'], type: 'Business', formType: 'OTHER' },
    { name: 'HUF Registration', features: ['HUF Deed Preparation', 'PAN Application', 'Legal Documentation'], type: 'Business', formType: 'OTHER' },
    { name: 'Company Registration', features: ['ROC Filing', 'Certificate of Incorporation', 'Digital Signatures'], type: 'Business', formType: 'OTHER' },
    { name: 'LLP Registration', features: ['LLP Agreement', 'ROC Registration', 'Compliance Setup'], type: 'Business', formType: 'OTHER' },

    // Others
    { name: 'GST Return Filing', features: ['GSTR-1 Filing', 'GSTR-3B Filing', 'Input Tax Credit'], type: 'Business', formType: 'GST' },
    { name: 'Form 26QB Filing – TDS on Property Purchase', features: ['TDS Return Filing', 'Certificate Generation', 'Compliance Tracking'], type: 'Business', formType: 'OTHER' },
    { name: 'PF & ESIC Registration', features: ['PF Registration', 'ESIC Registration', 'Monthly Returns'], type: 'Business', formType: 'OTHER' },
    { name: 'ROC Filing', features: ['Form 11', 'Form 8', 'MGT-7A', 'AOC-4', 'ADT-1'], type: 'Business', formType: 'OTHER' },
    { name: 'Digital Signature Certificate (DSC)', features: ['Class 3 DSC', 'Validity up to 2 Years'], type: 'Business', formType: 'OTHER' },
    { name: 'Startup India Registration', features: ['DPIIT Startup Recognition', 'Startup India Portal'], type: 'Business', formType: 'OTHER' },
    { name: 'Test Production Plan', features: ['Production Test', 'Real Payment Verification'], type: 'Basic', formType: 'OTHER' },
    { name: 'Annual Compliance Filing', features: ['Annual ROC Compliance Management', 'AOC-4 Filing', 'MGT-7 Filing'], type: 'Business', formType: 'OTHER' }
];

const plansConfigPath = join(__dirname, '../client/src/data/plansConfig.json');
const plansConfig = JSON.parse(fs.readFileSync(plansConfigPath, 'utf8'));

const planIdMapping = {
    'Salary (Basic) ITR': 'salary-basic-itr',
    'Salary (Premium)': 'salary-premium',
    'Capital Gain': 'capital-gain',
    'Foreign / NRI Income': 'nri-income',
    'Business & Profession': 'business-profession',
    'F&O Trading': 'fo-trading',
    'House Property': 'house-property',
    'Crypto Trading': 'crypto-trading',
    'HUF Filing': 'huf-filing',
    'GST Registration': 'gst-registration',
    'HUF Registration': 'huf-registration',
    'Company Registration': 'company-registration',
    'LLP Registration': 'llp-registration',
    'GST Return Filing': 'gst-filing',
    'Form 26QB Filing – TDS on Property Purchase': 'tds-filing',
    'PF & ESIC Registration': 'pf-esic',
    'Test Production Plan': 'test-production-plan',
    'ROC Filing': 'roc-filing',
    'Digital Signature Certificate (DSC)': 'dsc',
    'Startup India Registration': 'startup-india-registration',
    'Annual Compliance Filing': 'annual-compliance-filing'
};

plans.forEach(plan => {
    const id = planIdMapping[plan.name];
    if (id && plansConfig[id]) {
        plan.price = plansConfig[id].price;
    }
});

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
