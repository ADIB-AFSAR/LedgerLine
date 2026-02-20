import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

const initializeFirebase = () => {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: "itr-project-9be2b.appspot.com"
        });
        console.log('Firebase Admin Initialized Successfully');
    } catch (error) {
        console.error('Firebase Admin Initialization Failed:', error);
    }
};

initializeFirebase();

let bucket;

if (admin.apps.length > 0) {
    bucket = admin.storage().bucket();
}

export { bucket };
