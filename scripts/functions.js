
/**
 * @fileoverview Firebase Cloud Function to automatically assign an admin role.
 *
 * This function triggers when a new Firebase user is created. If the user's
 * email matches the designated admin email, it sets a custom claim `{ admin: true }`.
 *
 * To deploy, you will need to set up Firebase Cloud Functions in your project.
 */

// Import the necessary Cloud Functions modules
import { onUserCreate } from 'firebase-functions/v2/auth';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';

// Initialize Firebase Admin SDK
initializeApp();

// --- Configuration ---
const ADMIN_EMAIL = 'admin@minicar.it';

/**
 * Cloud Function that triggers on new user creation.
 */
export const addAdminRole = onUserCreate(async (event) => {
  const user = event.data; // The user object.
  const email = user.email; // The email of the user.
  const uid = user.uid; // The UID of the user.

  // Check if the new user's email matches the admin email.
  if (email === ADMIN_EMAIL) {
    console.log(`New user matches admin email: ${email}. Setting admin claim.`);
    try {
      // Set the custom claim { admin: true }
      await getAuth().setCustomUserClaims(uid, { admin: true });
      console.log(`✅ Success! Custom claim { admin: true } has been set for user: ${uid}`);
      return;
    } catch (error) {
      console.error(`❌ Error setting custom claim for ${uid}:`, error);
      return;
    }
  }

  console.log(`New user created: ${email}. No admin claim set.`);
});
