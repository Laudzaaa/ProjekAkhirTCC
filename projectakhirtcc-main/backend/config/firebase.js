import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Parse Firebase private key
const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

const firebaseConfig = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: "key123",
  private_key: privateKey,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: "123456789",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/perpustakaan-api%40e-31-489014.iam.gserviceaccount.com"
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  storageBucket: process.env.GCS_BUCKET_NAME
});

const db = admin.firestore();
const storage = admin.storage();
const auth = admin.auth();

// Health check
export const healthCheck = async () => {
  try {
    await db.collection('_health').doc('status').set({
      timestamp: new Date(),
      status: 'healthy'
    });
    console.log('✅ Firebase connected!');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
    return false;
  }
};

export { db, storage, auth };
