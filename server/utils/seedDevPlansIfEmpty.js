import Plan from '../models/Plan.js';
import { getDbEnv } from '../config/database.js';
import { connectDB } from '../config/index.js';

const DEFAULT_PLANS = [
    { name: 'Salary (Basic) ITR', price: 599, features: ['ITR-1', 'Salary Income', 'Standard Deductions'], type: 'Basic', formType: 'ITR1' },
    { name: 'Salary (Premium)', price: 999, features: ['ITR-2', 'Multiple Income Sources', 'House Property'], type: 'Premium', formType: 'ITR2' },
    { name: 'Capital Gain', price: 1499, features: ['LTCG & STCG', 'Stock Market Gains', 'Property Sales'], type: 'Premium', formType: 'ITR2' },
    { name: 'Foreign/NRI Income', price: 1999, features: ['NRI Tax Filing', 'Foreign Income', 'DTAA Benefits'], type: 'Premium', formType: 'ITR2' },
    { name: 'Business & Profession', price: 1499, features: ['ITR-3/ITR-4', 'Business Income', 'Professional Income'], type: 'Business', formType: 'ITR3' },
    { name: 'F&O Trading', price: 1299, features: ['F&O Trading Income', 'Speculative Income', 'Loss Carry Forward'], type: 'Business', formType: 'ITR3' },
    { name: 'House Property', price: 899, features: ['Rental Income', 'Property Tax Deductions', 'Home Loan Interest'], type: 'Business', formType: 'ITR2' },
    { name: 'Crypto Trading', price: 1999, features: ['Crypto Trading Income', 'VDA Classification', 'TDS Compliance'], type: 'Business', formType: 'ITR2' },
    { name: 'HUF Filing', price: 1299, features: ['HUF Income', 'Family Business', 'Property Income'], type: 'Business', formType: 'ITR3' },

    // Registrations map to Business + OTHER
    { name: 'GST Registration', price: 1499, features: ['Online GST Registration', 'Document Preparation', 'GSTIN Certificate'], type: 'Business', formType: 'OTHER' },
    { name: 'HUF Registration', price: 2999, features: ['HUF Deed Preparation', 'PAN Application', 'Legal Documentation'], type: 'Business', formType: 'OTHER' },
    { name: 'Company Registration', price: 6999, features: ['ROC Filing', 'Certificate of Incorporation', 'Digital Signatures'], type: 'Business', formType: 'OTHER' },
    { name: 'LLP Registration', price: 4999, features: ['LLP Agreement', 'ROC Registration', 'Compliance Setup'], type: 'Business', formType: 'OTHER' },

    // Others
    { name: 'GST Filing', price: 999, features: ['GSTR-1 Filing', 'GSTR-3B Filing', 'Input Tax Credit'], type: 'Business', formType: 'GST' },
    { name: 'TDS Filing', price: 899, features: ['TDS Return Filing', 'Certificate Generation', 'Compliance Tracking'], type: 'Business', formType: 'OTHER' },
    { name: 'PF & ESIC', price: 1499, features: ['PF Registration', 'ESIC Registration', 'Monthly Returns'], type: 'Business', formType: 'OTHER' },
    { name: 'Test Production Plan', price: 1, features: ['Production Test', 'Real Payment Verification'], type: 'Basic', formType: 'OTHER' },
].map((p) => ({
    ...p,
    // isActive default exists, but set explicitly so this never depends on schema defaults
    isActive: true,
}));

export const seedDevPlansIfEmpty = async () => {
    // Only seed when running against dev collections.
    if (getDbEnv() !== 'development') return;

    try {
        await connectDB();
        const count = await Plan.countDocuments();
        if (count > 0) return;

        await Plan.insertMany(DEFAULT_PLANS);
        console.log(`[seedDevPlansIfEmpty] Seeded ${DEFAULT_PLANS.length} plans into ${Plan.collection?.collectionName || 'dev_plans'}`);
    } catch (err) {
        console.error('[seedDevPlansIfEmpty] Failed to seed dev plans:', err);
    }
};

