import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.GCS_BUCKET_NAME,
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error);
    process.exit(1);
  }
}

// Export Firestore instance
export const db = admin.firestore();

// Export Storage instance
export const storage = admin.storage();

// Export Auth instance
export const auth = admin.auth();

// Health check
export const healthCheck = async () => {
  try {
    await db.collection('_health').doc('check').set({ timestamp: new Date() });
    console.log('✅ Firestore connection verified');
    return true;
  } catch (error) {
    console.error('❌ Firestore connection failed:', error.message);
    return false;
  }
};

export default admin;
