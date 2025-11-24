import * as admin from 'firebase-admin';

// This file is for SERVER-SIDE operations only.

function initializeAdminApp() {
  // Ensure the app is not already initialized
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // The GOOGLE_APPLICATION_CREDENTIALS environment variable is a base64 encoded string
  // of the service account JSON file. We need to decode it.
  const serviceAccountString = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!serviceAccountString) {
    console.error(
      'Firebase Admin SDK initialization failed: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.'
    );
    // Return null or throw an error to prevent further execution
    throw new Error('Firebase Admin SDK not initialized.');
  }

  try {
    const decodedServiceAccount = Buffer.from(
      serviceAccountString,
      'base64'
    ).toString('utf8');

    const serviceAccount = JSON.parse(decodedServiceAccount);

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.stack);
    throw new Error('Firebase Admin SDK could not be initialized.');
  }
}

// Initialize the app and export the db instance.
// This structure ensures that we don't try to access firestore() if initialization fails.
const adminApp = initializeAdminApp();
export const adminDb = adminApp.firestore();
