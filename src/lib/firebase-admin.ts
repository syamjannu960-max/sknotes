import * as admin from 'firebase-admin';

// This file is for SERVER-SIDE operations only.

// Ensure the app is not already initialized
if (!admin.apps.length) {
  try {
    // The GOOGLE_APPLICATION_CREDENTIALS environment variable is a base64 encoded string
    // of the service account JSON file. We need to decode it first.
    const serviceAccountString = Buffer.from(
      process.env.GOOGLE_APPLICATION_CREDENTIALS!,
      'base64'
    ).toString('utf8');

    const serviceAccount = JSON.parse(serviceAccountString);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const adminDb = admin.firestore();
