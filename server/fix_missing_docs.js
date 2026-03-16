import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ITRForm from './models/ITRForm.js';
import { connectDB } from './config/index.js';

dotenv.config();

const fixMissingDocs = async () => {
    try {
        await connectDB();
        const itrs = await ITRForm.find({ 'documentRequests.0': { $exists: true } });
        console.log(`Checking ${itrs.length} ITRs for missing documents...`);

        for (const itr of itrs) {
            let changed = false;
            for (const request of itr.documentRequests) {
                if (request.status === 'Fulfilled' && request.responseDocs && request.responseDocs.length > 0) {
                    for (const docId of request.responseDocs) {
                        const docIdStr = docId.toString();
                        const exists = itr.uploadedDocs.some(d => d.toString() === docIdStr);
                        if (!exists) {
                            console.log(`Adding missing document ${docIdStr} to ITR ${itr._id}`);
                            itr.uploadedDocs.push(docId);
                            changed = true;
                        }
                    }
                }
            }
            if (changed) {
                await itr.save();
                console.log(`Updated ITR ${itr._id}`);
            }
        }
        console.log('Fix completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing documents:', error);
        process.exit(1);
    }
};

// Wait a bit for DB connection
setTimeout(fixMissingDocs, 2000);
