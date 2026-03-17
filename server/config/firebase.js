import admin from 'firebase-admin';

const initializeFirebase = () => {
    try {
        if (admin.apps.length === 0) {
            const privateKey = process.env.FIREBASE_PRIVATE_KEY
                ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').trim()
                : undefined;
            
            if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
                console.error('Missing Firebase environment variables');
                return;
            }

            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                }),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "itr-project-9be2b.firebasestorage.app"
            });
            console.log('Firebase Admin Initialized Successfully via Environment Variables');
        }
    } catch (error) {
        console.error('Firebase Admin Initialization Failed:', error);
    }
};

initializeFirebase();

const bucket = admin.storage().bucket();

export { bucket };
