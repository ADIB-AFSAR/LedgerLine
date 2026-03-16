import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

const initializeFirebase = () => {
    try {
        if (admin.apps.length === 0) {
            const privateKey = serviceAccount.private_key.replace(/\\n/g, '\n');
            
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: serviceAccount.project_id,
                    clientEmail: serviceAccount.client_email,
                    privateKey: privateKey,
                }),
                storageBucket: "itr-project-9be2b.firebasestorage.app"
            });
            console.log('Firebase Admin Initialized Successfully');
        }
    } catch (error) {
        console.error('Firebase Admin Initialization Failed:', error);
    }
};

initializeFirebase();

const bucket = admin.storage().bucket();

export { bucket };
