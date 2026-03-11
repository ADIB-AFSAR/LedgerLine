import admin from 'firebase-admin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('c:/Users/pawan.saini/Documents/GitHub/LedgerLine/server/config/serviceAccountKey.json');

const test = async () => {
    try {
        let pKey = serviceAccount.private_key || serviceAccount.privateKey;
        const formattedKey = pKey.replace(/\\n/g, '\n');

        if (admin.apps.length > 0) {
            await Promise.all(admin.apps.map(app => app.delete()));
        }

        const credential = admin.credential.cert({
            projectId: serviceAccount.project_id || serviceAccount.projectId,
            clientEmail: serviceAccount.client_email || serviceAccount.clientEmail,
            privateKey: formattedKey
        });

        const app = admin.initializeApp({
            credential: credential
        });
        
        console.log("App initialized");
        const token = await credential.getAccessToken();
        console.log("Access token retrieved Success!");
        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err.message);
        process.exit(1);
    }
};

test();
